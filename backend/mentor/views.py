from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from analytics.models import UserStats, TopicStats
from .models import ChatSession, ChatMessage
from .serializers import ChatMessageSerializer, SendMessageSerializer
from .services import ask_mentor


def get_or_create_session(user):
    """Get the user's active chat session (one per user)."""
    session, _ = ChatSession.objects.get_or_create(user=user)
    return session


def build_stats_context(user):
    """Build stats dict to inject into Groq system prompt."""
    try:
        stats = UserStats.objects.get(user=user)
        stats_context = {
            "ranking": stats.ranking,
            "total_solved": stats.total_solved,
            "easy_solved": stats.easy_solved,
            "medium_solved": stats.medium_solved,
            "hard_solved": stats.hard_solved,
        }
    except UserStats.DoesNotExist:
        stats_context = {}

    weak = list(
        TopicStats.objects.filter(user=user)
        .order_by("solved_count")
        .values_list("topic_name", flat=True)[:5]
    )
    strong = list(
        TopicStats.objects.filter(user=user)
        .order_by("-solved_count")
        .values_list("topic_name", flat=True)[:5]
    )
    stats_context["weak_topics"] = weak
    stats_context["strong_topics"] = strong
    return stats_context


class ChatView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_scope = "ai_generation"

    def post(self, request):
        """Send a message and get AI reply."""
        serializer = SendMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user_message = serializer.validated_data["message"]
        session = get_or_create_session(request.user)

        # Fetch history for context
        history_qs = ChatMessage.objects.filter(session=session).order_by("timestamp")
        history = [{"role": m.role, "content": m.content} for m in history_qs]

        # Build stats context
        stats_context = build_stats_context(request.user)

        # Call Groq
        try:
            ai_reply = ask_mentor(user_message, stats_context, history)
        except Exception as e:
            return Response(
                {"error": f"AI service error: {str(e)}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # Save both messages
        ChatMessage.objects.create(session=session, role="user", content=user_message)
        assistant_msg = ChatMessage.objects.create(
            session=session, role="assistant", content=ai_reply
        )

        return Response({
            "reply": ai_reply,
            "message": ChatMessageSerializer(assistant_msg).data
        })

    def get(self, request):
        """Get full chat history."""
        session = get_or_create_session(request.user)
        messages = ChatMessage.objects.filter(session=session).order_by("timestamp")
        serializer = ChatMessageSerializer(messages, many=True)
        return Response({"messages": serializer.data})

    def delete(self, request):
        """Clear all chat history."""
        session = get_or_create_session(request.user)
        ChatMessage.objects.filter(session=session).delete()
        return Response({"message": "Chat history cleared."})


from django.http import StreamingHttpResponse
import json
from .services import stream_mentor


class StreamChatView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_scope = "ai_generation"

    def post(self, request):
        """Stream real-time AI replies token by token via Server-Sent Events."""
        serializer = SendMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user_message = serializer.validated_data["message"]
        session = get_or_create_session(request.user)

        history_qs = ChatMessage.objects.filter(session=session).order_by("timestamp")
        history = [{"role": m.role, "content": m.content} for m in history_qs]
        stats_context = build_stats_context(request.user)

        ChatMessage.objects.create(session=session, role="user", content=user_message)

        def event_stream():
            full_reply = []
            try:
                for chunk in stream_mentor(user_message, stats_context, history):
                    full_reply.append(chunk)
                    yield f"data: {json.dumps({'chunk': chunk})}\n\n"
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
            finally:
                complete_text = "".join(full_reply)
                if complete_text:
                    assistant_msg = ChatMessage.objects.create(
                        session=session, role="assistant", content=complete_text
                    )
                    yield f"data: {json.dumps({'done': True, 'id': assistant_msg.id})}\n\n"

        response = StreamingHttpResponse(
            event_stream(),
            content_type="text/event-stream"
        )
        response['Cache-Control'] = 'no-cache'
        response['X-Accel-Buffering'] = 'no'
        return response


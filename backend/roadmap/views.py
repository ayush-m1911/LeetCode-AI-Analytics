from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from analytics.models import (
    UserStats,
    TopicStats
)

from .services import generate_dsa_roadmap
from .models import Roadmap
from .serializers import RoadmapListSerializer, RoadmapDetailSerializer

class GenerateRoadmapView(APIView):

    permission_classes = [IsAuthenticated]
    throttle_scope = "ai_generation"

    def post(self, request):
        goal = request.data.get("goal")
        if not goal:
            return Response(
                {"error": "Please provide a goal for the roadmap."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            stats = UserStats.objects.get(user=request.user)
        except UserStats.DoesNotExist:
            return Response(
                {"error": "No stats found. Please sync your LeetCode profile on the Dashboard first."},
                status=status.HTTP_400_BAD_REQUEST
            )

        weak_topics = list(
            TopicStats.objects.filter(user=request.user)
            .order_by("solved_count")
            .values_list("topic_name", flat=True)[:5]
        )
        strong_topics = list(
            TopicStats.objects.filter(user=request.user)
            .order_by("-solved_count")
            .values_list("topic_name", flat=True)[:5]
        )

        try:
            roadmap = generate_dsa_roadmap(
                goal=goal,
                total_solved=stats.total_solved,
                ranking=stats.ranking,
                weak_topics=weak_topics,
                strong_topics=strong_topics
            )
        except Exception as e:
            return Response(
                {"error": f"AI service error: {str(e)}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        created_roadmap = Roadmap.objects.create(
            user=request.user,
            goal=goal,
            ranking=stats.ranking,
            total_solved=stats.total_solved,
            weak_topics=weak_topics,
            strong_topics=strong_topics,
            roadmap=roadmap
        )
        return Response({
            "id": created_roadmap.id,
            "roadmap": roadmap
        }, status=status.HTTP_201_CREATED)


class RoadmapListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        roadmaps = Roadmap.objects.filter(user=request.user).order_by('-created_at')
        serializer = RoadmapListSerializer(roadmaps, many=True)
        return Response({"roadmaps": serializer.data})


class RoadmapDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            roadmap = Roadmap.objects.get(pk=pk, user=request.user)
        except Roadmap.DoesNotExist:
            return Response({"error": "Roadmap not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = RoadmapDetailSerializer(roadmap)
        return Response(serializer.data)


class ToggleRoadmapItemView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            roadmap = Roadmap.objects.get(pk=pk, user=request.user)
        except Roadmap.DoesNotExist:
            return Response({"error": "Roadmap not found."}, status=status.HTTP_404_NOT_FOUND)

        item_id = request.data.get("item_id")
        if not item_id:
            return Response({"error": "item_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        completed = list(roadmap.completed_items or [])
        if item_id in completed:
            completed.remove(item_id)
        else:
            completed.append(item_id)

        roadmap.completed_items = completed
        roadmap.save(update_fields=["completed_items"])

        return Response({
            "id": roadmap.id,
            "completed_items": roadmap.completed_items,
        })

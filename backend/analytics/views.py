from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import UserStats, TopicStats
from .serializers import UserStatsSerializer, DashboardSerializer, TopicStatsSerializer

from .services import (
    fetch_leetcode_stats,
    parse_leetcode_stats,
    parse_topic_stats
)

class FetchLeetCodeStatsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        username = request.user.leetcode_username
        if not username:
            return Response(
                {"error": "LeetCode username not set. Please add it to your profile first."},
                status=400
            )

        try:
            data = fetch_leetcode_stats(username)
            return Response(data)
        except ValueError as e:
            return Response({"error": str(e)}, status=404)
        except Exception as e:
            return Response(
                {"error": f"Failed to fetch LeetCode data: {str(e)}"},
                status=502
            )

class SyncStatsView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = request.user.leetcode_username
        if not username:
            return Response(
                {"error": "LeetCode username missing in profile."},
                status=400
            )

        try:
            raw_data = fetch_leetcode_stats(username)
            parsed_data = parse_leetcode_stats(raw_data)
        except ValueError as e:
            return Response({"error": str(e)}, status=404)
        except Exception as e:
            return Response(
                {"error": f"Failed to connect to LeetCode API: {str(e)}"},
                status=502
            )

        stats, created = UserStats.objects.update_or_create(
            user=request.user,
            defaults=parsed_data
        )

        # Also sync topics in the same call for data consistency
        try:
            topics = parse_topic_stats(raw_data)
            for topic in topics:
                TopicStats.objects.update_or_create(
                    user=request.user,
                    topic_name=topic["topic_name"],
                    defaults={
                        "solved_count": topic["solved_count"],
                        "category": topic["category"]
                    }
                )
        except Exception:
            pass  # Non-blocking for primary stats

        serializer = UserStatsSerializer(stats)
        return Response(serializer.data)
    
class DashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            stats = UserStats.objects.get(user=request.user)
        except UserStats.DoesNotExist:
            return Response(
                {"error": "No stats found. Sync first."},
                status=404
            )

        serializer = DashboardSerializer(stats)
        return Response(serializer.data)

class SyncTopicsView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = request.user.leetcode_username
        if not username:
            return Response(
                {"error": "LeetCode username missing in profile."},
                status=400
            )

        try:
            raw_data = fetch_leetcode_stats(username)
            topics = parse_topic_stats(raw_data)
        except ValueError as e:
            return Response({"error": str(e)}, status=404)
        except Exception as e:
            return Response(
                {"error": f"Failed to connect to LeetCode API: {str(e)}"},
                status=502
            )

        for topic in topics:
            TopicStats.objects.update_or_create(
                user=request.user,
                topic_name=topic["topic_name"],
                defaults={
                    "solved_count": topic["solved_count"],
                    "category": topic["category"]
                }
            )

        return Response(
            {"message": "Topics synced successfully"}
        )


class TopicsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        topics = TopicStats.objects.filter(
            user=request.user
        )

        serializer = TopicStatsSerializer(
            topics,
            many=True
        )

        return Response(serializer.data)

class WeakTopicsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        topics = TopicStats.objects.filter(
            user=request.user
        ).order_by(
            "solved_count"
        )[:5]

        serializer = TopicStatsSerializer(
            topics,
            many=True
        )

        return Response(serializer.data)

class StrongTopicsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        topics = TopicStats.objects.filter(
            user=request.user
        ).order_by(
            "-solved_count"
        )[:5]

        serializer = TopicStatsSerializer(
            topics,
            many=True
        )

        return Response(serializer.data)
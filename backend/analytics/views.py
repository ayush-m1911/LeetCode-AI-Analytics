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
                {
                    "error": "LeetCode username not set"
                },
                status=400
            )

        data = fetch_leetcode_stats(username)

        return Response(data)

class SyncStatsView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        username = request.user.leetcode_username

        if not username:
            return Response(
                {"error": "LeetCode username missing"},
                status=400
            )

        raw_data = fetch_leetcode_stats(username)

        parsed_data = parse_leetcode_stats(raw_data)

        stats, created = UserStats.objects.update_or_create(
            user=request.user,
            defaults=parsed_data
        )

        serializer = UserStatsSerializer(stats)

        return Response(serializer.data)
    
class DashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        try:
            stats = UserStats.objects.get(
                user=request.user
            )

        except UserStats.DoesNotExist:

            return Response(
                {
                    "error": "No stats found. Sync first."
                },
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
                {
                    "error": "LeetCode username missing"
                },
                status=400
            )

        raw_data = fetch_leetcode_stats(username)

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

        return Response(
            {
                "message": "Topics synced successfully"
            }
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
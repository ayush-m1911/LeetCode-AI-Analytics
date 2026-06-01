from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from analytics.models import UserStats, TopicStats
from .models import Recommendation
from .serializers import RecommendationSerializer
from .services import generate_recommendations


def build_stats_context(user):
    try:
        stats = UserStats.objects.get(user=user)
        ctx = {
            "ranking": stats.ranking,
            "total_solved": stats.total_solved,
            "easy_solved": stats.easy_solved,
            "medium_solved": stats.medium_solved,
            "hard_solved": stats.hard_solved,
        }
    except UserStats.DoesNotExist:
        ctx = {}

    ctx["weak_topics"] = list(
        TopicStats.objects.filter(user=user)
        .order_by("solved_count")
        .values_list("topic_name", flat=True)[:5]
    )
    ctx["strong_topics"] = list(
        TopicStats.objects.filter(user=user)
        .order_by("-solved_count")
        .values_list("topic_name", flat=True)[:5]
    )
    return ctx


class GenerateRecommendationsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        stats_context = build_stats_context(request.user)
        try:
            recs = generate_recommendations(stats_context)
        except Exception as e:
            return Response(
                {"error": f"AI service error: {str(e)}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        if not recs:
            return Response(
                {"error": "Could not generate recommendations. Try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Delete old recommendations for this user
        Recommendation.objects.filter(user=request.user).delete()

        # Save new recommendations
        saved = []
        for r in recs:
            obj = Recommendation.objects.create(
                user=request.user,
                title=r["title"],
                difficulty=r["difficulty"],
                topic=r["topic"],
                reason=r["reason"],
                leetcode_url=r["leetcode_url"],
            )
            saved.append(obj)

        serializer = RecommendationSerializer(saved, many=True)
        return Response({"recommendations": serializer.data})


class RecommendationsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        recs = Recommendation.objects.filter(user=request.user)
        serializer = RecommendationSerializer(recs, many=True)
        data = serializer.data

        grouped = {
            "Easy": [r for r in data if r["difficulty"] == "Easy"],
            "Medium": [r for r in data if r["difficulty"] == "Medium"],
            "Hard": [r for r in data if r["difficulty"] == "Hard"],
        }
        return Response({"recommendations": grouped})

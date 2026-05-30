from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from analytics.models import (
    UserStats,
    TopicStats
)

from .services import generate_dsa_roadmap
from .models import Roadmap

class GenerateRoadmapView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        goal = request.data.get("goal")
        stats = UserStats.objects.get(
    user=request.user
)
        weak_topics = list(
    TopicStats.objects.filter(
        user=request.user
    )
    .order_by("solved_count")
    .values_list(
        "topic_name",
        flat=True
    )[:5]
)
        strong_topics = list(
    TopicStats.objects.filter(
        user=request.user
    )
    .order_by("-solved_count")
    .values_list(
        "topic_name",
        flat=True
    )[:5]
)
        roadmap = generate_dsa_roadmap(
    goal=goal,
    total_solved=stats.total_solved,
    ranking=stats.ranking,
    weak_topics=weak_topics,
    strong_topics=strong_topics
)
        Roadmap.objects.create(
    user=request.user,
    goal=goal,

    ranking=stats.ranking,
    total_solved=stats.total_solved,

    weak_topics=weak_topics,
    strong_topics=strong_topics,

    roadmap=roadmap
)
        return Response({
    "roadmap": roadmap
})
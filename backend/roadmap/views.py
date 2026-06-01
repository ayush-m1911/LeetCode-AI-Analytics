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
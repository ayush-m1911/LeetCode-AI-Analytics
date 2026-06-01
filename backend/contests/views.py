from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import ContestHistory
from .serializers import ContestHistorySerializer
from .services import fetch_contest_history


class SyncContestsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = request.user.leetcode_username
        if not username:
            return Response(
                {"error": "LeetCode username not set. Go to Profile first."},
                status=status.HTTP_400_BAD_REQUEST
            )

        contests = fetch_contest_history(username)
        if not contests:
            return Response(
                {"message": "No contest history found or LeetCode API unavailable.", "synced": 0}
            )

        synced = 0
        for c in contests:
            if c["attended_at"] is None:
                continue
            ContestHistory.objects.update_or_create(
                user=request.user,
                contest_title=c["contest_title"],
                defaults={
                    "ranking": c["ranking"],
                    "rating": c["rating"],
                    "rating_change": c["rating_change"],
                    "problems_solved": c["problems_solved"],
                    "total_problems": c["total_problems"],
                    "attended_at": c["attended_at"],
                    "finish_time_in_seconds": c["finish_time_in_seconds"],
                }
            )
            synced += 1

        return Response({"message": f"Synced {synced} contests.", "synced": synced})


class ContestHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        contests = ContestHistory.objects.filter(user=request.user).order_by("attended_at")
        serializer = ContestHistorySerializer(contests, many=True)

        contest_list = serializer.data
        total = len(contest_list)
        best_rank = min((c["ranking"] for c in contest_list), default=0)
        avg_rank = round(
            sum(c["ranking"] for c in contest_list) / total, 1
        ) if total > 0 else 0
        best_rating = max((c["rating"] for c in contest_list), default=0)

        return Response({
            "stats": {
                "total_contests": total,
                "best_rank": best_rank,
                "average_rank": avg_rank,
                "best_rating": round(best_rating, 1),
            },
            "history": contest_list
        })

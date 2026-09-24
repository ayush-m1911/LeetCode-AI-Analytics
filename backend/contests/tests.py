from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch
from datetime import datetime, timezone

from contests.models import ContestHistory

User = get_user_model()


class ContestsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="contesttester",
            email="contest@example.com",
            password="testpass123",
            leetcode_username="contest_king"
        )
        self.sync_url = "/api/contests/sync/"
        self.history_url = "/api/contests/history/"

    @patch("contests.views.fetch_contest_history")
    def test_sync_contest_history(self, mock_fetch):
        mock_fetch.return_value = [
            {
                "contest_title": "Weekly Contest 380",
                "ranking": 1500,
                "rating": 1820.5,
                "rating_change": 25.5,
                "problems_solved": 3,
                "total_problems": 4,
                "attended_at": datetime.now(timezone.utc),
                "finish_time_in_seconds": 3200,
            }
        ]
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.sync_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(ContestHistory.objects.filter(user=self.user).count(), 1)

    def test_get_contest_history(self):
        ContestHistory.objects.create(
            user=self.user,
            contest_title="Biweekly Contest 120",
            ranking=950,
            rating=1850.0,
            rating_change=30.0,
            problems_solved=3,
            total_problems=4,
            attended_at=datetime.now(timezone.utc),
            finish_time_in_seconds=2900
        )
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.history_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["history"]), 1)
        self.assertEqual(response.data["history"][0]["contest_title"], "Biweekly Contest 120")


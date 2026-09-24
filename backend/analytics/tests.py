from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch

from analytics.models import UserStats, TopicStats
from analytics.services import parse_leetcode_stats, parse_topic_stats

User = get_user_model()


class AnalyticsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="analytictester",
            email="tester@example.com",
            password="testpass123",
            leetcode_username="tourist"
        )
        self.raw_leetcode_data = {
            "data": {
                "matchedUser": {
                    "profile": {"ranking": 4500},
                    "submitStats": {
                        "acSubmissionNum": [
                            {"difficulty": "All", "count": 150},
                            {"difficulty": "Easy", "count": 70},
                            {"difficulty": "Medium", "count": 60},
                            {"difficulty": "Hard", "count": 20},
                        ]
                    },
                    "tagProblemCounts": {
                        "fundamental": [
                            {"tagName": "Array", "problemsSolved": 45},
                            {"tagName": "String", "problemsSolved": 30}
                        ],
                        "intermediate": [
                            {"tagName": "Tree", "problemsSolved": 15}
                        ]
                    }
                }
            }
        }

    def test_parse_leetcode_stats(self):
        parsed = parse_leetcode_stats(self.raw_leetcode_data)
        self.assertEqual(parsed["ranking"], 4500)
        self.assertEqual(parsed["total_solved"], 150)
        self.assertEqual(parsed["easy_solved"], 70)
        self.assertEqual(parsed["medium_solved"], 60)
        self.assertEqual(parsed["hard_solved"], 20)

    def test_parse_topic_stats(self):
        topics = parse_topic_stats(self.raw_leetcode_data)
        self.assertEqual(len(topics), 3)
        self.assertEqual(topics[0]["topic_name"], "Array")
        self.assertEqual(topics[0]["solved_count"], 45)

    @patch("analytics.views.fetch_leetcode_stats")
    def test_sync_stats_view(self, mock_fetch):
        mock_fetch.return_value = self.raw_leetcode_data
        self.client.force_authenticate(user=self.user)

        response = self.client.post("/api/analytics/sync/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total_solved"], 150)
        self.assertTrue(UserStats.objects.filter(user=self.user).exists())
        self.assertEqual(TopicStats.objects.filter(user=self.user).count(), 3)

    def test_dashboard_view_not_synced(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/analytics/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_dashboard_view_synced(self):
        UserStats.objects.create(
            user=self.user,
            ranking=1200,
            total_solved=250,
            easy_solved=100,
            medium_solved=120,
            hard_solved=30
        )
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/analytics/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total_solved"], 250)

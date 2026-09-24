from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch

from analytics.models import UserStats
from roadmap.models import Roadmap

User = get_user_model()


class RoadmapTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="roadmaptester",
            email="roadmap@example.com",
            password="testpass123",
            leetcode_username="tourist"
        )
        self.generate_url = "/api/roadmap/generate/"
        self.list_url = "/api/roadmap/list/"

    def test_generate_roadmap_without_synced_stats_returns_400(self):
        self.client.force_authenticate(user=self.user)
        payload = {"goal": "Prepare for FAANG SDE-2 in 30 days"}
        response = self.client.post(self.generate_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    @patch("roadmap.views.generate_dsa_roadmap")
    def test_generate_roadmap_success(self, mock_generate):
        mock_generate.return_value = {
            "week1": {
                "focus_topics": ["Arrays", "Two Pointers"],
                "daily_goal": "Solve 2 medium problems",
                "recommended_problems": ["Two Sum", "3Sum"]
            }
        }
        UserStats.objects.create(
            user=self.user,
            ranking=5000,
            total_solved=100,
            easy_solved=50,
            medium_solved=40,
            hard_solved=10
        )
        self.client.force_authenticate(user=self.user)
        payload = {"goal": "Master Dynamic Programming"}
        response = self.client.post(self.generate_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("roadmap", response.data)
        self.assertTrue(Roadmap.objects.filter(user=self.user, goal="Master Dynamic Programming").exists())

    def test_roadmap_list_and_detail(self):
        roadmap = Roadmap.objects.create(
            user=self.user,
            goal="Graph Algorithms",
            ranking=3000,
            total_solved=80,
            roadmap={"week1": {"focus_topics": ["BFS", "DFS"]}}
        )
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["roadmaps"]), 1)

        detail_response = self.client.get(f"/api/roadmap/{roadmap.id}/")
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)
        self.assertEqual(detail_response.data["goal"], "Graph Algorithms")

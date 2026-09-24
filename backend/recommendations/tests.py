from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch

from recommendations.models import Recommendation

User = get_user_model()


class RecommendationsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="rectester",
            email="rec@example.com",
            password="testpass123"
        )
        self.generate_url = "/api/recommendations/generate/"
        self.list_url = "/api/recommendations/list/"

    @patch("recommendations.views.generate_recommendations")
    def test_generate_and_list_recommendations(self, mock_gen):
        mock_gen.return_value = [
            {
                "title": "Two Sum",
                "difficulty": "Easy",
                "topic": "Array",
                "reason": "Master hash maps",
                "leetcode_url": "https://leetcode.com/problems/two-sum/"
            },
            {
                "title": "3Sum",
                "difficulty": "Medium",
                "topic": "Two Pointers",
                "reason": "Two pointers application",
                "leetcode_url": "https://leetcode.com/problems/3sum/"
            },
            {
                "title": "Trapping Rain Water",
                "difficulty": "Hard",
                "topic": "Array",
                "reason": "Classic hard array problem",
                "leetcode_url": "https://leetcode.com/problems/trapping-rain-water/"
            }
        ]
        self.client.force_authenticate(user=self.user)
        gen_resp = self.client.post(self.generate_url)
        self.assertEqual(gen_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(Recommendation.objects.filter(user=self.user).count(), 3)

        list_resp = self.client.get(self.list_url)
        self.assertEqual(list_resp.status_code, status.HTTP_200_OK)
        self.assertIn("Easy", list_resp.data["recommendations"])
        self.assertIn("Medium", list_resp.data["recommendations"])
        self.assertIn("Hard", list_resp.data["recommendations"])

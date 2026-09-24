from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class UserAuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = "/api/users/register/"
        self.me_url = "/api/users/me/"
        self.update_url = "/api/users/update/"
        self.token_url = "/api/token/"

        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="testpassword123",
            leetcode_username="test_lc",
            github_username="test_gh"
        )

    def test_register_success(self):
        payload = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "strongpassword123",
            "leetcode_username": "newuser_lc",
            "github_username": "newuser_gh"
        }
        response = self.client.post(self.register_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="newuser").exists())

    def test_register_duplicate_email(self):
        payload = {
            "username": "anotheruser",
            "email": "testuser@example.com",
            "password": "strongpassword123",
        }
        response = self.client.post(self.register_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_me_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "testuser")
        self.assertEqual(response.data["leetcode_username"], "test_lc")

    def test_me_unauthenticated(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_profile(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            "leetcode_username": "updated_lc",
            "github_username": "updated_gh"
        }
        response = self.client.patch(self.update_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.leetcode_username, "updated_lc")
        self.assertEqual(self.user.github_username, "updated_gh")

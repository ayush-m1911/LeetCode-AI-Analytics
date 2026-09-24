from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch

from mentor.models import ChatSession, ChatMessage

User = get_user_model()


class MentorTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="mentortester",
            email="mentor@example.com",
            password="testpass123"
        )
        self.chat_url = "/api/mentor/chat/"

    @patch("mentor.views.ask_mentor")
    def test_send_message_creates_session_and_reply(self, mock_ask):
        mock_ask.return_value = "Focus on Binary Search on Answer questions."
        self.client.force_authenticate(user=self.user)

        payload = {"message": "How do I improve my binary search speed?"}
        response = self.client.post(self.chat_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["reply"], "Focus on Binary Search on Answer questions.")

        session = ChatSession.objects.get(user=self.user)
        self.assertEqual(ChatMessage.objects.filter(session=session).count(), 2)

    def test_get_and_clear_chat_history(self):
        self.client.force_authenticate(user=self.user)
        session = ChatSession.objects.create(user=self.user)
        ChatMessage.objects.create(session=session, role="user", content="Hello Mentor")
        ChatMessage.objects.create(session=session, role="assistant", content="Hello! How can I help?")

        get_resp = self.client.get(self.chat_url)
        self.assertEqual(get_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(get_resp.data["messages"]), 2)

        del_resp = self.client.delete(self.chat_url)
        self.assertEqual(del_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(ChatMessage.objects.filter(session=session).count(), 0)

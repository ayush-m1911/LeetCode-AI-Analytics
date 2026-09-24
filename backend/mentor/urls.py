from django.urls import path
from .views import ChatView, StreamChatView

urlpatterns = [
    path("chat/", ChatView.as_view()),
    path("chat/stream/", StreamChatView.as_view()),
]


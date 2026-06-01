from django.urls import path
from .views import SyncContestsView, ContestHistoryView

urlpatterns = [
    path("sync/", SyncContestsView.as_view()),
    path("history/", ContestHistoryView.as_view()),
]

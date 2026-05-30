from django.urls import path
from .views import (
    FetchLeetCodeStatsView,
    SyncStatsView,
    DashboardView,
    SyncTopicsView,
    TopicsView,
    WeakTopicsView,
    StrongTopicsView
)

urlpatterns = [

    path(
        "leetcode/",
        FetchLeetCodeStatsView.as_view(),
        name="leetcode-stats"
    ),

    path(
        "sync/",
        SyncStatsView.as_view(),
        name="sync-stats"
    ),

    path(
        "dashboard/",
        DashboardView.as_view(),
        name="dashboard"
    ),

    path(
        "topics/sync/",
        SyncTopicsView.as_view(),
        name="topics-sync"
    ),

    path(
        "topics/",
        TopicsView.as_view(),
        name="topics"
    ),

    path(
        "topics/weak/",
        WeakTopicsView.as_view(),
        name="weak-topics"
    ),

    path(
        "topics/strong/",
        StrongTopicsView.as_view(),
        name="strong-topics"
    ),
]
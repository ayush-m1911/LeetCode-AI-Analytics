from django.urls import path

from .views import (
    GenerateRoadmapView,
    RoadmapListView,
    RoadmapDetailView,
)

urlpatterns = [
    path("generate/", GenerateRoadmapView.as_view()),
    path("list/", RoadmapListView.as_view()),
    path("<int:pk>/", RoadmapDetailView.as_view()),
]
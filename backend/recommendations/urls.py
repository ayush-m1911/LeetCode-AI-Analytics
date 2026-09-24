from django.urls import path
from .views import GenerateRecommendationsView, RecommendationsListView

urlpatterns = [
    path("", RecommendationsListView.as_view()),
    path("list/", RecommendationsListView.as_view()),
    path("generate/", GenerateRecommendationsView.as_view()),
]


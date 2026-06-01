from django.urls import path
from .views import GenerateRecommendationsView, RecommendationsListView

urlpatterns = [
    path("generate/", GenerateRecommendationsView.as_view()),
    path("", RecommendationsListView.as_view()),
]

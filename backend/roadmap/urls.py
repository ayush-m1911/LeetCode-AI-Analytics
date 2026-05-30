from django.urls import path

from .views import (
    GenerateRoadmapView
)

urlpatterns = [
    path(
        "generate/",
        GenerateRoadmapView.as_view()
    )
]
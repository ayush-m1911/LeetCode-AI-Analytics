from django.db import models
from django.conf import settings


class Roadmap(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    goal = models.CharField(
        max_length=255
    )

    ranking = models.IntegerField(
        null=True,
        blank=True
    )

    total_solved = models.IntegerField(
        null=True,
        blank=True
    )

    weak_topics = models.JSONField(
        default=list
    )

    strong_topics = models.JSONField(
        default=list
    )

    roadmap = models.JSONField(
        default=dict
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )
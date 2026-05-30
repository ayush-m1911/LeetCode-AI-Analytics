from django.db import models
from django.conf import settings


class UserStats(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="stats"
    )

    total_solved = models.IntegerField(default=0)

    easy_solved = models.IntegerField(default=0)

    medium_solved = models.IntegerField(default=0)

    hard_solved = models.IntegerField(default=0)

    ranking = models.IntegerField(default=0)

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.user.username} Stats"

class TopicStats(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="topic_stats"
    )

    topic_name = models.CharField(
        max_length=100
    )

    solved_count = models.IntegerField(
        default=0
    )

    category = models.CharField(
        max_length=50
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        unique_together = (
            "user",
            "topic_name"
        )

    def __str__(self):
        return f"{self.user.username} - {self.topic_name}"
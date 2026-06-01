from django.db import models
from django.conf import settings


class ContestHistory(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='contest_history'
    )
    contest_title = models.CharField(max_length=255)
    ranking = models.IntegerField(default=0)
    rating = models.FloatField(default=0)
    rating_change = models.FloatField(default=0)
    problems_solved = models.IntegerField(default=0)
    total_problems = models.IntegerField(default=0)
    attended_at = models.DateTimeField()
    finish_time_in_seconds = models.IntegerField(default=0)

    class Meta:
        ordering = ['-attended_at']
        unique_together = ('user', 'contest_title')

    def __str__(self):
        return f"{self.user.username} — {self.contest_title} (Rank: {self.ranking})"

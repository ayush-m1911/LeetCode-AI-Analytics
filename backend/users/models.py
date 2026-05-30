from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    leetcode_username = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    github_username = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.username
from rest_framework import serializers
from .models import UserStats, TopicStats



class UserStatsSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserStats

        fields = "__all__"

class DashboardSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source="user.username"
    )

    class Meta:

        model = UserStats

        fields = (
            "username",
            "total_solved",
            "easy_solved",
            "medium_solved",
            "hard_solved",
            "ranking",
            "updated_at"
        )

class TopicStatsSerializer(serializers.ModelSerializer):

    class Meta:
        model = TopicStats

        fields = (
            "topic_name",
            "solved_count",
            "category"
        )
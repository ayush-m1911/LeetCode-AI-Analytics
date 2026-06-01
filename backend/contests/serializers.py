from rest_framework import serializers
from .models import ContestHistory


class ContestHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContestHistory
        fields = [
            'id',
            'contest_title',
            'ranking',
            'rating',
            'rating_change',
            'problems_solved',
            'total_problems',
            'attended_at',
            'finish_time_in_seconds',
        ]

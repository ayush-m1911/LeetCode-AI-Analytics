from rest_framework import serializers
from .models import Roadmap


class GenerateRoadmapSerializer(
    serializers.Serializer
):

    goal = serializers.CharField()


class RoadmapListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roadmap
        fields = ['id', 'goal', 'created_at', 'ranking', 'total_solved', 'weak_topics', 'strong_topics']


class RoadmapDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roadmap
        fields = '__all__'
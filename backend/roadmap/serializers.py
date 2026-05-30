from rest_framework import serializers


class GenerateRoadmapSerializer(
    serializers.Serializer
):

    goal = serializers.CharField()
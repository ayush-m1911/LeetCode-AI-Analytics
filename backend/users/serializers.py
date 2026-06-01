from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )
    leetcode_username = serializers.CharField(
        required=False,
        allow_blank=True,
        default=""
    )
    github_username = serializers.CharField(
        required=False,
        allow_blank=True,
        default=""
    )

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password",
            "leetcode_username",
            "github_username",
        )

    def validate_email(self, value):

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Email already exists."
            )

        return value

    def validate_username(self, value):

        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "Username already exists."
            )

        return value

    def create(self, validated_data):
        leetcode = validated_data.pop("leetcode_username", "") or ""
        github = validated_data.pop("github_username", "") or ""
        user = User.objects.create_user(**validated_data)
        if leetcode:
            user.leetcode_username = leetcode
        if github:
            user.github_username = github
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = (
            "id",
            "username",
            "email",
            "leetcode_username",
            "github_username",
            "created_at"
        )

class ProfileUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = (
            "leetcode_username",
            "github_username"
        )
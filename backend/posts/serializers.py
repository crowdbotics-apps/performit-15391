from rest_framework import serializers

from posts.models import Post, PostRank, PostComment
from users.serializers import CustomUserSerializer


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"


class PostRankSerializer(serializers.ModelSerializer):

    class Meta:
        model = PostRank
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    commenter_user = CustomUserSerializer(source="commenter", read_only=True)

    class Meta:
        model = PostComment
        fields = '__all__'


from rest_framework import serializers

from posts.models import Post, PostRank


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"


class PostRankSerializer(serializers.ModelSerializer):

    class Meta:
        model = PostRank
        fields = '__all__'
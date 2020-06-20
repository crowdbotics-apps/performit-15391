from rest_framework import serializers

from posts.models import Post, PostRank, PostComment, PostView
from users.serializers import CustomUserSerializer


class PostSerializer(serializers.ModelSerializer):
    created_by = CustomUserSerializer(source="user", read_only=True)
    meta_data = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = "__all__"

    def get_meta_data(self, obj):
        post_rating = PostRank.objects.filter(post=obj.id).last()
        avg_rating = 0
        if post_rating is not None:
            avg_rating = post_rating.average_rank
        post_views = PostView.objects.filter(post=obj.id).count()
        return {"avg_rating": avg_rating, "post_views": post_views}


class PostRankSerializer(serializers.ModelSerializer):
    ranker_info = CustomUserSerializer(source="ranker",read_only=True)

    class Meta:
        model = PostRank
        fields = '__all__'


class PostViewSerializer(serializers.ModelSerializer):
    viewer_info = CustomUserSerializer(source="viewer", read_only=True)

    class Meta:
        model = PostView
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    commenter_user = CustomUserSerializer(source="commenter", read_only=True)

    class Meta:
        model = PostComment
        fields = '__all__'


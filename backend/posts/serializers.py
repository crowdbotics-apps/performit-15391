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
        rated_by_logged_in = PostRank.objects.filter(ranker=self.context.get('request').user, post=obj.id).first()
        if rated_by_logged_in is not None:
            post_rank_serializer = PostRankSerializer(rated_by_logged_in, many=False)
            rating_by_login = post_rank_serializer.data.get('rank')
        else:
            rating_by_login = 0
        post_rating = PostRank.objects.filter(post=obj.id).last()
        avg_rating = 0
        if post_rating is not None:
            avg_rating = post_rating.average_rank
        post_views = PostView.objects.filter(post=obj.id).count()
        votes = post_rating.count()
        ratings = {"rating_by_login": rating_by_login, "votes": votes, "average_rating": average_rank}
        return {"avg_rating": avg_rating, "post_views": post_views, "ratings": ratings}


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


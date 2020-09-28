from rest_framework import serializers
from posts.models import Post, PostRank, PostComment, PostView
from posts.serializers import PostRankSerializer
from users.serializers import CustomUserSerializer
from groups.models import JoiningRequest


class FeedSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(many=False)
    meta_data = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = '__all__'

    def get_meta_data(self, obj):
        rated_by_logged_in = PostRank.objects.filter(ranker=self.context.get('request').user, post=obj.id).first()
        if rated_by_logged_in is not None:
            post_rank_serializer = PostRankSerializer(rated_by_logged_in, many=False)
            rating_by_login = post_rank_serializer.data.get('rank')
        else:
            rating_by_login = 0
        ratings = PostRank.objects.filter(post=obj.id)
        votes = ratings.count()
        average_rank = None
        if ratings.exists():
            average_rank = ratings.last().average_rank
        ratings = {"rating_by_login": rating_by_login, "votes": votes, "average_rating": average_rank}
        comments_count = PostComment.objects.filter(post=obj.id).count()
        views_count = PostView.objects.filter(post=obj.id).count()
        counts = {"comments_count": comments_count, "views_count": views_count}
        return {"ratings": ratings, "counts": counts}


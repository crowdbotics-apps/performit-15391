from django.db.models import Count
from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response

from connections.models import UserRelationship
from dashboards.serializers import FeedSerializer
from posts.models import Post, PostView


@permission_classes([IsAuthenticated])
class Feed(APIView):
    def post(self, request):
        tab = request.data.get("tab")
        if tab is None:
            return Response({"success": False, "message": "Required Param tab is missing"}, status=400)
        if tab == 'following':
            # user_ids to whome the logged in user is following.
            users_following = UserRelationship.objects.filter(follower=request.user.id)\
                .values_list('following', flat=True)
            posts = Post.objects.filter(user__in=users_following)
            feed_serializer = FeedSerializer(posts, many=True, context={'request': request})
            return Response({"data": feed_serializer.data})
        elif tab == 'talent':
            # posts with maximum views
            post_ids = PostView.objects.all().values('post').annotate(total=Count('viewer')).order_by('-total')\
                .values_list('post', flat=True)
            posts = Post.objects.filter(pk__in=post_ids)
            feed_serializer = FeedSerializer(posts, many=True, context={"request": request})
            return Response({"success": True, "data": feed_serializer.data})
        else:
            return Response({"success": False, "message": "Invalid tab param provided choices are following or talent"},
                            status=400)
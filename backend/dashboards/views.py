from django.db.models import Count
from django.core.paginator import Paginator, EmptyPage, InvalidPage

# Create your views here.
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response

from connections.models import UserRelationship
from dashboards.serializers import FeedSerializer
from posts.models import Post, PostView
from groups.models import GroupPost


@permission_classes([IsAuthenticated])
class Feed(APIView):
    def post(self, request):
        tab = request.data.get("tab")
        page = request.data.get("page")
        if page is None:
            page = 1
        size = 10
        if tab is None:
            return Response({"success": False, "message": "Required Param tab is missing"}, status=400)
        if tab == 'following':
            # user_ids to whome the logged in user is following.
            users_following = UserRelationship.objects.filter(follower=request.user.id)\
                .values_list('following', flat=True)
            group_posts = GroupPost.objects.values_list('post', flat=True)
            posts = Post.objects.filter(user__in=users_following).exclude(pk__in=group_posts).order_by('-created_at')
            try:
                paginated_data = Paginator(posts, size)
            except (EmptyPage, InvalidPage):
                return Response({"success": False, "message": "Empty Page"}, status=400)

            feed_serializer = FeedSerializer(paginated_data.page(page), many=True, context={'request': request})
            return Response({"data": feed_serializer.data, "total": paginated_data.count,
                         "pages": paginated_data.num_pages, "current_page": int(page)})
        elif tab == 'talent':
            # posts with maximum views
            post_ids = PostView.objects.all().values('post').annotate(total=Count('viewer')).order_by('-total')\
                .values_list('post', flat=True)
            group_posts = GroupPost.objects.values_list('post', flat=True)
            posts = Post.objects.filter(pk__in=post_ids).exclude(pk__in=group_posts).order_by('-created_at')
            try:
                paginated_data = Paginator(posts, size)
            except (EmptyPage, InvalidPage):
                return Response({"success": False, "message": "Empty Page"}, status=400)
            feed_serializer = FeedSerializer(paginated_data.page(page), many=True, context={"request": request})
            return Response({"success": True, "data": feed_serializer.data, "total": paginated_data.count,
                         "pages": paginated_data.num_pages, "current_page": int(page)})
        else:
            return Response({"success": False, "message": "Invalid tab param provided choices are following or talent"},
                            status=400)
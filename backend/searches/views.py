from django.contrib.auth import get_user_model
from django.db.models import Count, Max, Q
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response
from django.core.paginator import Paginator, EmptyPage, InvalidPage

# Create your views here.
from groups.models import Group
from groups.serializers import GroupSerializer
from posts.models import PostView, Post, PostRank
from posts.serializers import PostSerializer
from users.serializers import CustomUserSerializer

User = get_user_model()


@permission_classes([IsAuthenticated])
class SearchDashboard(APIView):
    def post(self, request):
        tab = request.data.get("tab")
        term = request.data.get("term")
        if tab is None or term is None:
            return Response({"success": False, "message": "Required Param tab and/or term is missing"},
                            status=400)
        page = request.data.get("page")
        if page is None:
            page = 1
        size = 10
        if tab == "top":
            # posts with maximum counts.
            post_ids = PostView.objects.all().values('post').annotate(total=Count('viewer')).order_by('-total')\
                .values_list('post', flat=True)
            post_ranks = PostRank.objects.all().values("post").annotate(latest_rank=Max("created_at"))\
                .values_list("post", flat=True)
            post_ids = list(post_ids) + list(post_ranks)
            posters = Post.objects.filter(pk__in=post_ids).filter(Q(user__username__icontains=term) |
                                                                  Q(user__first_name__icontains=term) |
                Q(user__last_name__icontains=term) | Q(user__name__icontains=term))\
                .values_list("user", flat=True)
            unique_posters = list(dict.fromkeys(posters))
            users = User.objects.filter(pk__in=unique_posters)
            try:
                paginated_data = Paginator(users, size)
            except (EmptyPage, InvalidPage):
                return Response({"success": False, "message": "Empty Page"}, status=400)
            user_serializer = CustomUserSerializer(paginated_data.page(page), many=True)
            # Need to apply pagination
            return Response({"success": True, "data": user_serializer.data, "total": paginated_data.count,
                         "pages": paginated_data.num_pages, "current_page": int(page)})
        elif tab == "accounts":
            users = User.objects.filter(Q(username__icontains=term) | Q(first_name__icontains=term) |
                                        Q(last_name__icontains=term) | Q(name__icontains=term))
            try:
                paginated_data = Paginator(users, size)
            except (EmptyPage, InvalidPage):
                return Response({"success": False, "message": "Empty Page"}, status=400)
            user_serializer = CustomUserSerializer(paginated_data.page(page), many=True)
            return Response({"success": True, "data": user_serializer.data, "total": paginated_data.count,
                         "pages": paginated_data.num_pages, "current_page": int(page)})
        elif tab == "groups":
            groups = Group.objects.filter(Q(group_name__icontains=term) | Q(group_description__icontains=term))
            group_serializer = GroupSerializer(groups, many=True)
            return Response({"success": True, "data": group_serializer.data})
        elif tab == "hashtags":
            term = '#' + term
            posts_with_hashtag = Post.objects.filter(caption__icontains=term)
            try:
                paginated_data = Paginator(posts_with_hashtag, size)
            except (EmptyPage, InvalidPage):
                return Response({"success": False, "message": "Empty Page"}, status=400)
            post_serializer = PostSerializer(paginated_data.page(page), many=True, context={'request': request})
            return Response({"success": True, "data": post_serializer.data, "total": paginated_data.count,
                         "pages": paginated_data.num_pages, "current_page": int(page)})
        else:
            return Response({"success": False, "message": "Invalid tab param provided"})
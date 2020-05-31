from django.contrib.auth import get_user_model
from django.core.paginator import Paginator, EmptyPage, InvalidPage
from django.db.models import Q
from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response

from connections.models import UserRelationship
from connections.serializers import UserRelationshipSerializer, FollowingListSerializer, FollowerListSerializer
from users.serializers import CustomUserSerializer

User = get_user_model()

@permission_classes([IsAuthenticated])
class Follow(APIView):

    def post(self, request):
        user_id = request.data.get("user_id")
        if user_id is None:
            return Response({"success": False, "message": "user_id (to whome user want to follow) param is missing."},
                            status=400)
        if int(user_id) == int(request.user.id):
            return Response({"success": False, "message": "User can not follow himself"})
        already_follower = UserRelationship.objects.filter(following=user_id, follower=request.user.id)
        if already_follower.exists():
            return Response({"success": False, "message": "User is already follower"}, status=400)
        data = {"following": user_id, "follower": request.user.id }
        follower = UserRelationshipSerializer(data=data)
        if follower.is_valid():
            instance = follower.save()
            serializer = UserRelationshipSerializer(instance, many=False)
            return Response({"success": True, "message": "User is Following", "data": serializer.data})
        return Response({"success": False, "message": follower.errors}, status=400)


@permission_classes([IsAuthenticated])
class Unfollow(APIView):

    def post(self, request):
        user_id = request.data.get("user_id")
        if user_id is None:
            return Response({"success": False, "message": "user_id (to whome user want to unfollow) param is missing."},
                            status=400)
        already_follower = UserRelationship.objects.filter(follower=request.user.id, following=user_id)
        if already_follower.exists():
            already_follower.delete()
            return Response({"success": False, "message": "User is unfollowed"})
        return Response({"success": False, "message": "User is not follower"})


@permission_classes([IsAuthenticated])
class List(APIView):
    # make user id dependent
    def post(self, request):
        tab_type = request.data.get("tab_type")
        user_id = request.data.get("user_id")
        page = request.data.get("page")
        if page is None:
            page = 1
        size = 10
        if tab_type is None or user_id is None:
            return Response({"success": False, "message": "tab_type or user_id param is missing"}, status=400)
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"success": False, "message": "Invalid User"}, status=400)
        if tab_type == "follower":
            # return a list of users that are following the logged in user
            # following = UserRelationship.objects.filter(following=request.user.id).order_by("created_at")
            following = UserRelationship.objects.filter(following=user_id).order_by("created_at")
            try:
                paginated_data = Paginator(following, size)
            except (EmptyPage, InvalidPage):
                return Response({"success": False, "message": "Empty Page"}, status=400)
            serializer = FollowingListSerializer(paginated_data.page(page), many=True, context={"request": request})
            return Response({"success": True, "data": serializer.data, "total": paginated_data.count,
                         "pages": paginated_data.num_pages, "current_page": int(page)})
        elif tab_type == "following":
            # return a list of users to whome the logged in user following
            # follower = UserRelationship.objects.filter(follower=request.user.id).order_by("created_at")
            follower = UserRelationship.objects.filter(follower=user_id).order_by("created_at")
            try:
                paginated_data = Paginator(follower, size)
            except (EmptyPage, InvalidPage):
                return Response({"success": False, "message": "Empty Page"}, status=400)
            user_serializer = CustomUserSerializer(user, many=False)
            serializer = FollowerListSerializer(paginated_data.page(page), many=True, context={"request": request})
            return Response({"success": True, "data": serializer.data,"user":user_serializer.data,
                             "total": paginated_data.count,
                         "pages": paginated_data.num_pages, "current_page": int(page)})
        else:
            return Response({"success": False, "message": "Invalid tab_type param provided"}, status=400)


@permission_classes([IsAuthenticated])
class SearchUser(APIView):
    # make user id dependent
    def post(self, request):
        tab_type = request.data.get("tab_type")
        user_id = request.data.get("user_id")
        page = request.data.get("page")
        term = request.data.get("term")
        if page is None:
            page = 1
        size = 10
        if tab_type is None or user_id is None:
            return Response({"success": False, "message": "tab_type or user_id param is missing"}, status=400)
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"success": False, "message": "Invalid User"}, status=400)
        if term is None:
            return Response({"success": False, "message": "term param is missing"}, status=400)
        if tab_type == "follower":
            # return a list of users that are following the logged in user
            following = UserRelationship.objects.filter(following=user_id).filter(
                Q(following__username__icontains=term) | Q(following__first_name__icontains=term) |
                Q(following__last_name__icontains=term) | Q(following__name__icontains=term))
            try:
                paginated_data = Paginator(following, size)
            except (EmptyPage, InvalidPage):
                return Response({"success": False, "message": "Empty Page"}, status=400)
            serializer = FollowingListSerializer(paginated_data.page(page), many=True, context={"request": request})
            return Response({"success": True, "data": serializer.data, "total": paginated_data.count,
                             "pages": paginated_data.num_pages, "current_page": int(page)})
        elif tab_type == "following":
            # return a list of users to whome the logged in user following
            follower = UserRelationship.objects.filter(follower=user_id).filter(
                Q(following__username__icontains=term) | Q(following__first_name__icontains=term) |
                Q(following__last_name__icontains=term) | Q(following__name__icontains=term))
            try:
                paginated_data = Paginator(follower, size)
            except (EmptyPage, InvalidPage):
                return Response({"success": False, "message": "Empty Page"}, status=400)
            user_serializer = CustomUserSerializer(user, many=False)
            serializer = FollowerListSerializer(paginated_data.page(page), many=True, context={"request": request})
            return Response({"success": True, "data": serializer.data, "user": user_serializer.data,
                             "total": paginated_data.count,
                             "pages": paginated_data.num_pages, "current_page": int(page)})
        else:
            return Response({"success": False, "message": "Invalid tab_type param provided"}, status=400)
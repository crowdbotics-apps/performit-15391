from django.shortcuts import render

from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response
from django.utils.datastructures import MultiValueDictKeyError
from groups.serializers import GroupSerializer
from groups.models import Group
from posts.PostFunctions import PostFunctions
from groups.models import GroupMembers, JoiningRequest, InviteUser, GroupPost
from groups.serializers import GroupPostSerializer, JoiningRequestSerializer, GroupMemberSerializer, InviteUserSerializer
from posts.models import Post
from django.contrib.auth import get_user_model
from django.core.paginator import Paginator, EmptyPage, InvalidPage
from posts.models import Post
from dashboards.serializers import FeedSerializer
from notifications.functions import NotificationFunctions
from notifications.models import Notification
User = get_user_model()
# Create your views here.
@permission_classes([IsAuthenticated])
class Feed(APIView):
    def post(self, request):
        # show posts by group creater and members or show group posts
        page = request.data.get("page")
        if page is None:
            page = 1
        size = 10
        group_id = request.data.get("group_id")
        if group_id is None:
            return Response({"success": False, "message": "Required Param group_id is missing"}, status=400)
        try:
            existing_group = Group.objects.get(pk=group_id)
        except Group.DoesNotExist:
            return Response({"success": False, "message": "Invalid group_id param is provided"}, status=400)
        group_posts = GroupPost.objects.filter(group=existing_group.id).values_list("post", flat=True)
        posts = Post.objects.filter(pk__in=group_posts).order_by('created_at')
        try:
            paginated_data = Paginator(posts, size)
        except (EmptyPage, InvalidPage):
            return Response({"success": False, "message": "Empty Page"}, status=400)
        feed_serializer = FeedSerializer(paginated_data.page(page), many=True, context={'request': request})
        group_serializer = GroupSerializer(existing_group, many=False)
        return Response({"data": feed_serializer.data, "total": paginated_data.count,
                         "pages": paginated_data.num_pages, "current_page": int(page), "group": group_serializer.data})


@permission_classes([IsAuthenticated])
class Create(APIView):
    def post(self, request):
        try:
            group_icon = request.FILES['group_icon']
        except MultiValueDictKeyError:
            group_icon = None
        data = {"group_name": request.data.get("group_name"), "created_by": request.user.id, 
        "group_description": request.data.get("group_description"), "group_icon": group_icon}
        group = GroupSerializer(data=data)
        if group.is_valid():
            instance = group.save()
            serializer = GroupSerializer(instance, many=False)
            return Response({"success": True, "message": "Group Created", "data": serializer.data})
        return Response({"success": False, "message": group.errors})


@permission_classes([IsAuthenticated])
class Edit(APIView):
    def post(self, request):
        group_id = request.data.get("group_id")
        if group_id is None:
            return Response({"success": False, "message": "Required Param group_id is missing"}, status=400)
        try:
            existing_group = Group.objects.get(pk=group_id)
        except Group.DoesNotExist:
            return Response({"success": False, "message": "Invalid group_id param is provided"}, status=400)
        if int(existing_group.created_by.id) != int(request.user.id):
            return Response({"success": False, "message": "User can not edit group"}, status=400)
        try:
            group_icon = request.FILES['group_icon']
        except MultiValueDictKeyError:
            group_icon = None
        data = {"group_name": request.data.get("group_name"), "created_by": request.user.id, 
        "group_description": request.data.get("group_description"), "group_icon": group_icon}
        group = GroupSerializer(data=data)
        if group.is_valid():
            if group_icon is not None:
                existing_group.group_icon = data.get("group_icon")
            existing_group.group_name = data.get("group_name")
            existing_group.group_description = data.get("group_description")
            existing_group.save()
            serializer = GroupSerializer(existing_group, many=False)
            return Response({"success": True, "message": "Group Updated", "data": serializer.data})
        return Response({"success": False, "message": group.errors}, status=400)


@permission_classes([IsAuthenticated])
class Delete(APIView):
    def post(self, request):
        group_id = request.data.get("group_id")
        if group_id is None:
            return Response({"success": False, "message": "Required Param group_id is missing"}, status=400)
        try:
            existing_group = Group.objects.get(pk=group_id)
        except Group.DoesNotExist:
            return Response({"success": False, "message": "Invalid group_id param is provided"}, status=400)
        if int(existing_group.created_by.id) != int(request.user.id):
            return Response({"success": False, "message": "User can not delete group"}, status=400)
        existing_group.delete()
        return Response({"success": False, "message": "Group Deleted"})

@permission_classes([IsAuthenticated])
class CreatePost(APIView):
    def post(self, request):
        group_id = request.data.get("group_id")
        if group_id is None:
            return Response({"success": False, "message": "Required Param group_id is missing"}, status=400)
        try:
            existing_group = Group.objects.get(pk=group_id)
        except Group.DoesNotExist:
            return Response({"success": False, "message": "Invalid group_id param is provided"}, status=400)
        # User Should be group owner or group member
        member = GroupMembers.objects.filter(member=request.user.id, group=existing_group.id)
        can_post = False
        if int(existing_group.created_by.id) == int(request.user.id) or member.exists():
            can_post = True
        if can_post:
            return Response({"success": False, "message": "User Can not post in the group"}, status=400)
        response = PostFunctions.create_post(request)
        if response.get("success"):
            group_post_data = {"post": response['data']['id'], "group": existing_group.id}
            group_post = GroupPostSerializer(data=group_post_data)
            if group_post.is_valid():
                group_post.save()
            else:
                # Delete Post
                existing_post = Post.objects.get(pk=response['data']['id'])
                existing_post.delete()
                return Response({"success": False, "message": group_post.errors}, status=400)
        return Response(response)


@permission_classes([IsAuthenticated])
class JoiningRequestView(APIView):
    def post(self, request):
        group_id = request.data.get("group_id")
        if group_id is None:
            return Response({"success": False, "message": "Required Param group_id is missing"}, status=400)
        try:
            existing_group = Group.objects.get(pk=group_id)
        except Group.DoesNotExist:
            return Response({"success": False, "message": "Invalid group_id param is provided"}, status=400)
        member = GroupMembers.objects.filter(member=request.user.id, group=existing_group.id)
        can_request = False
        if int(existing_group.created_by.id) == int(request.user.id) or member.exists():
            can_request = True
        if can_request:
            return Response({"success": False, "message": "User Can not request, group owner or already member"}, status=400)
        already_requested = JoiningRequest.objects.filter(group=existing_group.id, user=request.user.id)
        if already_requested.exists():
            return Response({"success": False, "message": "Already requested to join group"}, status=400)
        data = {"group": existing_group.id, "user": request.user.id}
        joining_request = JoiningRequestSerializer(data=data)
        if joining_request.is_valid():
            instance = joining_request.save()
            serializer = JoiningRequestSerializer(instance, many=False)
            msg = "{} Requested to join your group".format(request.user.username)
            NotificationFunctions.create_notification(user=existing_group.created_by.id, auther=request.user.id, message=msg,post=None, notification_type=Notification.GROUP_JOINING_REQUEST)
            return Response({"success": True, "message": "Requested", "data": serializer.data})
        return Response({"success": False, "message": serializer.errors}, status=400)


@permission_classes([IsAuthenticated])
class AcceptJoiningRequest(APIView):
    def post(self, request):
        request_id = request.data.get("request_id")
        if request_id is None:
            return Response({"success": False, "message": "Required param request_id is missing"}, status=400)
        try:
            existing_request = JoiningRequest.objects.get(pk=request_id)
        except JoiningRequest.DoesNotExist:
            return Response({"success": False, "message": "Invalid request_id param provided"})
        if existing_request.accepted:
            return Response({"success": False, "message": "Request already accepted"}, status=400)
        if int(existing_request.group.created_by.id) != request.user.id:
            return Response({"success": False, "message": "User cannot accept request"})
        data = {"member": existing_request.user.id, "group": existing_request.group.id}
        group_member = GroupMemberSerializer(data=data)
        if group_member.is_valid():
            existing_request.accepted = True
            existing_request.save()
            instance = group_member.save()
            serializer = GroupMemberSerializer(instance, many=False)
            return Response({"success": True, "message": "Accepted", "data": serializer.data})
        return Response({"success": False, "message": group_member.errors}, status=400)


@permission_classes([IsAuthenticated])
class Invite(APIView):
    def post(self, request):
        # Can only group admin invite or anyone else also can invite
        group_id = request.data.get("group_id")
        user_id = request.data.get("user_id")
        if group_id is None or user_id is None:
            return Response({"success": False, "message": "Required Param group_id and/or user_id missing"}, status=400)
        try:
            existing_group = Group.objects.get(pk=group_id)
        except Group.DoesNotExist:
            return Response({"success": False, "message": "Invalid group_id param is provided"}, status=400)
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"success": False, "message": "Invalid user_id param is provided"}, status=400)
        member = GroupMembers.objects.filter(member=request.user.id, group=existing_group.id)
        if int(existing_group.created_by.id) != int(request.user.id):
            return Response({"success": False, "message": "You can not invite the user"}, status=400)
        can_invited = False
        if int(existing_group.created_by.id) == int(user.id) or member.exists():
            can_invited = True
        if can_invited:
            return Response({"success": False, "message": "User Can not be invited, group owner or already member"}, status=400)
        already_invited = InviteUser.objects.filter(group=existing_group.id, user=user.id)
        if already_invited.exists():
            return Response({"success": False, "message": "Already Invited to join group"}, status=400)
        data = {"user": user.id, "group": existing_group.id}
        invite = InviteUserSerializer(data=data)
        if invite.is_valid():
            instance = invite.save()
            serializer = InviteUserSerializer(instance, many=False)
            msg = "{} Invited you to join group".format(existing_group.created_by.username)
            NotificationFunctions.create_notification(user=user.id, auther=request.user.id, message=msg,post=None, notification_type=Notification.GROUP_JOINING_REQUEST)
            return Response({"success": True, "message": "Invited", "data": serializer.data})
        return Response({"success": False, "message": invite.errors}, status=400)


@permission_classes([IsAuthenticated])
class AcceptInvite(APIView):
    def post(self, request):
        invite_id = request.data.get("invite_id")
        if invite_id is None:
            return Response({"success": False, "message": "Required param invite_id is missing"}, status=400)
        try:
            invite = InviteUser.objects.get(pk=invite_id)
        except InviteUser.DoesNotExist:
            return Response({"success": False, "message": "Invalid invite_id param is provided"}, status=400)
        if int(invite.group.created_by.id) != int(request.user.id):
            return Response({"success": False, "message": "You cannot accept invite"}, status=400)
        data = {"member": invite.user.id, "group": invite.group.id}
        group_member = GroupMemberSerializer(data=data)
        if group_member.is_valid():
            invite.accepted = True
            invite.save()
            instance = group_member.save()
            serializer = GroupMemberSerializer(instance, many=False)
            return Response({"success": True, "message": "Accepted", "data": serializer.data})
        return Response({"success": False, "message": group_member.errors}, status=400)



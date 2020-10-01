from rest_framework import serializers

from groups.models import Group, GroupMembers
from users.serializers import CustomUserSerializer
from posts.serializers import PostSerializer
from groups.models import GroupPost, JoiningRequest, InviteUser

class GroupMemberSerializer(serializers.ModelSerializer):
    member_user = CustomUserSerializer(source="member", read_only=True)
    # group_data = GroupSerializer(source="group", read_only=True)

    class Meta:
        model = GroupMembers
        fields = '__all__'

class GroupSerializer(serializers.ModelSerializer):
    group_owner = CustomUserSerializer(source="created_by", read_only=True)
    meta_data = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = '__all__'

    def get_meta_data(self, obj):
        group_members = GroupMembers.objects.filter(group=obj.id)
        serializer = GroupMemberSerializer(group_members, many=True)
        joining_access_requested = False
        joining_access_accepted = False
        is_invite_sent = False
        is_invite_accepted = False
        if self.context.get('request') is not None:
            joining_request = JoiningRequest.objects.filter(group=self.context.get('request').data.get('group_id'), user=self.context.get('request').user.id).values()
            if joining_request.exists():
                joining_access_requested = True
                if joining_request[0]['accepted']:
                    joining_access_accepted = True
            invite_user = InviteUser.objects.filter(group=self.context.get('request').data.get('group_id'),user=self.context.get('request').user.id).values()
            if invite_user.exists():
                is_invite_sent = True
                if invite_user[0]['accepted']:
                    is_invite_accepted = True
        return {"group_member_count": group_members.count(), "members": serializer.data, "joining_access_requested": joining_access_requested, 
        "joining_access_accepted": joining_access_accepted, "is_invite_sent": is_invite_sent, "is_invite_accepted": is_invite_accepted}

class GroupPostSerializer(serializers.ModelSerializer):
    post_data = PostSerializer(source="post", read_only=True)
    group_data = GroupSerializer(source="group", read_only=True)

    class Meta:
        model = GroupPost
        fields = '__all__'

    
class JoiningRequestSerializer(serializers.ModelSerializer):
    request_by = CustomUserSerializer(source="user", read_only=True)
    group_data = GroupSerializer(source="group", read_only=True)

    class Meta:
        model = JoiningRequest
        fields = '__all__'



class InviteUserSerializer(serializers.ModelSerializer):
    user_invited = CustomUserSerializer(source="user", read_only=True)
    group_data = GroupSerializer(source="group", read_only=True)

    class Meta:
        model = InviteUser
        fields = '__all__'
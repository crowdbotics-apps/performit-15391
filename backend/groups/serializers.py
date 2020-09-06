from rest_framework import serializers

from groups.models import Group, GroupMembers
from users.serializers import CustomUserSerializer
from posts.serializers import PostSerializer
from groups.models import GroupPost, JoiningRequest, InviteUser

class GroupSerializer(serializers.ModelSerializer):
    group_owner = CustomUserSerializer(source="created_by", read_only=True)
    meta_data = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = '__all__'

    def get_meta_data(self, obj):
        group_members_count = GroupMembers.objects.filter(group=obj.id).count()
        return {"group_member_count": group_members_count}

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


class GroupMemberSerializer(serializers.ModelSerializer):
    member_user = CustomUserSerializer(source="member", read_only=True)
    group_data = GroupSerializer(source="group", read_only=True)

    class Meta:
        model = GroupMembers
        fields = '__all__'


class InviteUserSerializer(serializers.ModelSerializer):
    user_invited = CustomUserSerializer(source="user", read_only=True)
    group_data = GroupSerializer(source="group", read_only=True)

    class Meta:
        model = InviteUser
        fields = '__all__'
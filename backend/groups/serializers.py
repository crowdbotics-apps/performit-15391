from rest_framework import serializers

from groups.models import Group, GroupMembers
from users.serializers import CustomUserSerializer


class GroupSerializer(serializers.ModelSerializer):
    group_owner = CustomUserSerializer(source="created_by", read_only=True)
    meta_data = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = '__all__'

    def get_meta_data(self, obj):
        group_members_count = GroupMembers.objects.filter(group=obj.id).count()
        return {"group_member_count": group_members_count}
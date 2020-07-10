from rest_framework import serializers

from connections.models import UserRelationship
from users.models import UserType, UserDetail
from users.serializers import CustomUserSerializer, UserTypeSerializer, UserDetailSerializer


class UserRelationshipSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserRelationship
        fields = "__all__"


class FollowingListSerializer(serializers.ModelSerializer):
    follower = CustomUserSerializer(many=False)
    meta_data = serializers.SerializerMethodField()

    class Meta:
        model = UserRelationship
        fields = "__all__"

    def get_meta_data(self, obj):
        is_following = False
        follower = UserRelationship.objects.filter(following=obj.follower.id, follower=self.context.get("request").user.id)
        if follower.exists():
            is_following = True
        user_types = UserType.objects.filter(user=obj.follower.id)
        user_types_serializer = UserTypeSerializer(user_types, many=True)
        user_types = []
        try:
            user_profile = UserDetail.objects.get(user=obj.follower.id)
            user_profile_serializer = UserDetailSerializer(user_profile, many=False)
            user_profile_data = user_profile_serializer.data
        except UserDetail.DoesNotExist:
            user_profile_data = None
        for type in user_types_serializer.data:
            user_types.append(type['user_type'])
        return {"is_following": is_following, "user_types": user_types, "user_profile": user_profile_data }


class FollowerListSerializer(serializers.ModelSerializer):
    following = CustomUserSerializer(many=False)
    meta_data = serializers.SerializerMethodField()

    class Meta:
        model = UserRelationship
        fields = "__all__"

    def get_meta_data(self, obj):
        is_following = False
        follower = UserRelationship.objects.filter(follower=obj.following.id,
                                                   following=self.context.get("request").user.id)
        if follower.exists():
            is_following = True
        user_types = UserType.objects.filter(user=obj.follower.id)
        user_types_serializer = UserTypeSerializer(user_types, many=True)
        user_types = []
        try:
            user_profile = UserDetail.objects.get(user=obj.following.id)
            user_profile_serializer = UserDetailSerializer(user_profile, many=False)
            user_profile_data = user_profile_serializer.data
        except UserDetail.DoesNotExist:
            user_profile_data = None
        for type in user_types_serializer.data:
            user_types.append(type['user_type'])
        return {"is_following": is_following, "user_types": user_types, "user_profile": user_profile_data}
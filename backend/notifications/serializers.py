from rest_framework import serializers
from notifications.models import Notification
from users.serializers import CustomUserSerializer
from posts.serializers import PostSerializer

class NotificationSerializer(serializers.ModelSerializer):
    notification_for = CustomUserSerializer(source="user", read_only=True, many=False)
    created_by = CustomUserSerializer(source="auther", read_only=True, many=False)
    post_data = PostSerializer(source="post", read_only=True, many=False)
    class Meta:
        model = Notification
        fields = '__all__'
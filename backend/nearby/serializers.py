from rest_framework import serializers
from nearby.models import LiveLocation
from users.serializers import CustomUserSerializer

class LiveLocationSerializer(serializers.ModelSerializer):
    user_data = CustomUserSerializer(source="user", read_only=True)

    class Meta:
        model = LiveLocation
        fields = "__all__"
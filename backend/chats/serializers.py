from rest_framework import serializers
from users.serializers import CustomUserSerializer
from chats.models import ChatMedia

class ChatMediaSerializer(serializers.ModelSerializer):
    created_by = CustomUserSerializer(source="user", many=False, read_only=True)

    class Meta:
        model = ChatMedia
        fields = '__all__'
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response
from django.contrib.auth import get_user_model
from chats.serializers import ChatMediaSerializer

User = get_user_model()

# Create your views here.
@permission_classes([IsAuthenticated])
class StoreChatMedia(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"success": False, "message": "Required param user_id is missing or Invalid"}, status=400)
        data = {"user": user.id, "media": request.data.get("media")}
        chat_media = ChatMediaSerializer(data=data)
        if chat_media.is_valid():
            instance = chat_media.save()
            serializer = ChatMediaSerializer(instance, many=False)
            return Response({"success": True, "message": "Chat Media Added", "data": serializer.data})
        return Response({"success": False, "message": chat_media.errors}, status=400)
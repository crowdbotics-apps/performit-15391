from django.shortcuts import render
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response
from django.core.paginator import Paginator, EmptyPage, InvalidPage
from notifications.models import Notification
from notifications.serializers import NotificationSerializer

# Create your views here.
@permission_classes([IsAuthenticated])
class NotificationList(APIView):
    def post(self, request):
        page = request.data.get("page")
        if page is None:
            page = 1
        size = 10
        notifications = Notification.objects.filter(user=request.user.id).order_by('created_at')
        try:
            paginated_data = Paginator(notifications, size)
        except (EmptyPage, InvalidPage):
            return Response({"success": False, "message": "Empty Page"}, status=400)
        serializer = NotificationSerializer(paginated_data.page(page), many=True,context={'request': request})
        return Response({"success": True, "data": serializer.data, "message": "User Notification List"})

@permission_classes([IsAuthenticated])
class ReadNotification(APIView):
    def post(self, request):
        notification_id = request.data.get("notification_id")
        try:
            notification = Notification.objects.get(pk=notification_id)
        except Notification.DoesNotExist:
            return Response({"success": False, "message": "Invalid notification_id param provided"}, status=400)
        if int(notification.user.id) != int(request.user.id):
            return Response({"success": False, "message": "User cannot read notification"}, status=400)
        notification.is_read = True
        notification.save()
        return Response({"success": True, "message": "Notification marked Read"}) 
from notifications.serializers import NotificationSerializer
from logs.functions import LogFunctions
from fcm_django.models import FCMDevice
from notifications.models import Notification

class NotificationFunctions:
    @staticmethod
    def create_notification(user, auther, message, post, notification_type):
        data = {"user": user, "auther": auther, "message": message, "post": post, "notification_type": notification_type}
        notified = Notification.objects.filter(user=user, auther=auther, post=post, notification_type=notification_type)
        if notified.exists():
            notified.delete()
        notification = NotificationSerializer(data=data)
        if notification.is_valid():
            notification.save()
            NotificationFunctions.send_push_notification(user, message)
            return {"success": True, "message": "Notification Created"}
        log_message = "Unable to create notification:  " + str(notification.errors) + " For user_id: " + str(user) + \
                      " AND Message: " + str(message)
        LogFunctions.create_log(created_by=user, message=log_message)
        return {"success": False, "message": notification.errors}

    @staticmethod
    def send_push_notification(user, message):
        try:
            device = FCMDevice.objects.filter(user=user)
            if device.exists():
                for dev in device:
                    dev.send_message("New Notification from Performit", message)
        except Exception as e:
            log_message = "Unable to send Push Notification Exception: " + str(e) + " for user_id: " + str(user) + " AND Message is: " \
                      +str(message)
            LogsFunctions.create_log(created_by=user, message=log_message)

    @staticmethod
    def notification_read(id):
        try:
            existing_notification = Notification.objects.get(pk=id)
        except Notification.DoesNotExist:
            return {"success": False, "message": "Notification Doesn't exist"}
        existing_notification.is_read = True
        existing_notification.save()
        return {"success": True, "message": "Notification read." }
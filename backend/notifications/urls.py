from django.urls import path
from notifications.views import NotificationList, ReadNotification

app_name = "notifications"
urlpatterns = [
    path("", view=NotificationList.as_view(), name="notification-list"),
    path("read/", view=ReadNotification.as_view(), name="read-notification"),
]

from django.urls import path
from chats.views import StoreChatMedia

app_name = "chats"
urlpatterns = [
    path("store-media/", view=StoreChatMedia.as_view(), name="store-media")
]

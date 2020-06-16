from django.urls import path
from dashboards.views import Feed

app_name = "dashboards"
urlpatterns = [
    path("feed/", view=Feed.as_view(), name="feed")
]

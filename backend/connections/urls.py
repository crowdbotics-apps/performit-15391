from django.urls import path

from connections.views import Follow, Unfollow, List, SearchUser

app_name = "connections"
urlpatterns = [
    path("follow/", view=Follow.as_view(), name="follow"),
    path("unfollow/", view=Unfollow.as_view(), name="unfollow"),
    path("list/", view=List.as_view(), name="list"),
    path("search-user/", view=SearchUser.as_view(), name="search-user")
]

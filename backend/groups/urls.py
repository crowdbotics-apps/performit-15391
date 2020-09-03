from django.urls import path
from groups.views import Feed, Create, Edit, Delete, CreatePost, JoiningRequest, AcceptJoiningRequest, Invite, AcceptInvite

app_name = "groups"
urlpatterns = [
    path("",Feed.as_view(), name="dashboard-feed"),
    path("create/",Create.as_view(), name="create"),
    path("edit/", Edit.as_view(), name="edit"),
    path("delete/",Delete.as_view(), name="delete"),
    path("create-post/",CreatePost.as_view(), name="create-post"),
    path("joining-request/",JoiningRequest.as_view(),name="joining-request"),
    path("accept-joining-request/",AcceptJoiningRequest.as_view(), name="accept-joining-request"),
    path("invite/",Invite.as_view(), name="invite"),
    path("accept-invite/",AcceptInvite.as_view(), name="accept-invite"),
]

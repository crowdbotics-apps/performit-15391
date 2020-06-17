from django.urls import path
from posts.views import AddComment, CommentsList, AddPostRank, PostRankers

app_name = "posts"
urlpatterns = [
    path("add-comment/", view=AddComment.as_view(), name="add-comment"),
    path("comments-list/", view=CommentsList.as_view(), name="comments-list"),
    path("add-edit-post-rank/", view=AddPostRank.as_view(), name="add-post-rank"),
    path("post-rankers/", view=PostRankers.as_view(), name="post-rankers")
]

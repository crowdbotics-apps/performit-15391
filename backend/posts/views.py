from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response
from django.core.paginator import Paginator, EmptyPage, InvalidPage

from posts.models import Post, PostComment
from posts.serializers import CommentSerializer


@permission_classes([IsAuthenticated])
class AddComment(APIView):
    def post(self, request):
        post_id = request.data.get("post_id")
        if post_id is None:
            return Response({"success": False, "message": "Required Param post_id is missing"}, status=400)
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response({"success": False, "message": "Invalid post_id param provided"}, status=400)
        data = {"commenter": request.user.id, "post": post.id, "comment": request.data.get("comment")}
        comment = CommentSerializer(data=data)
        if comment.is_valid():
            instance = comment.save()
            serializer = CommentSerializer(instance, many=False)
            return Response({"success": True, "message": "Comment Saved.", "data": serializer.data})
        return Response({"success": False, "message": comment.errors}, status=400)


@permission_classes([IsAuthenticated])
class CommentsList(APIView):
    def post(self, request):
        post_id = request.data.get("post_id")
        page = request.data.get("page")
        if page is None:
            page = 1
        size = 10
        if post_id is None:
            return Response({"success": False, "message": "Required Param post_id is missing"}, status=400)
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response({"success": False, "message": "Invalid post_id param provided"}, status=400)
        post_comments = PostComment.objects.filter(post=post.id).order_by('created_at')
        try:
            paginated_data = Paginator(post_comments, size)
        except (EmptyPage, InvalidPage):
            return Response({"success": False, "message": "Empty Page"}, status=400)
        post_comment_serializer = CommentSerializer(paginated_data.page(page), many=True)
        return Response({"success": True, "data": post_comment_serializer.data, "total": paginated_data.count,
                         "pages": paginated_data.num_pages, "current_page": int(page)})

@permission_classes([IsAuthenticated])
class AddPostRank(APIView):
    def post(self, request):
        return Response("OK")


@permission_classes([IsAuthenticated])
class PostRankers(APIView):
    def post(self, request):
        return Response("OK")


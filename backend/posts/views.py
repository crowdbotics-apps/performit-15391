# Create your views here.
import os

from django.utils.datastructures import MultiValueDictKeyError
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response
from django.core.paginator import Paginator, EmptyPage, InvalidPage

from posts.PostFunctions import PostFunctions
from posts.models import Post, PostComment, PostRank, PostView
from posts.serializers import CommentSerializer, PostRankSerializer, PostViewSerializer,PostSerializer
import filetype
import mutagen
import re
import math
from notifications.functions import NotificationFunctions
from notifications.models import Notification

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
            msg = "{} added a new comment".format(request.user.username)
            if int(post.user.id) != int(request.user.id):
                NotificationFunctions.create_notification(post=post.id,user=post.user.id, auther=request.user.id, message=msg, notification_type=Notification.POST_COMMENT)
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
class AddEditPostRank(APIView):
    def post(self, request):
        post_id = request.data.get("post_id")
        if post_id is None:
            return Response({"success": False, "message": "Required Param post_id is missing"}, status=400)
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response({"success": False, "message": "Invalid post_id param provided"}, status=400)
        already_ranked = PostRank.objects.filter(ranker=request.user.id, post=post.id)
        if already_ranked.exists():
            already_ranked.delete()
        if int(request.user.id) == int(post.user.id):
            return Response({"success": False, "message": "User can not rank his post"}, status=400)
        data = {"ranker": request.user.id, "post": post.id, "rank": request.data.get("rank")}
        post_rank = PostRankSerializer(data=data)
        if post_rank.is_valid():
            instance = post_rank.save()
            serializer = PostRankSerializer(instance, many=False)
            rank = str(request.data.get("rank")) + '/5'
            msg = "{} voted {} for your video".format(request.user.username, rank)
            NotificationFunctions.create_notification(post=post.id,user=post.user.id, auther=request.user.id, message=msg, notification_type=Notification.POST_RANK)
            return Response({"success": True, "message": "Post Ranked By the user", "data": serializer.data})
        return Response({"success": False, "message": post_rank.errors})


@permission_classes([IsAuthenticated])
class PostRankers(APIView):
    def post(self, request):
        post_id = request.data.get("post_id")
        if post_id is None:
            return Response({"success": False, "message": "Required Param post_id is missing"}, status=400)
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response({"success": False, "message": "Invalid post_id param provided"}, status=400)
        page = request.data.get("page")
        if page is None:
            page = 1
        size = 10
        post_rankers = PostRank.objects.filter(post=post.id).order_by('created_at')
        try:
            paginated_data = Paginator(post_rankers, size)
        except (EmptyPage, InvalidPage):
            return Response({"success": False, "message": "Empty Page"}, status=400)
        serializer = PostRankSerializer(paginated_data.page(page), many=True)
        return Response({"success": True, "data": serializer.data, "total": paginated_data.count,
                         "pages": paginated_data.num_pages, "current_page": int(page)})


@permission_classes([IsAuthenticated])
class AddPostView(APIView):
    def post(self, request):
        post_id = request.data.get("post_id")
        if post_id is None:
            return Response({"success": False, "message": "Required Param post_id is missing"}, status=400)
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response({"success": False, "message": "Invalid post_id param provided"}, status=400)
        already_viewed = PostView.objects.filter(viewer=request.user.id, post=post.id)
        if already_viewed.exists():
            already_viewed.delete()
        data = {"viewer": request.user.id, "post": post.id}
        post_view = PostViewSerializer(data=data)
        if post_view.is_valid():
            instance = post_view.save()
            serializer = PostViewSerializer(instance, many=False)
            return Response({"success": True, "message": "Post View Recorded", "data": serializer.data})
        return Response({"success": False, "message": post_view.errors})\


@permission_classes([IsAuthenticated])
class Create(APIView):
    def post(self, request):
        try:
            content = request.FILES['content']
        except Exception as e:
            print(e)
            return Response({"success": False, "message": "Required param content is missing"}, status=400)
        try:
            thumbnail = request.FILES['thumbnail']
        except MultiValueDictKeyError:
            thumbnail = None
        kind = filetype.guess(content)
        if kind is None:
            return Response({"success": False, "message": "Can't Determine file type"}, status=400)
        extension = kind.extension
        print(extension)
        if PostFunctions.valid_extension(extension):
            data = {"content": request.data.get('content'), "thumbnail": thumbnail, "caption": request.data.get("caption"), "user": request.user.id}
            post = PostSerializer(data=data)
            if post.is_valid():
                instance = post.save()
                # file_info = mutagen.File(instance.content.path).info.pprint()
                # second = str(file_info)
                # info_lst = second.split(",")
                # number_of_seconds = str(info_lst[1])
                # number_of_seconds = re.findall('\d*\.?\d+',number_of_seconds)
                # number_of_seconds = math.floor(float(number_of_seconds[0]))
                serializer = PostSerializer(instance, many=False, context={'request': request})
                # if 90 > number_of_seconds:
                return Response({"success": True, "message": "Post Created", "data": serializer.data})
                # existing = Post.objects.get(pk=serializer.data.get('id'))
                # existing.delete()
                # return Response({"success": False, "message": "content duration is greater than 90 seconds"},
                #                 status=400)
            return Response({"success": False, "message": post.errors}, status=400)
        return Response({"success": False, "message": "Invalid post content provided only Audio, video allowed"}, status=400)


@permission_classes([IsAuthenticated])
class EditPost(APIView):
    def post(self, request):
        post_id = request.data.get("post_id")
        if post_id is None:
            return Response({"success": False, "message": "Required params post_id is missing"})
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response({"success": False, "message": "Invalid post_id params provided"})
        try:
            content = request.FILES['content']
        except Exception as e:
            print(e)
            return Response({"success": False, "message": "Required param content is missing"}, status=400)
        try:
            thumbnail = request.FILES['thumbnail']
        except MultiValueDictKeyError:
            thumbnail = None
        kind = filetype.guess(content)
        if kind is None:
            return Response({"success": False, "message": "Can't Determine file type"}, status=400)
        extension = kind.extension
        print(extension)
        if PostFunctions.valid_extension(extension):
            data = {"content": request.data.get('content'), "caption": request.data.get("caption"),
                    "user": request.user.id, "thumbnail": thumbnail}
            validated_data = PostSerializer(data=data)
            if validated_data.is_valid():
                file_info = mutagen.File(post.content.path).info.pprint()
                second = str(file_info)
                info_lst = second.split(",")
                number_of_seconds = str(info_lst[1])
                number_of_seconds = re.findall('\d*\.?\d+', number_of_seconds)
                number_of_seconds = math.floor(float(number_of_seconds[0]))
                if 90 > number_of_seconds:
                    if content is not None:
                        os.remove(post.content.path)
                    post.content = content
                    post.caption = data.get('caption')
                    post.thumbnail = thumbnail
                    post.save()
                    serializer = PostSerializer(post,many=False, context={'request': request})
                    return Response({"success": True, "message": "Post Edited", "data": serializer.data})
                return Response({"success": False, "message": "content duration is greater than 90 seconds"},
                                status=400)
            return Response({"success": False, "message": validated_data.errors},status=400)
        return Response({"success": False, "message": "Invalid Post Content provided only Audio,Video allowedd"})


@permission_classes([IsAuthenticated])
class DeletePost(APIView):
    def post(self, request):
        post_id = request.data.get('post_id')
        if post_id is None:
            return Response({"success": False, "message": "Required params post_id is missing"})
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response({"success": False, "message": "Invalid post_id params provided"})
        post.delete()
        return Response({"success": True, "message": "Post Deleted successfully"})



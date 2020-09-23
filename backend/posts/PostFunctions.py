from django.utils.datastructures import MultiValueDictKeyError
import filetype
from posts.serializers import PostSerializer
import mutagen
import re
import math
from notifications.functions import NotificationFunctions
from notifications.models import Notification
from posts.models import Post
class PostFunctions:
    @staticmethod
    def valid_extension(extension):
        if extension == 'mp4' or extension == 'x-m4v' or extension == 'x-matroska' or \
                extension == 'webm' or extension == 'quicktime' or extension == 'x-msvideo' or \
                extension == 'x-ms-wmv' or extension == 'mpeg' or extension == 'x-flv' or \
                extension == 'mp3' or extension == 'midi' or extension == 'mpeg' or extension == 'm4a' or \
                extension == 'mov' or extension == 'MOV' or \
                extension == 'ogg' or extension == 'x-flac' or extension == 'x-wav' or extension == 'amr':
            return True
        return False
    
    @staticmethod
    def create_post(request):
        try:
            content = request.FILES['content']
        except Exception as e:
            print(e)
            return {"success": False, "message": "Required param content is missing"}
        try:
            thumbnail = request.FILES['thumbnail']
        except MultiValueDictKeyError:
            thumbnail = None
        kind = filetype.guess(content)
        if kind is None:
            return {"success": False, "message": "Can't Determine file type"}
        extension = kind.extension
        print(extension)
        if PostFunctions.valid_extension(extension):
            data = {"content": request.data.get('content'), "thumbnail": thumbnail, "caption": request.data.get("caption"), "user": request.user.id}
            post = PostSerializer(data=data)
            if post.is_valid():
                instance = post.save()
                file_info = mutagen.File(instance.content.path).info.pprint()
                second = str(file_info)
                info_lst = second.split(",")
                number_of_seconds = str(info_lst[1])
                number_of_seconds = re.findall('\d*\.?\d+',number_of_seconds)
                number_of_seconds = math.floor(float(number_of_seconds[0]))
                serializer = PostSerializer(instance, many=False, context={'request': request})
                if 90 > number_of_seconds:
                    return {"success": True, "message": "Post Created", "data": serializer.data}
                existing = Post.objects.get(pk=serializer.data.get('id'))
                existing.delete()
                return {"success": False, "message": "content duration is greater than 90 seconds"}
            return {"success": False, "message": post.errors}
        return {"success": False, "message": "Invalid post content provided only Audio, video allowed"}
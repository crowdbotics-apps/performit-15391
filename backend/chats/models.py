from django.db import models
from django.conf import settings
# Create your models here.
class ChatMedia(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="chat_image_user_set")
    media = models.FileField("Chat Media", upload_to="chat_images/", null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __set__(self):
        return "{} - {}".format(self.user, self.media, self.created_at, self.updated_at)


    class Meta:
        ordering = ('created_at',)
        verbose_name = 'Chat Media Management'
        verbose_name_plural = 'Chat Media Management'
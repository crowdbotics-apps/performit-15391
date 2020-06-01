from django.db import models
from django.conf import settings

# Create your models here.

class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="post_user_set")
    content = models.FileField("SELECT Media", null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __set__(self):
        return "{} - {}".format(self.user, self.content, self.created_at, self.updated_at)

    class Meta:
        verbose_name = 'User Post Management'
        verbose_name_plural = 'User Post Management'

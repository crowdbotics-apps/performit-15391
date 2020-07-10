from django.db import models
from django.conf import settings


# Create your models here.
class UserRelationship(models.Model):
    # this user represent following
    following = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user_following_user_set")
    follower = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user_follower_set")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __set__(self):
        return "{} - {}".format(self.user, self.follower,
                                self.created_at, self.updated_at)

    class Meta:
        verbose_name = 'User Relationship Management'
        verbose_name_plural = 'User Relationship Management'

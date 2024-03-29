from django.db import models
from django.contrib.auth import get_user_model
from posts.models import Post
from groups.models import InviteUser, JoiningRequest

User = get_user_model()
# Create your models here.
class Notification(models.Model):
    POST_RANK = "Post Rank"
    POST_COMMENT = "Post Comment"
    GROUP_JOINING_REQUEST = "Group Joining Request"
    GROUP_INVITE = "Group Invite"
    NOTIFICATION_TYPE_CHOICES = (
        (POST_RANK, POST_RANK),
        (POST_COMMENT, POST_COMMENT),
        (GROUP_JOINING_REQUEST, GROUP_JOINING_REQUEST),
        (GROUP_INVITE, GROUP_INVITE),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notification_user_set")
    message = models.CharField("Enter Message", max_length=610, null=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="notification_post_set", null=True)
    auther = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notification_auther_set")
    is_read = models.BooleanField(default=False)
    notification_type = models.CharField("Select Type", max_length=30, choices=NOTIFICATION_TYPE_CHOICES, null=False)
    request = models.ForeignKey(JoiningRequest, on_delete=models.CASCADE, related_name="notification_request_set", null=True, blank=True)
    invite = models.ForeignKey(InviteUser, on_delete=models.CASCADE, related_name="notification_invite_set", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __set__(self):
        return "{} - {}".format(self.user, self.message,self.auther,self.post, self.is_read, self.notification_type, self.created_at, self.updated_at)

    class Meta:
        verbose_name = 'Notification Management'
        verbose_name_plural = 'Notification Management'
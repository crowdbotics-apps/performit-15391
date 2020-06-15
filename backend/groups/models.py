from django.db import models
from django.conf import settings

# Create your models here.


class Group(models.Model):
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="group_created_by")
    group_name = models.CharField("Enter Group Name", max_length=255, null=False)
    group_description = models.TextField("Enter Group Description", null=True, blank=True)
    group_icon = models.ImageField("Select Group Icon", upload_to="", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __set__(self):
        return "{} - {}".format(self.created_by, self.group_name, self.group_description, self.group_icon,
                                self.created_at, self.updated_at)

    class Meta:
        verbose_name = 'Group Management'
        verbose_name_plural = 'Group Management'


class GroupMembers(models.Model):
    member = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="group_member_set")
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="group_members_group_set")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __set__(self):
        return "{} - {}".format(self.member, self.group,
                                self.created_at, self.updated_at)

    class Meta:
        verbose_name = 'Group Member Management'
        verbose_name_plural = 'Group Member Management'



from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

# Create your models here.
class Log(models.Model):
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField("Message", null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Logs'
        verbose_name_plural = 'Logs'

    def __set__(self):
        return "{} - {}".format(self.created_by, self.message, self.created_at, self.updated_at)

    def __str__(self):
        return self.message
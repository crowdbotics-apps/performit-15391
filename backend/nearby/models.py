from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()
# Create your models here.
class LiveLocation(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="live_location_user_set")
    location_lat = models.DecimalField(max_digits=9, decimal_places=6, null=False)
    location_long = models.DecimalField(max_digits=9, decimal_places=6, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __set__(self):
        return "{} - {}".format(self.user, self.location_lat, self.location_long,
                                self.created_at, self.updated_at)

    class Meta:
        verbose_name = 'User Live Location Management'
        verbose_name_plural = 'User Live Location Management'
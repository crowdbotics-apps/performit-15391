from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _


class User(AbstractUser):

    # First Name and Last Name do not cover name patterns
    # around the globe.
    name = models.CharField(_("Name of User"), blank=True, null=True, max_length=255)
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$',
                                 message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    phone_number = models.CharField("Phone Number",validators=[phone_regex], max_length=17, blank=True, default="")  # validators should be a list
    phone_number_verified = models.BooleanField(default=False)

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})


class VerificationCode(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="varification_code_user_set")
    code = models.IntegerField("Code For SMS or email varification", null=False)
    verified = models.BooleanField("Is Verified? ", default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __set__(self):
        return "{} - {}".format(self.user, self.code,self.verfied, self.created_at, self.updated_at)

    class Meta:
        verbose_name = 'User OTP Verification Codes'
        verbose_name_plural = 'User OTP Verification Codes'

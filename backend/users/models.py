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


class UserDetail(models.Model):
    MALE = "Male"
    FEMALE = "Female"
    GENDER_CHOICES = (
        (MALE, MALE),
        (FEMALE, FEMALE)
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="user_detail_user_set")
    profile_pic = models.ImageField("Select Image", upload_to="profile_images", null=True)
    location_address = models.TextField("Enter User Address", null=True, blank=True)
    location_lat = models.CharField("Enter Location Latitude", max_length=255, null=True, blank=True)
    location_long = models.CharField("Enter Location Longitude", max_length=255, null=True, blank=True)
    gender = models.CharField("Select Gender", choices=GENDER_CHOICES, max_length=10, null=True, blank=True)
    bio = models.TextField("Enter Bio", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __set__(self):
        return "{} - {}".format(self.user, self.location_address,self.location_lat, self.location_long,self.gender,
                               self.bio, self.created_at, self.updated_at)

    class Meta:
        verbose_name = 'User Detail Management'
        verbose_name_plural = 'User Detail Management'


class UserType(models.Model):
    ARTIST = "Artist"
    SINGER = "Videographer"
    RAPPER = "Engineer"
    DANCER = "Dancer"
    PRODUCER = "Producer"
    OTHER = "DJ"
    USER_TYPE_CHOICES = (
        (ARTIST, ARTIST),
        (SINGER, SINGER),
        (RAPPER, RAPPER),
        (DANCER, DANCER),
        (PRODUCER, PRODUCER),
        (OTHER, OTHER)
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_type_user_set")
    user_type = models.CharField("Select User Type", choices=USER_TYPE_CHOICES, null=False, max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __set__(self):
        return "{} - {}".format(self.user, self.user_type, self.created_at, self.updated_at)

    class Meta:
        verbose_name = 'User Type Management'
        verbose_name_plural = 'User Type Management'


class ConnectedSocialMedia(models.Model):
    FACEBOOK = "Facebook"
    INSTAGRAM = "Instagram"
    YOUTUBE = "Youtube"
    SOCIAL_MEDIA_CHOICES = (
        (FACEBOOK, FACEBOOK),
        (INSTAGRAM, INSTAGRAM),
        (YOUTUBE, YOUTUBE),
    )
    social_media_type = models.CharField("Select Social Media Type", choices=SOCIAL_MEDIA_CHOICES, null=False, max_length=20)
    link = models.CharField("Social Media Link", max_length=1024, null=True, blank=True)
    social_media_user_id = models.CharField("Social Media User ID", max_length=1024, null=True, blank=True)
    user_token = models.CharField("Social Media Token", max_length=2048, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="connected_social_media_user_set")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __set__(self):
        return "{} - {}".format(self.user, self.social_media_type, self.link, self.user_id, self.user_token,
                                self.created_at, self.updated_at)

    class Meta:
        verbose_name = 'Connected Social Media Management'
        verbose_name_plural = 'Connected Social Media Management'

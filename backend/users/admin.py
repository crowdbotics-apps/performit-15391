from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model

from users.forms import UserChangeForm, UserCreationForm
from users.models import VerificationCode, UserDetail, UserType

User = get_user_model()


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):

    form = UserChangeForm
    add_form = UserCreationForm
    fieldsets = (("User", {"fields": ("name",)}),) + auth_admin.UserAdmin.fieldsets
    list_display = ["username", "name", "is_superuser", 'email', 'phone_number']
    search_fields = ["name"]


@admin.register(VerificationCode)
class VerificationCodeAdmin(admin.ModelAdmin):
    list_display = ['user', 'code', 'verified']


@admin.register(UserDetail)
class UserDetailAdmin(admin.ModelAdmin):
    list_display = ['user', 'profile_pic', 'location_address', 'location_lat', 'location_long', 'gender', 'bio',
                    'facebook_link', 'youtube_link', 'instagram_link',
                    'created_at', 'updated_at']


@admin.register(UserType)
class UserTypeAdmin(admin.ModelAdmin):
    list_display = ['user', 'user_type', 'created_at', 'updated_at']



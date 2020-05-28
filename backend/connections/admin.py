from django.contrib import admin

# Register your models here.
from connections.models import UserFollower, UserFollowing


@admin.register(UserFollower)
class UserFollowerAdmin(admin.ModelAdmin):
    list_display = ['user', 'follower', 'created_at', 'updated_at']


@admin.register(UserFollowing)
class UserFollowingAdmin(admin.ModelAdmin):
    list_display = ['user', 'following', 'created_at', 'updated_at']
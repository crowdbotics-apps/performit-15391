from django.contrib import admin

# Register your models here.
from connections.models import UserRelationship


@admin.register(UserRelationship)
class UserFollowerAdmin(admin.ModelAdmin):
    list_display = ['following', 'follower', 'created_at', 'updated_at']

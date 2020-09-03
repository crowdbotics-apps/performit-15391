from django.contrib import admin
from groups.models import Group, GroupMembers, GroupPost, JoiningRequest


# Register your models here.


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ['created_by', 'group_name', 'group_icon', 'group_description', 'created_at', 'updated_at']


@admin.register(GroupMembers)
class GroupMemberAdmin(admin.ModelAdmin):
    list_display = ['member', 'group', 'created_at', 'updated_at']


@admin.register(GroupPost)
class GroupPostAdmin(admin.ModelAdmin):
    list_display = ['post', 'group', 'created_at', 'updated_at']


@admin.register(JoiningRequest)
class JoiningRequestAdmin(admin.ModelAdmin):
    list_display = ['user', 'group','accepted','created_at', 'updated_at']
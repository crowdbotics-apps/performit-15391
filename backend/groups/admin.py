from django.contrib import admin
from groups.models import Group, GroupMembers


# Register your models here.


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ['created_by', 'group_name', 'group_icon', 'group_description', 'created_at', 'updated_at']


@admin.register(GroupMembers)
class GroupMemberAdmin(admin.ModelAdmin):
    list_display = ['member', 'group', 'created_at', 'updated_at']
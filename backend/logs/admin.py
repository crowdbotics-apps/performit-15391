from django.contrib import admin
from logs.models import Log

# Register your models here.
@admin.register(Log)
class LogAdmin(admin.ModelAdmin):
    list_display = ['created_by', 'message', 'created_at', 'updated_at']
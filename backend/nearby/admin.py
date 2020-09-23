from django.contrib import admin
from nearby.models import LiveLocation
# Register your models here.
@admin.register(LiveLocation)
class LiveLocationAdmin(admin.ModelAdmin):
    list_display = ['user', 'location_lat', 'location_long']
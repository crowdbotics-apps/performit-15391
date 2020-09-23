from django.urls import path
from nearby.views import UpdateCurrentLocation, NearbyUsers
app_name = "nearby"
urlpatterns = [
    path("update-current-location/", view=UpdateCurrentLocation.as_view(), name="update-current-location"),
    path("users/", view=NearbyUsers.as_view(), name="nearby-users"),
]

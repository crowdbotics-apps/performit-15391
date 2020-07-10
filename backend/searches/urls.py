from django.urls import path
from searches.views import SearchDashboard

app_name = "searches"
urlpatterns = [
    path("search-dashboard/", view=SearchDashboard.as_view(), name="search-dashboard")
]

from django.shortcuts import render
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response
from nearby.models import LiveLocation
from nearby.serializers import LiveLocationSerializer

# Create your views here.
@permission_classes([IsAuthenticated])
class UpdateCurrentLocation(APIView):
    def post(self, request):
        try:
            existing_loc = LiveLocation.objects.get(user=request.user.id)
        except LiveLocation.DoesNotExist:
            existing_loc = None
        if existing_loc is not None:
            existing_loc.location_lat = request.data.get("location_lat")
            existing_loc.location_long = request.data.get("location_long")
            existing_loc.save()
        else:
            data = {"location_lat": request.data.get("location_lat"), "location_long": request.data.get("location_long"), "user": request.user.id}
            location = LiveLocationSerializer(data=data)
            if location.is_valid():
                existing_loc = location.save()
            else:
                return Response({"success": False, "message": location.errors}, status=400)
        serializer = LiveLocationSerializer(existing_loc, many=False)
        return Response({"success": True, "message": "Location Recorded", "data": serializer.data})

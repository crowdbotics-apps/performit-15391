from django.shortcuts import render
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response
from nearby.models import LiveLocation
from nearby.serializers import LiveLocationSerializer
import requests
from users.models import UserType, User
from django.db.models import Q
from users.serializers import CustomUserSerializer
from performit_15391 import settings
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


@permission_classes([IsAuthenticated])
class NearbyUsers(APIView):
    def post(self, request):
        user_types = request.data.getlist("user_types")
        distance = request.data.get('distance')
        term = request.data.get('term')
        if distance is None:
            distance = 1
        try:
            user_cuurent_location = LiveLocation.objects.get(user=request.user.id)
        except LiveLocation.DoesNotExist:
            return Response({"success": False, "message": "User Current Location is not recorded"}, status=400)
        locations = LiveLocation.objects.exclude(pk=user_cuurent_location.id).values()
        origin_lat_long = str(user_cuurent_location.location_lat) + ',' + str(user_cuurent_location.location_long)
        destinations = ''
        user_ids = []
        for loc in locations:
            destinations += str(loc['location_lat']) + ',' + str(loc['location_long']) + '|'
            user_ids.append(loc['user_id'])
        destinations = destinations[:-1]
        data = requests.get("https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="+origin_lat_long+"&destinations="+destinations+"&key="+settings.GOOGLE_MAP_API_KEY)
        json_resp = data.json()
        nearby_users = []
        if json_resp['status'] == "OK":
            elements = json_resp['rows'][0]['elements']
            i = 0
            for el in elements:
                if el['status'] == "OK":
                    distance_in_m = float(el['distance']['value'])
                    distance_in_miles = distance_in_m / 1609
                    # print(distance_in_miles)
                    distance_at = "{:.2f}".format(distance_in_miles)
                    distance_at = float(distance_at)
                    # print(distance_at)
                    # distance_at = float(el['distance']['text'][:-3])
                    # print(distance_at)
                    if distance_at < float(distance):
                        nearby_users.append(user_ids[i])
                i += 1
        if user_types is not None:
            users_type_filter = UserType.objects.filter(user_type__in=user_types).values_list('user', flat=True)
        if term is not None:
            if users_type_filter.exists():
                users = User.objects.filter(Q(username__icontains=term) | Q(first_name__icontains=term) | Q(last_name__icontains=term) | Q(name__icontains=term)).filter(pk__in=users_type_filter).filter(pk__in=nearby_users)
            else:
                users = User.objects.filter(Q(username__icontains=term) | Q(first_name__icontains=term) | Q(last_name__icontains=term) | Q(name__icontains=term)).filter(pk__in=nearby_users)
        else:
            if users_type_filter.exists():
                users = User.objects.filter(pk__in=nearby_users).filter(pk__in=users_type_filter)
            else:
                users = User.objects.filter(pk__in=nearby_users)
        user_serializer = CustomUserSerializer(users, many=True)
        return Response({"success": True, "data": user_serializer.data})
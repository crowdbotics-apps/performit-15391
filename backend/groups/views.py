from django.shortcuts import render

from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response

# Create your views here.
@permission_classes([IsAuthenticated])
class Feed(APIView):
    def post(self, request):
        return Response("OK")


@permission_classes([IsAuthenticated])
class Create(APIView):
    def post(self, request):
        return Response("OK")


@permission_classes([IsAuthenticated])
class Edit(APIView):
    def post(self, request):
        return Response("OK")


@permission_classes([IsAuthenticated])
class Delete(APIView):
    def post(self, request):
        return Response("OK")

@permission_classes([IsAuthenticated])
class CreatePost(APIView):
    def post(self, request):
        return Response("OK")


@permission_classes([IsAuthenticated])
class JoiningRequest(APIView):
    def post(self, request):
        return Response("OK")


@permission_classes([IsAuthenticated])
class AcceptJoiningRequest(APIView):
    def post(self, request):
        return Response("OK")


@permission_classes([IsAuthenticated])
class Invite(APIView):
    def post(self, request):
        return Response("OK")


@permission_classes([IsAuthenticated])
class AcceptInvite(APIView):
    def post(self, request):
        return Response("OK")



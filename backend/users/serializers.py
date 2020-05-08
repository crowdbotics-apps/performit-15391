from allauth.account.utils import setup_user_email
from allauth.utils import get_username_max_length, email_address_exists
from django.contrib.auth import get_user_model
from django.http import HttpRequest
from rest_framework import serializers
from allauth.account import app_settings as allauth_settings
from allauth.account.adapter import get_adapter
from django.utils.translation import ugettext_lazy as _

User = get_user_model()


class SignupUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'phone_number', 'password')
        extra_kwargs = {
            'password': {
                'write_only': True,
                'style': {
                    'input_type': 'password'
                }
            },
            'username': {
                'required': True
            }
        }
    username = serializers.CharField(
        max_length=get_username_max_length(),
        min_length=allauth_settings.USERNAME_MIN_LENGTH,
        required=True
    )
    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True)

    def validate_username(self, username):
        username = get_adapter().clean_username(username)
        return username

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address."))
        return email

    def _get_request(self):
        request = self.context.get('request')
        if request and not isinstance(request, HttpRequest) and hasattr(request, '_request'):
            request = request._request
        return request

    def create(self, validated_data):
        request = self._get_request()
        email = validated_data.get('email')
        if email is None:
            email = ""
        user = User(
            email="",
            name=validated_data.get('name'),
            username=validated_data.get('username'),
            first_name="",
            last_name=""
        )
        user.set_password(validated_data.get('password'))
        user.save()
        setup_user_email(request, user, [])
        return user

    def save(self, request):
        """rest_auth passes request so we must override to accept it"""
        return super().save()
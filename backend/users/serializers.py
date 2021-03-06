from allauth.utils import get_username_max_length, email_address_exists
from django.contrib.auth import get_user_model, authenticate
from rest_auth.models import TokenModel
from allauth.account import app_settings as allauth_settings
from allauth.account.adapter import get_adapter
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers, exceptions
from django.conf import settings
from users.models import UserDetail, UserType
from nearby.models import LiveLocation

User = get_user_model()


class UserDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserDetail
        fields = "__all__"


class CustomUserSerializer(serializers.ModelSerializer):
    meta_data = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('pk','meta_data', 'username', 'email', 'first_name', 'last_name', "phone_number", "phone_number_verified", "name")
        read_only_fields = ('email', )

    def get_meta_data(self, obj):
        try:
            user_details = UserDetail.objects.get(user=obj.id)
        except UserDetail.DoesNotExist:
            user_details = None
        user_detail_serializer = UserDetailSerializer(user_details, many=False)
        user_type_qs = UserType.objects.filter(user=obj.id)
        user_type_serializer = UserTypeSerializer(user_type_qs, many=True)
        user_types = []
        live_location_lat = None
        live_location_long = None
        try:
            live_location = LiveLocation.objects.get(user=obj.id)
        except LiveLocation.DoesNotExist:
            live_location = None
        if live_location is not None:
            live_location_lat = live_location.location_lat
            live_location_long = live_location.location_long
        for type in user_type_serializer.data:
            user_types.append(type['user_type'])
        return {"user_details": user_detail_serializer.data, "user_types": user_types, 'live_location_lat': live_location_lat, 'live_location_long': live_location_long}


class CustomTokenSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(many=False)

    class Meta:
        model = TokenModel
        fields = ('key', 'user')


class UserTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserType
        fields = "__all__"


class UserDetailSerializer(serializers.ModelSerializer):
    # device = DeviceSerializer(required=False)
    class Meta:
        model = UserDetail
        fields = '__all__'


class UserDetailEditSerializer(serializers.ModelSerializer):
    user = serializers.IntegerField()

    class Meta:
        model = UserDetail
        fields = '__all__'


class CustomLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(style={'input_type': 'password'})

    def authenticate(self, **kwargs):
        return authenticate(self.context['request'], **kwargs)

    def _validate_email(self, email, password):
        user = None

        if email and password:
            user = self.authenticate(email=email, password=password)
        else:
            msg = _('Must include "email" and "password".')
            raise exceptions.ValidationError(msg)

        return user

    def _validate_username(self, username, password):
        user = None

        if username and password:
            user = self.authenticate(username=username, password=password)
        else:
            msg = _('Must include "username" and "password".')
            raise exceptions.ValidationError(msg)

        return user

    def _validate_username_email(self, username, email, password):
        user = None

        if email and password:
            user = self.authenticate(email=email, password=password)
        elif username and password:
            user = self.authenticate(username=username, password=password)
        else:
            msg = _('Must include either "username" or "email" and "password".')
            raise exceptions.ValidationError(msg)

        return user

    def validate(self, attrs):
        username = attrs.get('username')
        email = attrs.get('email')
        password = attrs.get('password')

        user = None

        if 'allauth' in settings.INSTALLED_APPS:
            from allauth.account import app_settings

            # Authentication through email
            if app_settings.AUTHENTICATION_METHOD == app_settings.AuthenticationMethod.EMAIL:
                user = self._validate_email(email, password)

            # Authentication through username
            elif app_settings.AUTHENTICATION_METHOD == app_settings.AuthenticationMethod.USERNAME:
                user = self._validate_username(username, password)

            # Authentication through either username or email
            else:
                user = self._validate_username_email(username, email, password)

        else:
            # Authentication without using allauth
            if email:
                try:
                    username = User.objects.get(email__iexact=email).get_username()
                except User.DoesNotExist:
                    pass

            if username:
                user = self._validate_username_email(username, '', password)

        # Did we get back an active user?
        if user:
            if not user.is_active:
                msg = _('User account is disabled.')
                raise exceptions.ValidationError(msg)
        else:
            msg = _('Unable to log in with provided credentials.')
            raise exceptions.ValidationError(msg)

        # If required, is the email verified?
        if user.email is not "":
            if 'rest_auth.registration' in settings.INSTALLED_APPS:
                from allauth.account import app_settings
                if app_settings.EMAIL_VERIFICATION == app_settings.EmailVerificationMethod.MANDATORY:
                    email_address = user.emailaddress_set.get(email=user.email)
                    if not email_address.verified:
                        raise serializers.ValidationError(_('E-mail is not verified.'))

        if user.phone_number is not "":

            if user.phone_number_verified == False:
                raise serializers.ValidationError(_('Phone Number is not verified.'))
        attrs['user'] = user
        return attrs

class SignupWithEmailSerializer(serializers.ModelSerializer):
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
            },
            'email': {
                'required': True,
                'allow_blank': False,
            }
        }
    username = serializers.CharField(
        max_length=get_username_max_length(),
        min_length=allauth_settings.USERNAME_MIN_LENGTH,
        required=True
    )

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


class SignUpWithPhoneSerializer(serializers.ModelSerializer):
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
            },
            'phone_number': {
                'required': True,
                'allow_blank': False,
            }
        }
    username = serializers.CharField(
        max_length=get_username_max_length(),
        min_length=allauth_settings.USERNAME_MIN_LENGTH,
        required=True
    )

    def validate_username(self, username):
        username = get_adapter().clean_username(username)
        return username

    def validate_phone_number(self, phone_number):
        try:
            user = User.objects.get(phone_number=phone_number)
        except User.DoesNotExist:
            return  phone_number
        raise serializers.ValidationError(
            _("A user is already registered with this phone number."))
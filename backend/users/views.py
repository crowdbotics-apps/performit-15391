from allauth.account.models import EmailAddress
from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.paginator import Paginator, EmptyPage, InvalidPage
from django.urls import reverse
from django.utils.datastructures import MultiValueDictKeyError
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import DetailView, RedirectView, UpdateView
from random import randint

from rest_auth.models import TokenModel
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response

from connections.models import UserRelationship
from posts.models import Post
from posts.serializers import PostSerializer
from users.models import VerificationCode, UserType, UserDetail, ConnectedSocialMedia
from users.send_verification_code import SendVerificationCode
from users.serializers import SignupWithEmailSerializer, SignUpWithPhoneSerializer, CustomTokenSerializer, \
    UserDetailSerializer, CustomUserSerializer, UserTypeSerializer, UserDetailEditSerializer, ConnectedSocialMediaSerializer
from users.verification_code_generator import VerificationCodeGenerator
import facebook

User = get_user_model()


class UserDetailView(LoginRequiredMixin, DetailView):

    model = User
    slug_field = "username"
    slug_url_kwarg = "username"


user_detail_view = UserDetailView.as_view()


class UserUpdateView(LoginRequiredMixin, UpdateView):

    model = User
    fields = ["name"]

    def get_success_url(self):
        return reverse("users:detail", kwargs={"username": self.request.user.username})

    def get_object(self):
        return User.objects.get(username=self.request.user.username)


user_update_view = UserUpdateView.as_view()


class UserRedirectView(LoginRequiredMixin, RedirectView):

    permanent = False

    def get_redirect_url(self):
        return reverse("users:detail", kwargs={"username": self.request.user.username})


user_redirect_view = UserRedirectView.as_view()


class TestApi(APIView):
    def post(self, request):
        number = VerificationCodeGenerator.random_with_N_digits(5)
        return Response({"number": number})


class SignUp(APIView):

    def post(self, request):
        type = request.data.get('type')
        if type is None:
            return Response({"success": False, "message": "type param describing email or phone is missing."}, status=400)
        if type == 'email':
            data = {"username": request.data.get("username"), "email": request.data.get("email"),
                    "password": request.data.get("password") }
            user = SignupWithEmailSerializer(data=data)

        elif type == 'phone':
            data = {"username": request.data.get("username"), "phone_number": request.data.get("phone_number"),
                    "password": request.data.get("password")}
            user = SignUpWithPhoneSerializer(data=data)
        else:
            return Response({"success": False, "message": "Invalid type param provided."}, status=400)
        if user.is_valid():
            if type == 'phone':
                instance = User(username=data.get('username'), phone_number=data.get('phone_number'))
            elif type == 'email':
                instance = User(username=data.get('username'), email=data.get('email'))
            instance.set_password(data.get('password'))
            instance.save()
            if type == 'email':
                emails = EmailAddress(user=instance, email=instance.email, primary=True)
                emails.save()
            token = TokenModel.objects.create(user_id=instance.id)
            code = VerificationCodeGenerator.random_with_N_digits(5)
            code_for_user = VerificationCode(user=instance, code=code)
            response = SendVerificationCode.send_code(code, type, instance)
            error = None
            if response.get('success'):
                message = "Verification Code Sent"
            else:
                message = "Unable to send verification Code"
                error = response.get('message')
            code_for_user.save()
            return Response({"success": True, "message": message, "error": error })
        return Response({"success": False, "message": user.errors}, status=400)


class ConfirmCode(APIView):

    def post(self, request):
        code = request.data.get("code")
        if code is None:
            return Response({"success": False, "message": "code param is missing."}, status=400)
        try:
            verified = VerificationCode.objects.get(code=code, verified=False)
        except VerificationCode.DoesNotExist:
            return Response({"success": False, "message": "Invalid verification code provided."}, status=400)
        try:
            user = User.objects.get(pk=verified.user_id)
        except User.DoesNotExist:
            return Response({"success": False, "message": "Invalid User."}, status=400)
        verified.verified = True
        verified.save()
        if user.phone_number is not "":
            # verification method is phone
            user.phone_number_verified = True
            user.save()
        if user.email is not "":
            try:
                email = EmailAddress.objects.get(user=user)
            except EmailAddress.DoesNotExist:
                return Response({"success": False, "message": "Email Address does not exist."}, status=400)
            email.verified = True
            email.save()
        token = TokenModel.objects.get(user=user)
        serializer = CustomTokenSerializer(token, many=False)
        return Response({"success": True, "message": "Code Verified.", "user": serializer.data })


class SendForgotPasswordCode(APIView):
    def post(self, request):
        type = request.data.get('type')
        if type is None:
            return Response({"success": False, "message": "type param describing email or phone is missing."}, status=400)
        if type == 'email':
            email = request.data.get("email")
            if email is None:
                return Response({"success": False, "message": "email param is missing"}, status=400)
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"success": False, "message": "Invalid Email Address Provided."})
            try:
                existing_code = VerificationCode.objects.get(user=user)
                existing_code.delete()
            except VerificationCode.DoesNotExist:
                pass
            code = VerificationCodeGenerator.random_with_N_digits(5)
            code_for_user = VerificationCode(user=user, code=code)
            response = SendVerificationCode.send_code(code, type, user)
            error = None
            if response.get('success'):
                message = "Verification Code Sent"
            else:
                message = "Unable to send verification Code"
                error = response.get('message')
            code_for_user.save()
            return Response({"success": True, "message": message, "error": error})
        elif type == 'phone':
            phone_number = request.data.get("phone_number")
            if phone_number is None:
                return Response({"success": False, "message": "email param is missing"}, status=400)
            try:
                user = User.objects.get(phone_number=phone_number)
            except User.DoesNotExist:
                return Response({"success": False, "message": "Invalid Email Address Provided."})
            code = VerificationCodeGenerator.random_with_N_digits(5)
            try:
                existing_code = VerificationCode.objects.get(user=user, verified=True)
                existing_code.delete()
            except VerificationCode.DoesNotExist:
                return Response({"success": False,"message":"Phone number is not verified."}, status=400)
            code_for_user = VerificationCode(user=user, code=code)
            response = SendVerificationCode.send_code(code, type, user)
            error = None
            if response.get('success'):
                message = "Verification Code Sent"
            else:
                message = "Unable to send verification Code"
                error = response.get('message')
            code_for_user.save()
            return Response({"success": True, "message": message, "error": error})
        else:
            return Response({"success": False, "message": "Invalid type param provided."}, status=400)


class ResendCode(APIView):
    def post(self, request):
        type = request.data.get('type')
        if type is None:
            return Response({"success": False, "message": "type param describing email or phone is missing."},
                            status=400)
        if type == 'email':
            email = request.data.get("email")
            if email is None:
                return Response({"success": False, "message": "email param is missing"}, status=400)
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"success": False, "message": "Invalid Email Address Provided."})
        elif type == 'phone':
            phone = request.data.get('phone_number')
            if phone is None:
                return Response({"success": False, "message": "email param is missing"}, status=400)
            try:
                user = User.objects.get(phone_number=phone)
            except User.DoesNotExist:
                return Response({"success": False, "message": "Invalid Phone Number Provided."}, status=400)
        else:
            return Response({"success": False, "message": "Invalid Type provided."}, status=400)
        try:
            existing_code = VerificationCode.objects.get(user=user)
            existing_code.delete()
        except VerificationCode.DoesNotExist:
            pass
        code = VerificationCodeGenerator.random_with_N_digits(5)
        code_for_user = VerificationCode(user=user, code=code)
        response = SendVerificationCode.send_code(code, type, user)
        error = None
        if response.get('success'):
            message = "Verification Code Sent"
        else:
            message = "Unable to send verification Code"
            error = response.get('message')
        code_for_user.save()
        return Response({"success": True, "message": message, "error": error})


@permission_classes([IsAuthenticated])
class ResetPassword(APIView):
    def post(self, request):
        user = request.user
        password = request.data.get("password")
        if password is None:
            return Response({"success": False, "message": "password param is missing."}, status=400)
        if user.email is not "":
            # user is signed up using email therefore we should have verified code in the db for authenticating.
            try:
                email = EmailAddress.objects.get(user=user, verified=True)
            except EmailAddress.DoesNotExist:
                return Response({"success": False, "message": "Email Address isn't verified."}, status=400)
        elif user.phone_number is not "":
            if user.phone_number_verified:
                pass
            else:
                return Response({"success": False, "message": "Phone number is not verified."}, status=400)
        #check for password reset code verification.
        user.set_password(password)
        user.save()
        token = TokenModel.objects.get(user=user)
        serializer = CustomTokenSerializer(token, many=False)
        return Response({"success": False, "message": "password reset successful.", "user": serializer.data})


@permission_classes([IsAuthenticated])
class ChangePassword(APIView):
    def post(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        password = request.data.get("password")
        if current_password is None or password is None:
            return Response({"success": False, "message": "Required param password or current_password is missing"},
                            status=400)
        if user.check_password(current_password):
            user.set_password(password)
            user.save()
            return Response({"success": True, "message": "Password changed successfully"})
        return Response({"success": False, "message": "Invalid Current Password"})


@permission_classes([IsAuthenticated])
class GetUserDetail(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        page = request.data.get("page")
        if page is None:
            page = 1
        size = 10
        if user_id is None:
            return Response({"success": False, "message": "Required param user_id is missing"})
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"success": False, "message": "Invalid User"}, status=400)
        try:
            user_details = UserDetail.objects.get(user=user)
        except UserDetail.DoesNotExist:
            user_details = None
        user_types = UserType.objects.filter(user=user)
        user_types = []
        for type in user_types:
            user_types.append(type['user_type'])
        posts = Post.objects.filter(user=user).order_by("created_at")
        try:
            paginated_data = Paginator(posts, size)
        except (EmptyPage, InvalidPage):
            return Response({"success": False, "message": "Empty Page"}, status=400)
        post_serializer = PostSerializer(paginated_data.page(page), many=True)
        user_details_serializer = UserDetailSerializer(many=False)
        user_serializer = CustomUserSerializer(user,many=False)
        user_follower_qs = UserRelationship.objects.filter(following=user)
        user_following_qs= UserRelationship.objects.filter(follower=user)
        can_edit = False
        if int(user_id) == int(request.user.id):
            can_edit = True
        data = {"user": user_serializer.data, "user_details": user_details_serializer.data, "user_types":user_types,
                "posts": post_serializer.data,
                "followers_count": user_follower_qs.count(), "user_following_count": user_following_qs.count(),
                "can_edit": can_edit, "total": paginated_data.count,
                         "pages": paginated_data.num_pages, "current_page": int(page) }
        return Response({"success": True, "data": data })


@permission_classes([IsAuthenticated])
class EditProfile(APIView):
    def post(self, request):
        try:
            profile_pic = request.FILES['profile_pic']
        except MultiValueDictKeyError:
            profile_pic = None

        user_detail_data = {"user": request.user.id, "profile_pic": profile_pic,
                            "location_address": request.data.get("location_address"),
                            "location_lat": request.data.get("location_lat"),
                            "location_long": request.data.get("location_long"), "gender": request.data.get("gender"),
                            "bio": request.data.get("bio")}
        existing = UserDetail.objects.filter(user=request.user.id)
        if existing.exists():
            user_detail_serializer = UserDetailEditSerializer(data=user_detail_data)
        else:
            user_detail_serializer = UserDetailSerializer(data=user_detail_data)
        if user_detail_serializer.is_valid():
            user_type_list = request.data.getlist("user_types")
            existing_types = UserType.objects.filter(user=request.user.id)
            if existing_types.exists():
                existing_types.delete()
            for i in user_type_list:
                data = {"user": request.user.id, "user_type": i}
                user_type_serializer = UserTypeSerializer(data=data)
                if user_type_serializer.is_valid():
                    user_type_instance = user_type_serializer.save()
                else:
                    return Response({"success": False, "message": user_type_serializer.errors}, status=400)
                    break
            try:
                existing_detail = UserDetail.objects.get(user=request.user.id)
                existing_detail.profile_pic = profile_pic
                existing_detail.location_address = user_detail_data.get("location_address")
                existing_detail.location_lat = user_detail_data.get("location_lat")
                existing_detail.location_long = user_detail_data.get("location_long")
                existing_detail.gender = user_detail_data.get("gender")
                existing_detail.bio = user_detail_data.get("bio")
                existing_detail.save()
            except UserDetail.DoesNotExist:
                user_detail_instance = user_detail_serializer.save()
            return Response({"success": True, "message": "User Profile Updated"})
        return Response({"success": False, "message": user_detail_serializer.errors}, status=400)


@permission_classes([IsAuthenticated])
class ConnectSocialMedia(APIView):
    def post(self, request):
        social_media_type = request.data.get("social_media_type")
        token = request.data.get("token")
        if social_media_type is None or token is None:
            return Response({"success": False, "message": "Required Param social_media_type, token is missing."}, status=400)
        if social_media_type == ConnectedSocialMedia.FACEBOOK:
            try:
                graph = facebook.GraphAPI(access_token=token)
                user_info = graph.get_object(
                    id='me',
                    fields='first_name, middle_name, last_name, id, '
                           'currency, hometown, location, locale, '
                           'email, gender, interested_in, picture.type(large),'
                           ' birthday, cover, link')
                data = {"user": request.user.id, "social_media_type": ConnectedSocialMedia.FACEBOOK,
                        "link": user_info.get("link"), "user_token": token, "social_media_user_id": user_info.get("id")}
            except facebook.GraphAPIError as e:
                return Response({"success": False, "message": "Unable to call FB / Invalid Token provided"}, status=400)
            return Response({"success": True, "message": "Facebook"})
        elif social_media_type == ConnectedSocialMedia.YOUTUBE:
            return Response({"success": True, "message": "Youtube"})
        elif social_media_type == ConnectedSocialMedia.INSTAGRAM:
            return Response({"success": True, "message": "Instagram"})
        else:
            return Response({"success": False, "message": "Invalid social_media_type param is provided."})
        connected_social_media = ConnectedSocialMediaSerializer(data=data)
        if connected_social_media.is_valid():
            instance = connected_social_media.save()
            serializer = ConnectedSocialMediaSerializer(instance, many=False)
            return Response({"success": True, "message": "Social Media Connected.", "data": serializer.data})

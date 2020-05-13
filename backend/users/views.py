from allauth.account.models import EmailAddress
from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import DetailView, RedirectView, UpdateView
from random import randint

from rest_auth.models import TokenModel
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response

from users.models import VerificationCode
from users.send_verification_code import SendVerificationCode
from users.serializers import SignupWithEmailSerializer, SignUpWithPhoneSerializer, CustomTokenSerializer
from users.verification_code_generator import VerificationCodeGenerator

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
            if response:
                message = "Verification Code Sent"
            else:
                message = "Unable to send verification Code"
            code_for_user.save()
            return Response({"success": True, "message": message })
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
            if response:
                message = "Verification Code Sent"
            else:
                message = "Unable to send verification Code"
            code_for_user.save()
            return Response({"success": True, "message": message })
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
            if response:
                message = "Verification Code Sent"
            else:
                message = "Unable to send verification Code"
            code_for_user.save()
            return Response({"success": True, "message": message })
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
            try:
                existing_code = VerificationCode.objects.get(user=user, verified=True)
                existing_code.delete()
            except VerificationCode.DoesNotExist:
                pass
        code = VerificationCodeGenerator.random_with_N_digits(5)
        code_for_user = VerificationCode(user=user, code=code)
        response = SendVerificationCode.send_code(code, type, user)
        if response:
            message = "Verification Code Sent"
        else:
            message = "Unable to send verification Code"
        code_for_user.save()
        return Response({"success": True, "message": message })


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
            return Response({"success": False, "message": "Phone number is not verified."}, status=400)
        #check for password reset code verification.
        user.set_password(password)
        user.save()
        token = TokenModel.objects.get(user=user)
        serializer = CustomTokenSerializer(token, many=False)
        return Response({"success": False, "message": "password reset successful.", "user": serializer.data})




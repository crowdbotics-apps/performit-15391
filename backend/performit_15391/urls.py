"""performit_15391 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from allauth.account.views import confirm_email
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf.urls.static import static
from performit_15391 import settings
from users.views import SignUp, ConfirmCode, SendForgotPasswordCode, ResendCode, ResetPassword

urlpatterns = [
    path("", include("home.urls")),
    path("accounts/", include("allauth.urls")),
    path("api/v1/", include("home.api.v1.urls")),
    path("admin/", admin.site.urls),
    path("users/", include("users.urls", namespace="users")),
    path("rest-auth/", include("rest_auth.urls")),
    path("sign-up/", view=SignUp.as_view(), name="sign-up"),
    path("confirm-code/", view=ConfirmCode.as_view(), name="confirm-code"),
    path("send-forgot-password-code/", view=SendForgotPasswordCode.as_view(), name="send-forgot-password-code"),
    path("resend-code/", view=ResendCode.as_view(), name="resend-code"),
    path("reset-password/", view=ResetPassword.as_view(), name="reset-password"),
    # Override email confirm to use allauth's HTML view instead of rest_auth's API view
    path("rest-auth/registration/account-confirm-email/<str:key>/", confirm_email),
    path("rest-auth/registration/", include("rest_auth.registration.urls")),
]

admin.site.site_header = "Performit"
admin.site.site_title = "Performit Admin Portal"
admin.site.index_title = "Performit Admin"

# swagger
schema_view = get_schema_view(
    openapi.Info(
        title="Performit API",
        default_version="v1",
        description="API documentation for Performit App",
    ),
    public=True,
    permission_classes=(permissions.IsAuthenticated,),
)

urlpatterns += [
    path("api-docs/", schema_view.with_ui("swagger", cache_timeout=0), name="api_docs")
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

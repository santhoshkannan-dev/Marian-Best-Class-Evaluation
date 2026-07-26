from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from rest_framework_simplejwt.tokens import RefreshToken

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from .models import User


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


def determine_role_from_email(email):
    """
    Determines user role based on Marian College email format:
    - name.number (e.g. santhosh.25pmc152) -> student
    - name.name (e.g. kochumol.abraham) -> faculty (staff)
    """
    username_part = email.split('@')[0]
    parts = username_part.split('.')
    if len(parts) >= 2:
        second_part = parts[1]
        if any(char.isdigit() for char in second_part):
            return "student"
        else:
            return "faculty"  # Staff ID
    return "student"


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        token = request.data.get("token")

        if not token:
            return Response(
                {"error": "Google token is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not settings.GOOGLE_CLIENT_ID:
            return Response(
                {"error": "GOOGLE_CLIENT_ID is not configured."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        try:
            id_info = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )

            email = id_info.get("email")
            google_id = id_info.get("sub")
            full_name = id_info.get("name", "")
            picture = id_info.get("picture")

            if not email:
                return Response(
                    {"error": "Unable to retrieve email."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Strict domain check: Only permit login if email ends with @mariancollege.org
            if not email.endswith("@mariancollege.org"):
                return Response(
                    {"error": "Access denied. Only official Marian College accounts (@mariancollege.org) are permitted to log in."},
                    status=status.HTTP_403_FORBIDDEN
                )

            detected_role = determine_role_from_email(email)

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                # Automatically create account with detected role (student for name.number, faculty for name.name)
                names = full_name.split(" ", 1) if full_name else [email.split("@")[0], ""]
                user = User.objects.create(
                    username=email,
                    email=email,
                    first_name=names[0],
                    last_name=names[1] if len(names) > 1 else "",
                    role=detected_role,
                    google_id=google_id
                )

            if not user.google_id:
                user.google_id = google_id

            if full_name:
                names = full_name.split(" ", 1)
                user.first_name = names[0]

                if len(names) > 1:
                    user.last_name = names[1]

            user.save()

            tokens = get_tokens_for_user(user)

            return Response(
                {
                    "tokens": tokens,
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "name": user.get_full_name() or user.username,
                        "role": user.role,
                        "department": user.department.name if user.department else None,
                        "department_code": user.department.code if user.department else None,
                        "class_name": user.class_name.name if user.class_name else None,
                        "picture": picture,
                    }
                },
                status=status.HTTP_200_OK
            )

        except ValueError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DevBypassLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        if not settings.DEBUG:
            return Response(
                {"error": "Disabled in production."},
                status=status.HTTP_403_FORBIDDEN
            )

        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not email.endswith("@mariancollege.org"):
            return Response(
                {"error": "Invalid email domain."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            user = User.objects.get(email=email)

            tokens = get_tokens_for_user(user)

            return Response(
                {
                    "tokens": tokens,
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "name": user.get_full_name() or user.username,
                        "role": user.role,
                        "department": user.department.name if user.department else None,
                        "department_code": user.department.code if user.department else None,
                        "class_name": user.class_name.name if user.class_name else None,
                    }
                }
            )

        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )


class UserProfileView(APIView):

    def get(self, request):

        user = request.user

        return Response(
            {
                "id": user.id,
                "email": user.email,
                "name": user.get_full_name() or user.username,
                "role": user.role,
                "department": user.department.name if user.department else None,
                "department_code": user.department.code if user.department else None,
                "class_name": user.class_name.name if user.class_name else None,
            }
        )
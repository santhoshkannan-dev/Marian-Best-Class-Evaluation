from django.shortcuts import render
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
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response(
                {"error": "Google ID token is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Verify the Google OAuth token
            # If settings.GOOGLE_CLIENT_ID is not configured, it will verify the token's validity but not match the audience
            client_id = getattr(settings, 'GOOGLE_CLIENT_ID', None)
            id_info = id_token.verify_oauth2_token(
                token, 
                google_requests.Request(), 
                audience=client_id if client_id else None
            )

            # Get user info from token
            email = id_info.get('email')
            name = id_info.get('name')
            picture = id_info.get('picture')
            google_id = id_info.get('sub')

            if not email:
                return Response(
                    {"error": "Failed to retrieve email from Google Account."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Enforce domain check
            if not email.endswith('@mariancollege.org'):
                return Response(
                    {"error": "Authentication restricted to official Marian Google accounts (@mariancollege.org)."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Check if user is pre-registered in DB
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {"error": f"Email '{email}' is not pre-registered in the Marian Best Class database. Please contact the administrator."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Update Google credentials & basic info if empty
            updated = False
            if not user.google_id:
                user.google_id = google_id
                updated = True
            if not user.first_name and name:
                parts = name.split(' ', 1)
                user.first_name = parts[0]
                if len(parts) > 1:
                    user.last_name = parts[1]
                updated = True
            if updated:
                user.save()

            # Generate JWT tokens
            tokens = get_tokens_for_user(user)

            # Serialize response payload
            return Response({
                "tokens": tokens,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": f"{user.first_name} {user.last_name}".strip() or user.username,
                    "role": user.role,
                    "department": user.department.name if user.department else None,
                    "department_code": user.department.code if user.department else None,
                    "class_name": user.class_name.name if user.class_name else None,
                    "picture": picture,
                }
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response(
                {"error": f"Invalid Google token: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Authentication failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DevBypassLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        if not settings.DEBUG:
            return Response(
                {"error": "Developer bypass is disabled in production settings."},
                status=status.HTTP_403_FORBIDDEN
            )

        email = request.data.get('email')
        if not email:
            return Response(
                {"error": "Email is required for bypass login."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Check domain check even for bypass in development to keep it realistic
            if not email.endswith('@mariancollege.org'):
                return Response(
                    {"error": "Authentication restricted to official Marian Google accounts (@mariancollege.org)."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Fetch the pre-registered user
            user = User.objects.get(email=email)

            # Generate JWT tokens
            tokens = get_tokens_for_user(user)

            # Return response mock profile picture based on role
            role_avatars = {
                "student": "https://api.dicebear.com/7.x/adventurer/svg?seed=student",
                "faculty": "https://api.dicebear.com/7.x/adventurer/svg?seed=faculty",
                "evaluation": "https://api.dicebear.com/7.x/adventurer/svg?seed=evaluator",
                "hod": "https://api.dicebear.com/7.x/adventurer/svg?seed=hod",
                "iqac": "https://api.dicebear.com/7.x/adventurer/svg?seed=iqac",
                "admin": "https://api.dicebear.com/7.x/adventurer/svg?seed=admin"
            }

            return Response({
                "tokens": tokens,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": f"{user.first_name} {user.last_name}".strip() or user.username,
                    "role": user.role,
                    "department": user.department.name if user.department else None,
                    "department_code": user.department.code if user.department else None,
                    "class_name": user.class_name.name if user.class_name else None,
                    "picture": role_avatars.get(user.role, "https://api.dicebear.com/7.x/adventurer/svg?seed=default"),
                }
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response(
                {"error": f"Email '{email}' is not pre-registered in the Marian Best Class database. Please register first or use a seeded email."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Bypass authentication failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserProfileView(APIView):
    # Endpoint to check status of current token and return user profile
    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "email": user.email,
            "name": f"{user.first_name} {user.last_name}".strip() or user.username,
            "role": user.role,
            "department": user.department.name if user.department else None,
            "department_code": user.department.code if user.department else None,
            "class_name": user.class_name.name if user.class_name else None,
        })

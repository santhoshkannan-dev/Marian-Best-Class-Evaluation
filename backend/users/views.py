from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from rest_framework_simplejwt.tokens import RefreshToken

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from .models import User, Class, Department, Submission


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
                if detected_role == 'student':
                    names = full_name.split(" ", 1) if full_name else [email.split("@")[0], ""]
                    user = User.objects.create(
                        username=email,
                        email=email,
                        first_name=names[0],
                        last_name=names[1] if len(names) > 1 else "",
                        role='student',
                        google_id=google_id
                    )
                else:
                    return Response(
                        {"error": "Access denied. Your email is not registered in the system. Please contact your HOD or Administrator."},
                        status=status.HTTP_403_FORBIDDEN
                    )

            # Store google_id and other details on first-time login
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
        except User.DoesNotExist:
            detected_role = determine_role_from_email(email)
            if detected_role == 'student':
                names = [email.split("@")[0], ""]
                user = User.objects.create(
                    username=email,
                    email=email,
                    first_name=names[0],
                    last_name=names[1] if len(names) > 1 else "",
                    role='student'
                )
            else:
                return Response(
                    {"error": "User not found. Only student accounts can be auto-created."},
                    status=status.HTTP_404_NOT_FOUND
                )

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

    def put(self, request):
        user = request.user
        name = request.data.get('name')
        class_name_str = request.data.get('class_name')

        if name:
            parts = name.strip().split(' ', 1)
            user.first_name = parts[0]
            if len(parts) > 1:
                user.last_name = parts[1]
            else:
                user.last_name = ""

        if class_name_str:
            try:
                cls_obj = Class.objects.get(name__iexact=class_name_str)
                user.class_name = cls_obj
                user.department = cls_obj.department
            except Class.DoesNotExist:
                return Response(
                    {"error": f"Class '{class_name_str}' does not exist."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        user.save()

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


class ClassListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        classes = Class.objects.select_related('department').all()
        return Response([
            {
                "name": c.name,
                "department": c.department.name,
                "department_code": c.department.code
            }
            for c in classes
        ])

class SubmissionListView(APIView):
    def get(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        
        if user.role == 'student':
            queryset = Submission.objects.filter(user=user)
        else:
            queryset = Submission.objects.all()
            
        academic_year = request.query_params.get('academicYear')
        if academic_year:
            queryset = queryset.filter(academic_year=academic_year)
            
        data = []
        for s in queryset:
            data.append({
                "id": s.id,
                "studentId": s.user.id,
                "criteriaId": s.criteria_id,
                "academicYear": s.academic_year,
                "description": s.description,
                "status": s.status,
                "remarks": s.remarks,
                "marks": s.marks,
                "proof": s.proof,
                "eventId": s.event_id,
                "evaluatorVerified": s.evaluator_verified,
                "evidence": s.evidence
            })
        return Response(data)

    def post(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
            
        criteria_id = request.data.get('criteriaId')
        academic_year = request.data.get('academicYear')
        description = request.data.get('description', '')
        status_val = request.data.get('status', 'Draft')
        remarks = request.data.get('remarks', '')
        marks = request.data.get('marks')
        proof = request.data.get('proof', '')
        event_id = request.data.get('eventId', '')
        evidence = request.data.get('evidence')
        
        if not criteria_id:
            return Response({"error": "criteriaId is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        submission = Submission.objects.create(
            user=user,
            criteria_id=int(criteria_id),
            academic_year=academic_year,
            description=description,
            status=status_val,
            remarks=remarks,
            marks=marks,
            proof=proof,
            event_id=event_id,
            evidence=evidence
        )
        
        return Response({
            "id": submission.id,
            "studentId": submission.user.id,
            "criteriaId": submission.criteria_id,
            "academicYear": submission.academic_year,
            "description": submission.description,
            "status": submission.status,
            "remarks": submission.remarks,
            "marks": submission.marks,
            "proof": submission.proof,
            "eventId": submission.event_id,
            "evaluatorVerified": submission.evaluator_verified,
            "evidence": submission.evidence
        }, status=status.HTTP_201_CREATED)

class SubmissionDetailView(APIView):
    def put(self, request, pk):
        user = request.user
        if not user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
            
        try:
            if user.role == 'student':
                submission = Submission.objects.get(pk=pk, user=user)
            else:
                submission = Submission.objects.get(pk=pk)
        except Submission.DoesNotExist:
            return Response({"error": "Submission not found"}, status=status.HTTP_404_NOT_FOUND)
            
        if 'criteriaId' in request.data:
            submission.criteria_id = int(request.data.get('criteriaId'))
        if 'academicYear' in request.data:
            submission.academic_year = request.data.get('academicYear')
        if 'description' in request.data:
            submission.description = request.data.get('description')
        if 'status' in request.data:
            submission.status = request.data.get('status')
        if 'remarks' in request.data:
            submission.remarks = request.data.get('remarks')
        if 'marks' in request.data:
            submission.marks = request.data.get('marks')
        if 'proof' in request.data:
            submission.proof = request.data.get('proof')
        if 'eventId' in request.data:
            submission.event_id = request.data.get('eventId')
        if 'evidence' in request.data:
            submission.evidence = request.data.get('evidence')
        if 'evaluatorVerified' in request.data:
            submission.evaluator_verified = bool(request.data.get('evaluatorVerified'))
            
        submission.save()
        
        return Response({
            "id": submission.id,
            "studentId": submission.user.id,
            "criteriaId": submission.criteria_id,
            "academicYear": submission.academic_year,
            "description": submission.description,
            "status": submission.status,
            "remarks": submission.remarks,
            "marks": submission.marks,
            "proof": submission.proof,
            "eventId": submission.event_id,
            "evaluatorVerified": submission.evaluator_verified,
            "evidence": submission.evidence
        })

    def delete(self, request, pk):
        user = request.user
        if not user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
            
        try:
            if user.role == 'student':
                submission = Submission.objects.get(pk=pk, user=user)
            else:
                submission = Submission.objects.get(pk=pk)
        except Submission.DoesNotExist:
            return Response({"error": "Submission not found"}, status=status.HTTP_404_NOT_FOUND)
            
        submission.delete()
        return Response({"success": True}, status=status.HTTP_200_OK)
from datetime import datetime
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from rest_framework_simplejwt.tokens import RefreshToken

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from .models import User, Class, Department, Submission, AcademicYear


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


def parse_name_from_email(email):
    """
    Dynamically derives user name from email local part for any email.
    e.g. amal.thomas.25pmc114@mariancollege.org -> 'Amal Thomas'
    e.g. kochumol.abraham@mariancollege.org -> 'Kochumol Abraham'
    e.g. amal.25pmc114@mariancollege.org -> 'Amal'
    """
    if not email or '@' not in email:
        return "User"
    local_part = email.split('@')[0]
    parts = local_part.split('.')
    name_parts = []
    for part in parts:
        if any(char.isdigit() for char in part):
            break
        name_parts.append(part.capitalize())
    if name_parts:
        return " ".join(name_parts)
    return parts[0].capitalize()


def parse_student_email(email):
    """
    Parses Marian College student email format:
    e.g. amal.25pmc114@mariancollege.org -> II MCA, PG Dept of Computer Applications
    e.g. santhosh.25ubc154@mariancollege.org -> II BCA A, UG Dept of Computer Applications
    """
    if not email or '@' not in email:
        return None

    local_part = email.split('@')[0]
    parts = local_part.split('.')
    if len(parts) < 2:
        return None

    code_part = parts[-1] if any(char.isdigit() for char in parts[-1]) else (parts[1] if len(parts) > 1 else "")
    first_name = parse_name_from_email(email)

    if not (len(code_part) >= 5 and code_part[:2].isdigit()):
        return None

    batch_year = 2000 + int(code_part[:2])
    level_char = code_part[2].lower()
    course_code = code_part[3:5].lower()
    roll_digits = code_part[5:]

    is_pg = (level_char == 'p')
    is_ug = (level_char == 'u')

    course_map = {
        'mc': ('Master of Computer Applications', 'MCA', 'Computer Applications'),
        'bc': ('Bachelor of Computer Applications', 'BCA', 'Computer Applications'),
        'ba': ('Bachelor of Business Administration', 'BBA', 'Business Administration'),
        'cm': ('Commerce', 'BCom', 'Commerce'),
        'sw': ('Social Work', 'MSW', 'Social Work'),
    }

    full_course, course_abbr, field_name = course_map.get(
        course_code, 
        (course_code.upper(), course_code.upper(), course_code.upper())
    )

    if is_pg:
        dept_name = f"The Post-Graduate Department of {field_name}"
        dept_code = "PGDCA" if course_abbr == 'MCA' else f"PG-{course_abbr}"
    else:
        dept_name = f"The Under-Graduate Department of {field_name}"
        dept_code = "UGDCA" if course_abbr == 'BCA' else f"UG-{course_abbr}"

    section = ''
    if is_ug and roll_digits.isdigit():
        roll_num = int(roll_digits)
        series = roll_num // 100
        if series == 1:
            section = 'A'
        elif series == 2:
            section = 'B'
        elif series == 3:
            section = 'C'
        elif series == 4:
            section = 'D'
        else:
            section = 'A'

    current_year = datetime.now().year
    year_diff = current_year - batch_year + 1
    if year_diff <= 1:
        year_roman = 'I'
    elif year_diff == 2:
        year_roman = 'II'
    elif year_diff == 3:
        year_roman = 'III'
    elif year_diff >= 4:
        year_roman = 'IV'
    else:
        year_roman = 'II'

    if section:
        class_name = f"{year_roman} {course_abbr} {section}"
    else:
        class_name = f"{year_roman} {course_abbr}"

    return {
        "first_name": first_name,
        "batch_year": batch_year,
        "level": "Postgraduate" if is_pg else "Undergraduate",
        "course_name": course_abbr,
        "department_name": dept_name,
        "department_code": dept_code,
        "section": section,
        "class_name": class_name
    }


def allocate_student_from_email(user):
    """
    Allocates student user to the derived Department and Class objects based on their email.
    """
    if user.role != 'student' and determine_role_from_email(user.email) != 'student':
        return user

    parsed = parse_student_email(user.email)
    if not parsed:
        return user

    update_fields = ['department', 'class_name']
    if not user.first_name or user.first_name == user.username:
        derived_name = parse_name_from_email(user.email)
        name_parts = derived_name.split(" ", 1)
        user.first_name = name_parts[0]
        if len(name_parts) > 1:
            user.last_name = name_parts[1]
            update_fields.extend(['first_name', 'last_name'])
        else:
            update_fields.append('first_name')

    dept_obj, _ = Department.objects.get_or_create(
        code=parsed["department_code"],
        defaults={"name": parsed["department_name"]}
    )
    if dept_obj.name != parsed["department_name"]:
        dept_obj.name = parsed["department_name"]
        dept_obj.save()

    class_obj, _ = Class.objects.get_or_create(
        name=parsed["class_name"],
        defaults={"department": dept_obj}
    )
    if class_obj.department != dept_obj:
        class_obj.department = dept_obj
        class_obj.save()

    user.department = dept_obj
    user.class_name = class_obj
    user.save(update_fields=list(set(update_fields)))
    return user


def determine_role_from_email(email):
    """
    Determines user role based on Marian College email format:
    - name.number (e.g. santhosh.25pmc152, amal.25pmc114) -> student
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
                        {"error": "Access denied. Your email is not registered in the system. Please contact your Administrator."},
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
            user = allocate_student_from_email(user)

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
                derived_name = parse_name_from_email(email)
                names = derived_name.split(" ", 1)
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

        user = allocate_student_from_email(user)
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

        user = allocate_student_from_email(request.user)

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


class AcademicYearListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        years = AcademicYear.objects.all().order_by('-year')
        return Response([
            {"year": y.year, "status": "Active" if y.is_active else "Inactive"}
            for y in years
        ])

    def post(self, request):
        year_str = request.data.get('year')
        is_active = request.data.get('status') == 'Active' or request.data.get('is_active') == True

        if not year_str:
            return Response({"error": "year is required"}, status=status.HTTP_400_BAD_REQUEST)

        ay, created = AcademicYear.objects.get_or_create(year=year_str)
        if is_active:
            AcademicYear.objects.all().update(is_active=False)
            ay.is_active = True
            ay.save()
        
        return Response({"year": ay.year, "status": "Active" if ay.is_active else "Inactive"})

    def put(self, request):
        year_str = request.data.get('year')
        if not year_str:
            return Response({"error": "year is required"}, status=status.HTTP_400_BAD_REQUEST)

        AcademicYear.objects.all().update(is_active=False)
        try:
            ay = AcademicYear.objects.get(year=year_str)
            ay.is_active = True
            ay.save()
        except AcademicYear.DoesNotExist:
            ay = AcademicYear.objects.create(year=year_str, is_active=True)

        return Response({"year": ay.year, "status": "Active"})

class DepartmentListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        depts = Department.objects.all().order_by('name')
        return Response([
            {"name": d.name, "code": d.code}
            for d in depts
        ])

    def post(self, request):
        name = request.data.get('name')
        code = request.data.get('code')
        if not name or not code:
            return Response({"error": "name and code are required"}, status=status.HTTP_400_BAD_REQUEST)

        dept, created = Department.objects.get_or_create(code=code, defaults={"name": name})
        return Response({"name": dept.name, "code": dept.code})

    def delete(self, request):
        code = request.data.get('code')
        if not code:
            return Response({"error": "code is required"}, status=status.HTTP_400_BAD_REQUEST)
        Department.objects.filter(code=code).delete()
        return Response({"success": True})

class ClassListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        classes = Class.objects.select_related('department', 'class_teacher', 'dqc_member').all()
        return Response([
            {
                "id": c.id,
                "name": c.name,
                "department": c.department.name,
                "department_code": c.department.code,
                "classTeacher": c.class_teacher.email if c.class_teacher else None,
                "classTeacherName": c.class_teacher.get_full_name() or c.class_teacher.username if c.class_teacher else None,
                "dqcMember": c.dqc_member.email if c.dqc_member else None,
                "dqcMemberName": c.dqc_member.get_full_name() or c.dqc_member.username if c.dqc_member else None,
            }
            for c in classes
        ])

    def post(self, request):
        name = request.data.get('name')
        dept_code = request.data.get('department_code')
        if not name or not dept_code:
            return Response({"error": "name and department_code are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            dept = Department.objects.get(code=dept_code)
        except Department.DoesNotExist:
            return Response({"error": f"Department '{dept_code}' not found"}, status=status.HTTP_404_NOT_FOUND)

        cls, created = Class.objects.get_or_create(name=name, defaults={"department": dept})
        return Response({
            "id": cls.id,
            "name": cls.name,
            "department": cls.department.name,
            "department_code": cls.department.code
        })

    def put(self, request):
        name = request.data.get('name')
        teacher_email = request.data.get('classTeacher')
        dqc_email = request.data.get('dqcMember')

        if not name:
            return Response({"error": "Class name is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cls = Class.objects.get(name=name)
        except Class.DoesNotExist:
            return Response({"error": f"Class '{name}' not found"}, status=status.HTTP_404_NOT_FOUND)

        if teacher_email is not None:
            if teacher_email == "":
                cls.class_teacher = None
            else:
                try:
                    cls.class_teacher = User.objects.get(email=teacher_email)
                except User.DoesNotExist:
                    return Response({"error": f"Teacher with email '{teacher_email}' not found"}, status=status.HTTP_404_NOT_FOUND)

        if dqc_email is not None:
            if dqc_email == "":
                cls.dqc_member = None
            else:
                try:
                    cls.dqc_member = User.objects.get(email=dqc_email)
                except User.DoesNotExist:
                    return Response({"error": f"Student with email '{dqc_email}' not found"}, status=status.HTTP_404_NOT_FOUND)

        cls.save()

        return Response({
            "id": cls.id,
            "name": cls.name,
            "department": cls.department.name,
            "department_code": cls.department.code,
            "classTeacher": cls.class_teacher.email if cls.class_teacher else None,
            "classTeacherName": cls.class_teacher.get_full_name() or cls.class_teacher.username if cls.class_teacher else None,
            "dqcMember": cls.dqc_member.email if cls.dqc_member else None,
            "dqcMemberName": cls.dqc_member.get_full_name() or cls.dqc_member.username if cls.dqc_member else None,
        })

class UserManagementView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        users = User.objects.select_related('department', 'class_name').all().order_by('id')
        return Response([
            {
                "id": u.id,
                "name": u.get_full_name() or u.username,
                "email": u.email,
                "role": u.role,
                "department": u.department.name if u.department else None,
                "department_code": u.department.code if u.department else None,
                "className": u.class_name.name if u.class_name else None,
                "isApproved": u.is_active
            }
            for u in users
        ])

    def post(self, request):
        email = request.data.get('email')
        role = request.data.get('role', 'student').lower()
        name = request.data.get('name', '')
        dept_code = request.data.get('department_code')
        class_name_str = request.data.get('class_name')

        if not email:
            return Response({"error": "email is required"}, status=status.HTTP_400_BAD_REQUEST)

        username = email.split('@')[0]
        dept = Department.objects.filter(code=dept_code).first() if dept_code else None
        cls = Class.objects.filter(name=class_name_str).first() if class_name_str else None

        names = name.split(' ', 1)
        first_name = names[0]
        last_name = names[1] if len(names) > 1 else ""

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": username,
                "role": role,
                "department": dept,
                "class_name": cls,
                "first_name": first_name,
                "last_name": last_name,
                "is_active": True
            }
        )
        if not created:
            user.role = role
            user.department = dept
            user.class_name = cls
            user.first_name = first_name
            user.last_name = last_name
            user.save()

        return Response({
            "id": user.id,
            "email": user.email,
            "name": user.get_full_name() or user.username,
            "role": user.role,
            "department": user.department.name if user.department else None,
            "className": user.class_name.name if user.class_name else None,
        })

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
                "evidence": s.evidence,
                "verifiedByName": s.verified_by_name
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
            "evidence": submission.evidence,
            "verifiedByName": submission.verified_by_name
        }, status=status.HTTP_201_CREATED)

class SubmissionDetailView(APIView):
    def put(self, request, pk):
        user = request.user
        if not user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
            
        try:
            if user.role == 'student':
                submission = Submission.objects.get(pk=pk, user=user)
                valid_pending = ['pending', 'pending rep verification', 'submitted', 'draft', 'correction requested']
                if submission.status.lower() not in valid_pending:
                    return Response({"error": "Only pending submissions can be edited"}, status=status.HTTP_400_BAD_REQUEST)
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
            if user.role != 'student':
                submission.verified_by_name = user.get_full_name() or user.username
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
            "evidence": submission.evidence,
            "verifiedByName": submission.verified_by_name
        })

    def delete(self, request, pk):
        user = request.user
        if not user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
            
        try:
            if user.role == 'student':
                submission = Submission.objects.get(pk=pk, user=user)
                valid_pending = ['pending', 'pending rep verification', 'submitted', 'draft', 'correction requested']
                if submission.status.lower() not in valid_pending:
                    return Response({"error": "Only pending submissions can be deleted"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                submission = Submission.objects.get(pk=pk)
        except Submission.DoesNotExist:
            return Response({"error": "Submission not found"}, status=status.HTTP_404_NOT_FOUND)
            
        submission.delete()
        return Response({"success": True}, status=status.HTTP_200_OK)
from rest_framework import serializers
from .models import (
    Department, AcademicYear, Class, User,
    CriteriaCategory, CriteriaItem, Submission,
    AcademicGradeBreakdown, WorkflowAuditTrail, ClassIndexResult
)

class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = '__all__'

class ClassSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Class
        fields = ['id', 'name', 'department', 'department_name', 'created_at']

class DepartmentSerializer(serializers.ModelSerializer):
    classes = ClassSerializer(many=True, read_only=True)

    class Meta:
        model = Department
        fields = ['id', 'name', 'code', 'classes', 'created_at']

class CriteriaItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CriteriaItem
        fields = '__all__'

class CriteriaCategorySerializer(serializers.ModelSerializer):
    items = CriteriaItemSerializer(many=True, read_only=True)

    class Meta:
        model = CriteriaCategory
        fields = ['id', 'code', 'category', 'access_level', 'items', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    class_name_display = serializers.CharField(source='class_name.name', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'department', 'department_name', 'class_name',
            'class_name_display', 'is_student_rep', 'is_staff', 'is_superuser', 'is_active'
        ]

class AcademicGradeBreakdownSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicGradeBreakdown
        fields = ['s_grade_count', 'a_plus_grade_count', 'a_grade_count', 'failed_count', 'class_pass_percentage', 'total_students']

class SubmissionSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    grade_breakdown = AcademicGradeBreakdownSerializer(read_only=True)

    class Meta:
        model = Submission
        fields = [
            'id', 'user', 'user_email', 'user_name', 'criteria_id',
            'academic_year', 'submission_type', 'description', 'status',
            'remarks', 'marks', 'proof', 'event_id', 'evaluator_verified',
            'evidence', 'verified_by_name', 'rep_verified_by_name', 'rep_remarks',
            'teacher_verified_by_name', 'teacher_remarks', 'evaluator_verified_by_name',
            'evaluator_remarks', 'grade_breakdown', 'created_at', 'updated_at'
        ]

class WorkflowAuditTrailSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source='actor.email', read_only=True)

    class Meta:
        model = WorkflowAuditTrail
        fields = ['id', 'submission', 'actor', 'actor_email', 'stage', 'stage_name', 'previous_status', 'new_status', 'comments', 'created_at']

class ClassIndexResultSerializer(serializers.ModelSerializer):
    class_name_display = serializers.CharField(source='class_name.name', read_only=True)
    academic_year_display = serializers.CharField(source='academic_year.year', read_only=True)

    class Meta:
        model = ClassIndexResult
        fields = ['id', 'class_name', 'class_name_display', 'academic_year', 'academic_year_display', 'academic_score', 'co_curricular_score', 'extra_curricular_score', 'final_index', 'rank', 'updated_at']

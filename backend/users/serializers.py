from rest_framework import serializers
from .models import (
    Department, AcademicYear, Class, User, UserProfile,
    CriteriaCategory, CriteriaItem, UserGroup, PreviousChampion
)

class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = '__all__'

class ClassSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Class
        fields = ['id', 'name', 'batch', 'department', 'department_name', 'academic_year', 'created_at']

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
        fields = ['id', 'code', 'category', 'description', 'weightage_percentage', 'display_order', 'is_active', 'items']

class UserSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    class_name_display = serializers.CharField(source='class_name.name', read_only=True)
    batch = serializers.CharField(source='class_name.batch', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'department', 'department_name', 'class_name',
            'class_name_display', 'batch', 'is_staff', 'is_superuser', 'is_active'
        ]

class UserGroupSerializer(serializers.ModelSerializer):
    member_emails = serializers.SlugRelatedField(
        many=True,
        slug_field='email',
        queryset=User.objects.all(),
        source='members'
    )

    class Meta:
        model = UserGroup
        fields = ['id', 'name', 'description', 'members', 'member_emails', 'created_at', 'updated_at']

class PreviousChampionSerializer(serializers.ModelSerializer):
    academic_year_label = serializers.CharField(source='academic_year.year_label', read_only=True)
    class_name_display = serializers.CharField(source='class_name.name', read_only=True)

    class Meta:
        model = PreviousChampion
        fields = ['id', 'academic_year', 'academic_year_label', 'class_name', 'class_name_display', 'rank', 'rank_label', 'score', 'event_name', 'banner_image_url']

from django.db import models
from django.contrib.auth.models import AbstractUser

class AcademicYear(models.Model):
    year = models.CharField(max_length=20, unique=True) # e.g. "2025-2026"
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.year} {'(Active)' if self.is_active else ''}"

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True) # e.g. MCA, CS, IQAC, ADMIN
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.code})"

class Class(models.Model):
    name = models.CharField(max_length=100, unique=True) # e.g. BCA A, BSc CS B, MCA
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='classes')
    class_teacher = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='advisor_classes')
    dqc_member = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='rep_classes')
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Classes"

    def __str__(self):
        return self.name

class User(AbstractUser):
    ROLE_CHOICES = [
        ("student", "Student"),
        ("faculty", "Faculty"),
        ("evaluation", "Evaluation Team"),
        ("iqac", "IQAC"),
        ("admin", "Admin"),
    ]

    google_id = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    class_name = models.ForeignKey(
        Class,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    # Use email as the username field for authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.email} - {self.get_role_display()}"

class Submission(models.Model):
    STATUS_CHOICES = [
        ('Approved', 'Approved'),
        ('Pending', 'Pending'),
        ('Pending Rep Verification', 'Pending Rep Verification'),
        ('Student Rep Verified', 'Student Rep Verified'),
        ('Teacher Verified', 'Teacher Verified'),
        ('Correction Requested', 'Correction Requested'),
        ('Rejected', 'Rejected'),
        ('Draft', 'Draft'),
        ('Submitted', 'Submitted'),
        ('Verified', 'Verified'),
        ('Evaluated', 'Evaluated'),
        ('Locked', 'Locked'),
        ('Correction', 'Correction'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    criteria_id = models.IntegerField()
    academic_year = models.CharField(max_length=50, blank=True, null=True)
    submission_type = models.CharField(max_length=50, blank=True, null=True) # e.g. 'Sem Result', 'SAVE Sem Result'
    description = models.TextField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Draft')
    remarks = models.TextField(blank=True, null=True)
    marks = models.IntegerField(blank=True, null=True)
    proof = models.CharField(max_length=255, blank=True, null=True)
    event_id = models.CharField(max_length=100, blank=True, null=True)
    evaluator_verified = models.BooleanField(default=False)
    evidence = models.JSONField(blank=True, null=True)
    verified_by_name = models.CharField(max_length=255, blank=True, null=True)
    rep_verified_by_name = models.CharField(max_length=255, blank=True, null=True)
    rep_remarks = models.TextField(blank=True, null=True)
    teacher_verified_by_name = models.CharField(max_length=255, blank=True, null=True)
    teacher_remarks = models.TextField(blank=True, null=True)
    evaluator_verified_by_name = models.CharField(max_length=255, blank=True, null=True)
    evaluator_remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Submission {self.id} - {self.user.email} - {self.status}"


class CriteriaCategory(models.Model):
    code = models.CharField(max_length=50, unique=True) # e.g. 'cat-academics'
    category = models.CharField(max_length=100)
    access_level = models.CharField(max_length=20, default='all_students') # 'all_students', 'student_rep_only'
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.category


class CriteriaItem(models.Model):
    category = models.ForeignKey(CriteriaCategory, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=20) # 'count', 'fixed', 'range', 'negative', 'academic_grades'
    marks = models.FloatField(default=0.0)
    rules_json = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.category.category} - {self.title}"


class AcademicGradeBreakdown(models.Model):
    submission = models.OneToOneField(Submission, on_delete=models.CASCADE, related_name='grade_breakdown')
    s_grade_count = models.IntegerField(default=0)
    a_plus_grade_count = models.IntegerField(default=0)
    a_grade_count = models.IntegerField(default=0)
    failed_count = models.IntegerField(default=0)
    class_pass_percentage = models.FloatField(default=0.0)
    total_students = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Grade Breakdown for Submission #{self.submission_id}"


class WorkflowAuditTrail(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name='audit_logs')
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    stage = models.IntegerField() # 1 to 7
    stage_name = models.CharField(max_length=100)
    previous_status = models.CharField(max_length=50)
    new_status = models.CharField(max_length=50)
    comments = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Audit Log #{self.id} - Sub #{self.submission_id} Stage {self.stage}"


class ClassIndexResult(models.Model):
    class_name = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='index_results')
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    academic_score = models.FloatField(default=0.0)
    co_curricular_score = models.FloatField(default=0.0)
    extra_curricular_score = models.FloatField(default=0.0)
    final_index = models.FloatField(default=0.0)
    rank = models.IntegerField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.class_name.name} ({self.academic_year.year}) Index: {self.final_index}"


class SystemSetting(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.key}: {self.value}"


class UserGroupModel(models.Model):
    group_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    members = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.group_id})"

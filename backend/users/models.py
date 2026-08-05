from django.db import models
from django.contrib.auth.models import AbstractUser

class AcademicYear(models.Model):
    year = models.CharField(max_length=20, unique=True) # e.g. "2025-2026"
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.year} {'(Active)' if self.is_active else ''}"

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True) # e.g. MCA, CS, IQAC, ADMIN
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.code})"

class Class(models.Model):
    name = models.CharField(max_length=100, unique=True) # e.g. BCA A, BSc CS B, MCA
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='classes')
    class_teacher = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='advisor_classes')
    dqc_member = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='rep_classes')
    created_at = models.DateTimeField(auto_now_add=True)
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
    description = models.TextField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Draft')
    remarks = models.TextField(blank=True, null=True)
    marks = models.IntegerField(blank=True, null=True)
    proof = models.CharField(max_length=255, blank=True, null=True)
    event_id = models.CharField(max_length=100, blank=True, null=True)
    evaluator_verified = models.BooleanField(default=False)
    evidence = models.JSONField(blank=True, null=True)
    verified_by_name = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Submission {self.id} - {self.user.email} - {self.status}"

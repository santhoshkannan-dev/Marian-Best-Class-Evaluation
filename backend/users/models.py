from django.db import models
from django.contrib.auth.models import AbstractUser

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True) # e.g. MCA, CS, IQAC, ADMIN

    def __str__(self):
        return f"{self.name} ({self.code})"

class Class(models.Model):
    name = models.CharField(max_length=100, unique=True) # e.g. BCA A, BSc CS B, MCA
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='classes')

    class Meta:
        verbose_name_plural = "Classes"

    def __str__(self):
        return self.name

class User(AbstractUser):
    ROLE_CHOICES = [
        ("student", "Student"),
        ("faculty", "Faculty"),
        ("evaluation", "Evaluation Team"),
        ("hod", "HOD"),
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

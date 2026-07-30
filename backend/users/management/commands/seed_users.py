from django.core.management.base import BaseCommand
from users.models import Department, Class, User

class Command(BaseCommand):
    help = 'Seeds departments, classes, and pre-mapped users with roles'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding database...")

        # 1. Seed Departments
        departments_data = [
            {"name": "Master of Computer Applications", "code": "MCA"},
            {"name": "Computer Science", "code": "CS"},
            {"name": "Internal Quality Assurance Cell", "code": "IQAC"},
            {"name": "Administration", "code": "ADMIN"},
        ]

        departments = {}
        for dept in departments_data:
            obj, created = Department.objects.get_or_create(code=dept["code"], defaults={"name": dept["name"]})
            departments[dept["code"]] = obj
            if created:
                self.stdout.write(f"Created Department: {obj.name}")

        # 2. Seed Classes
        classes_data = [
            {"name": "BCA A", "dept_code": "CS"},
            {"name": "BSc CS B", "dept_code": "CS"},
            {"name": "MCA", "dept_code": "MCA"},
        ]

        classes = {}
        for cls in classes_data:
            dept = departments[cls["dept_code"]]
            obj, created = Class.objects.get_or_create(name=cls["name"], defaults={"department": dept})
            classes[cls["name"]] = obj
            if created:
                self.stdout.write(f"Created Class: {obj.name}")

        # 3. Seed Users
        # Format: (email, role, dept_code, class_name, is_staff, is_superuser, first, last)
        users_data = [
            ("santhosh.25pmc152@mariancollege.org", "student", "MCA", "MCA", False, False, "Santhosh", "Kannan"),
            ("amal.25pmc141@mariancollege.org", "student", "MCA", "MCA", False, False, "Amal", "Joseph"),
            ("kochumol.abraham@mariancollege.org", "faculty", "MCA", None, True, False, "Kochumol", "Abraham"),
            ("allen.george@mariancollege.org", "evaluation", "CS", None, True, False, "Allen", "George"),
            ("iqac@mariancollege.org", "iqac", "IQAC", None, True, False, "IQAC", "Coordinator"),
            ("admin@mariancollege.org", "admin", "ADMIN", None, True, True, "System", "Administrator"),
        ]

        for email, role, dept_code, class_name, is_staff, is_superuser, first, last in users_data:
            dept = departments.get(dept_code)
            cls = classes.get(class_name) if class_name else None

            username = email.split('@')[0]

            # Check if user already exists
            user = User.objects.filter(email=email).first()
            if not user:
                user = User.objects.create_user(
                    email=email,
                    username=username,
                    password="MarianPassword@123",
                    role=role,
                    department=dept,
                    class_name=cls,
                    is_staff=is_staff,
                    is_superuser=is_superuser,
                    first_name=first,
                    last_name=last
                )
                self.stdout.write(f"Created pre-registered user: {email} ({role})")
            else:
                user.role = role
                user.department = dept
                user.class_name = cls
                user.is_staff = is_staff
                user.is_superuser = is_superuser
                user.first_name = first
                user.last_name = last
                user.set_password("MarianPassword@123")
                user.save()
                self.stdout.write(f"Updated pre-registered user: {email} ({role})")

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))

from django.core.management.base import BaseCommand
from users.models import Department, Class, User, AcademicYear
from users.views import allocate_student_from_email

class Command(BaseCommand):
    help = 'Seeds departments, classes, academic years, and pre-mapped users'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding database...")

        # 1. Seed Academic Years
        academic_years_data = [
            {"year": "2025-2026", "is_active": True},
            {"year": "2024-2025", "is_active": False},
            {"year": "2023-2024", "is_active": False},
        ]
        for ay in academic_years_data:
            obj, created = AcademicYear.objects.get_or_create(year=ay["year"], defaults={"is_active": ay["is_active"]})
            if created:
                self.stdout.write(f"Created Academic Year: {obj.year}")
            else:
                obj.is_active = ay["is_active"]
                obj.save()

        # 2. Seed Departments
        departments_data = [
            {"name": "The Post-Graduate Department of Computer Applications", "code": "PGDCA"},
            {"name": "The Under-Graduate Department of Computer Applications", "code": "UGDCA"},
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

        # 3. Seed Classes
        classes_data = [
            {"name": "II MCA", "dept_code": "PGDCA"},
            {"name": "II BCA A", "dept_code": "UGDCA"},
            {"name": "BCA A", "dept_code": "CS"},
            {"name": "MCA", "dept_code": "PGDCA"},
        ]

        classes = {}
        for cls in classes_data:
            dept = departments[cls["dept_code"]]
            obj, created = Class.objects.get_or_create(name=cls["name"], defaults={"department": dept})
            classes[cls["name"]] = obj
            if created:
                self.stdout.write(f"Created Class: {obj.name}")

        # 4. Seed Users
        users_data = [
            ("santhosh.25pmc152@mariancollege.org", "student", "PGDCA", "II MCA", False, False, "Santhosh", "Kannan"),
            ("amal.25pmc114@mariancollege.org", "student", "PGDCA", "II MCA", False, False, "Amal", "Thomas"),
            ("santhosh.25ubc154@mariancollege.org", "student", "UGDCA", "II BCA A", False, False, "Santhosh", "Kannan"),
            ("kochumol.abraham@mariancollege.org", "faculty", "PGDCA", None, True, False, "Kochumol", "Abraham"),
            ("allen.george@mariancollege.org", "evaluation", "CS", None, True, False, "Allen", "George"),
            ("iqac@mariancollege.org", "iqac", "IQAC", None, True, False, "IQAC", "Coordinator"),
            ("admin@mariancollege.org", "admin", "ADMIN", None, True, True, "System", "Administrator"),
        ]

        seeded_users = {}
        for email, role, dept_code, class_name, is_staff, is_superuser, first, last in users_data:
            dept = departments.get(dept_code)
            cls = classes.get(class_name) if class_name else None

            username = email.split('@')[0]

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

            user = allocate_student_from_email(user)
            seeded_users[email] = user

        # 5. Set Class Teacher & DQC member for classes
        mca_class = Class.objects.filter(name__in=["II MCA", "MCA"]).first()
        if mca_class:
            mca_class.class_teacher = seeded_users.get("kochumol.abraham@mariancollege.org")
            mca_class.dqc_member = seeded_users.get("santhosh.25pmc152@mariancollege.org")
            mca_class.save()
            self.stdout.write("Configured MCA Class Teacher and DQC member links")

        # 6. Seed Criteria Catalog
        from users.models import CriteriaCategory, CriteriaItem
        criteria_catalog_data = [
            {
                "code": "cat-academics",
                "category": "Academics",
                "access_level": "student_rep_only",
                "items": [
                    {"title": "Sem Result Academic Grades", "type": "academic_grades", "marks": 5.0},
                    {"title": "SAVE Sem Result Academic Grades", "type": "academic_grades", "marks": 5.0},
                ]
            },
            {
                "code": "cat-online-courses",
                "category": "Online Courses",
                "access_level": "all_students",
                "items": [
                    {"title": "NPTEL Course Completed", "type": "count", "marks": 10.0},
                    {"title": "MOOC Course Completed", "type": "count", "marks": 5.0},
                    {"title": "Other Recognized Online Course", "type": "count", "marks": 3.0},
                ]
            },
            {
                "code": "cat-internships",
                "category": "Internships",
                "access_level": "all_students",
                "items": [
                    {"title": "Offline Internship", "type": "count", "marks": 5.0},
                    {"title": "Online Internship", "type": "count", "marks": 3.0},
                ]
            },
            {
                "code": "cat-programs-organized",
                "category": "Programs Organized",
                "access_level": "student_rep_only",
                "items": [
                    {"title": "National Level Program Organized", "type": "count", "marks": 15.0},
                    {"title": "State/Regional Level Program Organized", "type": "count", "marks": 10.0},
                    {"title": "Department Level Program Organized", "type": "count", "marks": 5.0},
                ]
            },
            {
                "code": "cat-documentation",
                "category": "Documentation",
                "access_level": "student_rep_only",
                "items": [
                    {"title": "Class Activity Report & Documents", "type": "fixed", "marks": 10.0},
                ]
            }
        ]

        for cat_data in criteria_catalog_data:
            cat_obj, _ = CriteriaCategory.objects.get_or_create(
                code=cat_data["code"],
                defaults={"category": cat_data["category"], "access_level": cat_data["access_level"]}
            )
            for item_data in cat_data["items"]:
                CriteriaItem.objects.get_or_create(
                    category=cat_obj,
                    title=item_data["title"],
                    defaults={"type": item_data["type"], "marks": item_data["marks"]}
                )

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))

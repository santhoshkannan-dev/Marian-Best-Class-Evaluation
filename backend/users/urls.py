from django.urls import path
from .views import (
    GoogleLoginView,
    DevBypassLoginView,
    UserProfileView,
    ClassListView,
    SubmissionListView,
    SubmissionDetailView,
    AcademicYearListView,
    DepartmentListView,
    UserManagementView,
    SystemSettingView,
    UserGroupListView,
    UserGroupDetailView,
    CriteriaCategoryListView,
    CriteriaCategoryDetailView,
    CriteriaItemListView,
    CriteriaItemDetailView
)

urlpatterns = [
    path('auth/google/', GoogleLoginView.as_view(), name='google-login'),
    path('auth/bypass/', DevBypassLoginView.as_view(), name='dev-bypass-login'),
    path('auth/profile/', UserProfileView.as_view(), name='user-profile'),
    path('auth/classes/', ClassListView.as_view(), name='class-list'),
    path('academic-years/', AcademicYearListView.as_view(), name='academic-years'),
    path('departments/', DepartmentListView.as_view(), name='departments'),
    path('users/', UserManagementView.as_view(), name='user-management'),
    path('submissions/', SubmissionListView.as_view(), name='submission-list'),
    path('submissions/<int:pk>/', SubmissionDetailView.as_view(), name='submission-detail'),
    path('settings/', SystemSettingView.as_view(), name='system-settings'),
    path('user-groups/', UserGroupListView.as_view(), name='user-groups'),
    path('user-groups/<str:pk>/', UserGroupDetailView.as_view(), name='user-group-detail'),
    path('criteria-categories/', CriteriaCategoryListView.as_view(), name='criteria-categories'),
    path('criteria-categories/<int:pk>/', CriteriaCategoryDetailView.as_view(), name='criteria-category-detail'),
    path('criteria-items/', CriteriaItemListView.as_view(), name='criteria-items'),
    path('criteria-items/<int:pk>/', CriteriaItemDetailView.as_view(), name='criteria-item-detail'),
]

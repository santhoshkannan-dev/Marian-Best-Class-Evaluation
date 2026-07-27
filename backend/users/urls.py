from django.urls import path
from .views import GoogleLoginView, DevBypassLoginView, UserProfileView, ClassListView, SubmissionListView, SubmissionDetailView

urlpatterns = [
    path('auth/google/', GoogleLoginView.as_view(), name='google-login'),
    path('auth/bypass/', DevBypassLoginView.as_view(), name='dev-bypass-login'),
    path('auth/profile/', UserProfileView.as_view(), name='user-profile'),
    path('auth/classes/', ClassListView.as_view(), name='class-list'),
    path('submissions/', SubmissionListView.as_view(), name='submission-list'),
    path('submissions/<int:pk>/', SubmissionDetailView.as_view(), name='submission-detail'),
]

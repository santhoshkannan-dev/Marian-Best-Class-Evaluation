from django.urls import path
from .views import GoogleLoginView, DevBypassLoginView, UserProfileView

urlpatterns = [
    path('auth/google/', GoogleLoginView.as_view(), name='google-login'),
    path('auth/bypass/', DevBypassLoginView.as_view(), name='dev-bypass-login'),
    path('auth/profile/', UserProfileView.as_view(), name='user-profile'),
]

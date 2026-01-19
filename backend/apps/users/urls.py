"""
urls.py - Authentication URL Routes

This file defines URL patterns for authentication-related endpoints.
These are the public endpoints that don't require authentication
(except change-password which requires login).

URL patterns map URLs to views:
    path('endpoint/', ViewClass.as_view(), name='route-name')

    - 'endpoint/': The URL path (relative to where this is included)
    - ViewClass.as_view(): Converts class-based view to a callable
    - name='route-name': Named URL for reverse lookups

These URLs are included in the main urls.py under 'api/auth/' prefix:
    path('api/auth/', include('apps.users.urls'))

Final URLs become:
    - POST /api/auth/register/ -> RegisterView
    - POST /api/auth/login/ -> LoginView
    - etc.
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    AdminLoginView,
    ChangePasswordView,
    ForgotPasswordView,
    ResetPasswordView
)

urlpatterns = [
    # ============================================================
    # REGISTRATION & LOGIN
    # ============================================================

    # POST /api/auth/register/
    # Create a new user account
    # Request: { email, password, password_confirm, name, age?, gender?, ... }
    # Response: { user: {...}, tokens: { access, refresh } }
    path('register/', RegisterView.as_view(), name='register'),

    # POST /api/auth/login/
    # Authenticate user and get tokens
    # Request: { email, password }
    # Response: { user: {...}, tokens: { access, refresh } }
    path('login/', LoginView.as_view(), name='login'),

    # POST /api/auth/admin-login/
    # Authenticate admin user only
    # Request: { email, password }
    # Response: { user: {...}, tokens: { access, refresh } }
    # Note: Returns error if user is not an admin
    path('admin-login/', AdminLoginView.as_view(), name='admin-login'),

    # ============================================================
    # TOKEN MANAGEMENT
    # ============================================================

    # POST /api/auth/refresh/
    # Get a new access token using refresh token
    # Request: { refresh: "refresh_token_here" }
    # Response: { access: "new_access_token" }
    # Note: This is a built-in SimpleJWT view
    path('refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # ============================================================
    # PASSWORD MANAGEMENT
    # ============================================================

    # POST /api/auth/change-password/
    # Change password for logged-in user (requires authentication)
    # Request: { old_password, new_password, new_password_confirm }
    # Response: { message: "Password changed successfully" }
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),

    # POST /api/auth/forgot-password/
    # Request password reset email
    # Request: { email }
    # Response: { message: "If an account..." } (same message for security)
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),

    # POST /api/auth/reset-password/{uidb64}/{token}/
    # Reset password using token from email
    # URL params: uidb64 (base64 user id), token (reset token)
    # Request: { new_password, new_password_confirm }
    # Response: { message: "Password reset successfully" }
    path(
        'reset-password/<uidb64>/<token>/',
        ResetPasswordView.as_view(),
        name='reset-password'
    ),
]

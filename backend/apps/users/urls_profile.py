"""
urls_profile.py - User Profile URL Routes

This file defines URL patterns for user profile operations.
All endpoints require authentication (user must be logged in).

These URLs are included in the main urls.py under 'api/profile/' prefix:
    path('api/profile/', include('apps.users.urls_profile'))

Final URLs become:
    - GET/PUT/PATCH /api/profile/ -> ProfileView

The ProfileView allows users to:
- GET: View their own profile information
- PUT: Update all profile fields (full update)
- PATCH: Update specific profile fields (partial update)

Note: Users can only access their own profile through this endpoint.
Admins use different endpoints (/api/admin/users/) to manage all users.
"""

from django.urls import path
from .views import ProfileView

urlpatterns = [
    # GET/PUT/PATCH /api/profile/
    # Manage current user's profile
    #
    # GET Response:
    # {
    #     id, email, name, age, gender,
    #     fitness_goal, experience_level, role,
    #     is_active, created_at, last_login
    # }
    #
    # PUT/PATCH Request (editable fields only):
    # { name?, age?, gender?, fitness_goal?, experience_level? }
    #
    # Note: email, role, id, created_at, last_login are read-only
    path('', ProfileView.as_view(), name='profile'),
]

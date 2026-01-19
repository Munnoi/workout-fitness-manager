"""
urls_admin.py - Admin User Management URL Routes

This file defines URL patterns for admin-only user management operations.
All endpoints require:
1. Authentication (valid JWT token)
2. Admin role (user.role == 'admin')

These URLs are included in the main urls.py under 'api/admin/users/' prefix:
    path('api/admin/users/', include('apps.users.urls_admin'))

Final URLs become:
    - GET /api/admin/users/ -> UserListView (list all customers)
    - GET /api/admin/users/stats/ -> UserStatsView (dashboard statistics)
    - GET/PUT/PATCH/DELETE /api/admin/users/{uuid}/ -> UserDetailView
    - PATCH /api/admin/users/{uuid}/block/ -> UserBlockView

Note: <uuid:pk> is a URL converter that:
- Matches UUID format (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
- Passes the value as 'pk' (primary key) to the view
"""

from django.urls import path
from .views import UserListView, UserDetailView, UserBlockView, UserStatsView

urlpatterns = [
    # ============================================================
    # USER LIST & STATISTICS
    # ============================================================

    # GET /api/admin/users/
    # List all customers with filtering and search
    #
    # Query parameters:
    # - ?is_active=true/false - Filter by active status
    # - ?gender=male/female - Filter by gender
    # - ?fitness_goal=weight_loss/muscle_gain/general_fitness
    # - ?experience_level=beginner/intermediate/advanced
    # - ?search=query - Search in name and email
    #
    # Response: Paginated list of user objects
    path('', UserListView.as_view(), name='user-list'),

    # GET /api/admin/users/stats/
    # Get aggregate statistics for admin dashboard
    #
    # Response:
    # {
    #     total_users: number,
    #     active_users: number,
    #     new_users_today: number,
    #     new_users_this_week: number
    # }
    path('stats/', UserStatsView.as_view(), name='user-stats'),

    # ============================================================
    # SINGLE USER OPERATIONS
    # ============================================================

    # GET/PUT/PATCH/DELETE /api/admin/users/{uuid}/
    # Manage a specific user by their UUID
    #
    # GET: Retrieve user details
    # PUT: Full update (all editable fields required)
    # PATCH: Partial update (only changed fields)
    # DELETE: Remove user from system
    #
    # Editable fields: email, name, age, gender, fitness_goal,
    #                  experience_level, role, is_active
    path('<uuid:pk>/', UserDetailView.as_view(), name='user-detail'),

    # PATCH /api/admin/users/{uuid}/block/
    # Toggle user's is_active status (block/unblock)
    #
    # No request body needed - toggles current status
    # Response: { message: "User blocked/unblocked successfully" }
    #
    # When blocked (is_active=False):
    # - User cannot login
    # - Existing tokens still work until they expire
    path('<uuid:pk>/block/', UserBlockView.as_view(), name='user-block'),
]

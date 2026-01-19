"""
permissions.py - Custom Permission Classes

This file defines custom permission classes for Django REST Framework (DRF).
Permissions control WHO can access specific API endpoints.

How Permissions Work:
1. Views specify permission_classes = [Permission1, Permission2]
2. For each request, DRF calls has_permission() on each permission class
3. ALL permission classes must return True for access to be granted
4. If any returns False, the request is denied (403 Forbidden)

Built-in Permissions (from rest_framework.permissions):
- AllowAny: No restrictions, anyone can access
- IsAuthenticated: User must be logged in (valid JWT token)
- IsAdminUser: User must have is_staff=True

Custom Permissions (defined here):
- IsAdmin: User must have role='admin'
- IsCustomer: User must have role='customer'

Usage in views:
    class MyView(APIView):
        permission_classes = [IsAuthenticated, IsAdmin]
        # Both must pass: user must be logged in AND be an admin
"""

from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """
    Custom permission that only allows admin users.

    Checks:
    1. request.user exists (user object is attached to request)
    2. request.user.is_authenticated (user is logged in, not anonymous)
    3. request.user.is_admin (user has admin role - see User.is_admin property)

    Used for: Admin-only endpoints like user management, statistics, etc.

    Example:
        class UserListView(APIView):
            permission_classes = [IsAuthenticated, IsAdmin]
    """

    def has_permission(self, request, view):
        """
        Check if the request should be permitted.

        Args:
            request: The incoming DRF Request object
                - request.user: The authenticated user (or AnonymousUser)
            view: The view being accessed (not used here)

        Returns:
            bool: True if permission granted, False otherwise
        """
        # All three conditions must be True:
        # 1. User object exists on request
        # 2. User is authenticated (not AnonymousUser)
        # 3. User has admin role (is_admin property from User model)
        return (
            request.user and
            request.user.is_authenticated and
            request.user.is_admin
        )


class IsCustomer(BasePermission):
    """
    Custom permission that only allows customer users.

    Checks:
    1. request.user exists
    2. request.user.is_authenticated
    3. request.user.role == 'customer'

    Used for: Customer-only endpoints (if any exist).

    Note: Most customer endpoints use IsAuthenticated instead,
    which allows both customers and admins. This permission
    explicitly restricts to customers only.

    Example:
        class CustomerOnlyView(APIView):
            permission_classes = [IsAuthenticated, IsCustomer]
    """

    def has_permission(self, request, view):
        """
        Check if the request should be permitted.

        Args:
            request: The incoming DRF Request object
            view: The view being accessed

        Returns:
            bool: True if permission granted, False otherwise
        """
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role == 'customer'
        )

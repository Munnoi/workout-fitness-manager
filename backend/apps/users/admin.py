"""
admin.py - Django Admin Configuration

This file customizes how the User model appears in Django's admin interface.
The admin interface is available at /admin/ and provides a GUI for managing
database records without writing code.

Key Concepts:
- @admin.register(Model): Decorator to register a model with the admin site
- ModelAdmin: Class that defines how a model is displayed and edited
- BaseUserAdmin: Built-in admin class for User models with password handling

Django Admin Features Used:
- list_display: Fields shown in the list view
- list_filter: Sidebar filters for quick filtering
- search_fields: Fields searchable via the search bar
- fieldsets: Organize fields into sections in the detail view
- add_fieldsets: Fields shown when creating a new user

Access:
- URL: /admin/
- Requires: is_staff=True and is_superuser=True (or specific permissions)
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom admin configuration for the User model.

    Inherits from BaseUserAdmin which provides:
    - Secure password change form (never shows actual password)
    - Password confirmation on creation
    - Proper handling of hashed passwords

    Why inherit from BaseUserAdmin?
    - Standard ModelAdmin would show the password hash as editable text
    - BaseUserAdmin uses special widgets for password fields
    - Provides built-in password change functionality
    """

    # ============================================================
    # LIST VIEW CONFIGURATION
    # How users appear in the list/table view
    # ============================================================

    # Columns displayed in the user list
    # Each item is a field name from the User model
    list_display = ['email', 'name', 'role', 'is_active', 'created_at']

    # Sidebar filters for quick filtering
    # Clicking a filter value shows only matching records
    list_filter = ['role', 'is_active', 'gender', 'fitness_goal']

    # Fields searchable via the search box
    # Search is case-insensitive and uses LIKE queries
    search_fields = ['email', 'name']

    # Default ordering in the list view
    # '-' prefix means descending (newest first)
    ordering = ['-created_at']

    # ============================================================
    # DETAIL VIEW CONFIGURATION
    # How the edit form is organized when viewing/editing a user
    # ============================================================

    # fieldsets defines sections in the edit form
    # Format: (Section Title, {'fields': (field1, field2, ...)})
    # None as title means no visible header for that section
    fieldsets = (
        # Login credentials section (no header)
        (None, {
            'fields': ('email', 'password')
            # Note: password field uses a special widget that shows
            # a link to change password, not the actual hash
        }),

        # Personal information section
        ('Personal Info', {
            'fields': ('name', 'age', 'gender')
        }),

        # Fitness profile section
        ('Fitness Profile', {
            'fields': ('fitness_goal', 'experience_level')
        }),

        # Access control section
        ('Permissions', {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser')
            # is_active: Can the user login?
            # is_staff: Can access admin site?
            # is_superuser: Has all permissions?
        }),
    )

    # ============================================================
    # ADD USER FORM CONFIGURATION
    # Special configuration for the "Add User" form
    # ============================================================

    # add_fieldsets is used only when creating a new user
    # This is separate from fieldsets because:
    # 1. We need password1 and password2 (confirmation) instead of password
    # 2. We typically want fewer fields when creating a user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),  # CSS class for wider form layout
            'fields': ('email', 'name', 'password1', 'password2', 'role'),
            # password1: The password
            # password2: Password confirmation
            # These are handled specially by BaseUserAdmin to hash the password
        }),
    )

    # Note: We don't define add_form or change_form because
    # BaseUserAdmin already provides secure forms for password handling

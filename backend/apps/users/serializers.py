"""
serializers.py - Data Serialization and Validation

Serializers in Django REST Framework (DRF) serve two main purposes:
1. Serialization: Convert complex data (like Django models) to JSON for API responses
2. Deserialization: Convert incoming JSON data to Python objects and validate it

Think of serializers as the bridge between your database models and the API.

Key Concepts:
- ModelSerializer: Automatically creates fields based on a model
- Serializer: Manual field definitions (used for non-model data like login)
- write_only: Fields only accepted in input, not shown in output (e.g., passwords)
- read_only: Fields only shown in output, cannot be set via API
- validators: Functions that validate field values

Flow:
1. API receives JSON data
2. Serializer validates the data (is_valid())
3. If valid, data is processed (create/update)
4. Response is serialized back to JSON
"""

from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration (sign up).

    Handles:
    - Validating registration data (email, password, profile info)
    - Ensuring passwords match
    - Creating a new user with hashed password

    ModelSerializer automatically creates fields from the User model,
    but we override password fields for custom handling.
    """

    # Explicit password fields with write_only=True (never returned in response)
    # validators=[validate_password] uses Django's built-in password strength checks:
    # - Minimum length (8 characters by default)
    # - Not too similar to user attributes
    # - Not a common password
    # - Not entirely numeric
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # Fields that will be accepted in the request body
        fields = [
            'email', 'password', 'password_confirm', 'name',
            'age', 'gender', 'fitness_goal', 'experience_level'
        ]

    def validate(self, attrs):
        """
        Object-level validation (runs after field-level validation).

        This method receives all validated field data and can perform
        cross-field validation (like comparing two fields).

        Args:
            attrs (dict): Dictionary of validated field values

        Returns:
            dict: The validated data (possibly modified)

        Raises:
            serializers.ValidationError: If validation fails
        """
        # Ensure both password fields match
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Passwords do not match'
            })
        return attrs

    def create(self, validated_data):
        """
        Create and return a new user instance.

        This method is called when serializer.save() is invoked after
        successful validation. We use User.objects.create_user() to
        properly hash the password.

        Args:
            validated_data (dict): Validated data from the serializer

        Returns:
            User: The newly created user instance
        """
        # Remove password_confirm as it's not a User model field
        validated_data.pop('password_confirm')

        # create_user() hashes the password (see models.py)
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login authentication.

    Note: This is NOT a ModelSerializer because we're not creating/updating
    a model. We're just validating login credentials.

    The authenticate() function checks the credentials and returns
    the user if valid, or None if invalid.
    """

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        """
        Validate login credentials using Django's authentication system.

        authenticate() uses the authentication backends defined in settings.py
        to verify the credentials. For our setup, it checks:
        1. User exists with this email
        2. Password matches the stored hash

        Args:
            attrs (dict): Contains 'email' and 'password'

        Returns:
            dict: Original attrs plus 'user' key with the authenticated user

        Raises:
            serializers.ValidationError: If credentials are invalid or user is blocked
        """
        email = attrs.get('email')
        password = attrs.get('password')

        # authenticate() returns User object if valid, None if invalid
        # Note: username=email because we set USERNAME_FIELD = 'email' in User model
        user = authenticate(username=email, password=password)

        if not user:
            raise serializers.ValidationError('Invalid email or password')

        if not user.is_active:
            raise serializers.ValidationError('User account is disabled')

        # Add user to validated data so the view can access it
        attrs['user'] = user
        return attrs


class AdminLoginSerializer(LoginSerializer):
    """
    Serializer for admin-only login.

    Inherits from LoginSerializer and adds an additional check
    to ensure the user has admin role.

    This demonstrates Python class inheritance - we reuse the
    parent class logic and extend it.
    """

    def validate(self, attrs):
        """
        Validate admin login credentials.

        First calls parent's validate() to check basic credentials,
        then verifies the user has admin role.
        """
        # super().validate() calls LoginSerializer.validate()
        # This performs the standard authentication check
        attrs = super().validate(attrs)

        user = attrs['user']

        # Additional check: user must be an admin
        if user.role != User.Role.ADMIN:
            raise serializers.ValidationError('Admin access required')

        return attrs


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for displaying user data (read-heavy operations).

    Used when:
    - Returning user data in API responses
    - Updating user profile (limited fields)

    read_only_fields prevents certain fields from being modified
    through this serializer (e.g., users can't change their own email or role).
    """

    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'age', 'gender',
            'fitness_goal', 'experience_level', 'role',
            'is_active', 'created_at', 'last_login'
        ]
        # These fields will be included in responses but cannot be set via API
        read_only_fields = ['id', 'email', 'role', 'created_at', 'last_login']


class UserAdminSerializer(serializers.ModelSerializer):
    """
    Serializer for admin operations on users.

    Similar to UserSerializer but with fewer read_only restrictions,
    allowing admins to modify more fields (like role and is_active).

    Used by admin views for user management (list, update, delete users).
    """

    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'age', 'gender',
            'fitness_goal', 'experience_level', 'role',
            'is_active', 'created_at', 'last_login'
        ]
        # Admins can modify more fields, but these remain read-only
        read_only_fields = ['id', 'created_at', 'last_login']


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for changing password (for authenticated users).

    Users must provide their current password to change it.
    This prevents unauthorized password changes if someone
    has access to an active session.

    Note: All password fields are write_only for security.
    """

    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(write_only=True)

    def validate_old_password(self, value):
        """
        Field-level validation for old_password.

        Field-level validators are named: validate_<field_name>
        They run before object-level validate() method.

        We access the user via self.context['request'].user
        (context is passed from the view).

        Args:
            value (str): The old password value

        Returns:
            str: The validated value

        Raises:
            serializers.ValidationError: If current password is wrong
        """
        user = self.context['request'].user

        # check_password() compares the provided password against the hash
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect')

        return value

    def validate(self, attrs):
        """
        Object-level validation to ensure new passwords match.
        """
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'Passwords do not match'
            })
        return attrs


class ForgotPasswordSerializer(serializers.Serializer):
    """
    Serializer for forgot password request.

    Only requires an email address. The view handles:
    1. Looking up the user (if exists)
    2. Generating a password reset token
    3. Sending the reset email

    Note: For security, we don't reveal if the email exists or not.
    """

    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    """
    Serializer for resetting password via reset link.

    Used when user clicks the reset link from email.
    The token validation is handled in the view, not here.

    This serializer only validates the new password format.
    """

    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(write_only=True)

    def validate(self, attrs):
        """
        Ensure new passwords match.
        """
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'Passwords do not match'
            })
        return attrs

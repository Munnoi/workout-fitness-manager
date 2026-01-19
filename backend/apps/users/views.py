"""
views.py - API Views (Controllers)

Views in Django REST Framework handle HTTP requests and return responses.
They are the "controllers" in MVC architecture.

Types of Views used here:
1. APIView: Base class for custom views with manual request handling
2. generics.*: Pre-built views with common patterns (list, create, update, etc.)

Request Flow:
HTTP Request -> URL Router -> View -> Serializer -> Model -> Database
                                  <-          <-       <-
HTTP Response <- View <- Serializer <- Model <- Database

Key Concepts:
- permission_classes: Who can access this view (authentication/authorization)
- serializer_class: Which serializer to use for data validation
- queryset: What data this view operates on
- JWT (JSON Web Tokens): Stateless authentication tokens
"""

from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings

from .models import User
from .serializers import (
    UserRegistrationSerializer,
    LoginSerializer,
    AdminLoginSerializer,
    UserSerializer,
    UserAdminSerializer,
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
)
from .permissions import IsAdmin


# ============================================================
# AUTHENTICATION VIEWS
# These handle user registration, login, and password management
# ============================================================

class RegisterView(APIView):
    """
    Handle user registration (POST /api/auth/register/).

    AllowAny: Anyone can access this view (no authentication required).

    Flow:
    1. Receive registration data (email, password, name, etc.)
    2. Validate data using UserRegistrationSerializer
    3. Create new user with hashed password
    4. Generate JWT tokens for immediate login
    5. Return user data and tokens
    """

    # AllowAny means no authentication is required
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Handle POST request for user registration.

        Args:
            request: DRF Request object containing registration data

        Returns:
            Response: User data with JWT tokens (201) or validation errors (400)
        """
        # Create serializer with request data
        serializer = UserRegistrationSerializer(data=request.data)

        # is_valid() runs all validation (field-level and object-level)
        if serializer.is_valid():
            # save() calls serializer.create() which creates the user
            user = serializer.save()

            # Generate JWT tokens for the new user
            # RefreshToken contains both refresh and access tokens
            refresh = RefreshToken.for_user(user)

            return Response({
                # Serialize user data for response (excludes password)
                'user': UserSerializer(user).data,
                'tokens': {
                    # Refresh token: Long-lived, used to get new access tokens
                    'refresh': str(refresh),
                    # Access token: Short-lived, used for API authentication
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)

        # Return validation errors (e.g., email already exists, password too weak)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    Handle user login (POST /api/auth/login/).

    Flow:
    1. Receive email and password
    2. Validate credentials using LoginSerializer
    3. If valid, generate JWT tokens
    4. Return user data and tokens
    """

    permission_classes = [AllowAny]

    def post(self, request):
        """
        Handle POST request for user login.

        Args:
            request: DRF Request object with email and password

        Returns:
            Response: User data with JWT tokens (200) or error (400)
        """
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            # LoginSerializer adds 'user' to validated_data after authentication
            user = serializer.validated_data['user']

            # Generate new JWT tokens
            refresh = RefreshToken.for_user(user)

            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminLoginView(APIView):
    """
    Handle admin-only login (POST /api/auth/admin-login/).

    Similar to LoginView but adds an additional check for admin role.
    Regular users cannot login through this endpoint.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        """
        Handle POST request for admin login.

        Uses AdminLoginSerializer which inherits from LoginSerializer
        and adds admin role validation.
        """
        serializer = AdminLoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)

            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """
    Handle password change for authenticated users
    (POST /api/auth/change-password/).

    Requires:
    - User must be logged in (IsAuthenticated)
    - User must provide current password (security measure)
    """

    # IsAuthenticated: User must be logged in with valid JWT token
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Handle POST request for password change.

        The serializer needs request context to access the current user
        for password verification.
        """
        # context={'request': request} passes the request to serializer
        # This allows serializer to access request.user
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            # set_password() hashes the new password
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()

            return Response({'message': 'Password changed successfully'})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(APIView):
    """
    Handle forgot password request (POST /api/auth/forgot-password/).

    Flow:
    1. User submits email address
    2. System generates a password reset token
    3. Email is sent with reset link
    4. User clicks link and is taken to reset password page

    Security notes:
    - We don't reveal if email exists (prevents email enumeration attacks)
    - Token is cryptographically secure and time-limited
    - Token is one-time use (invalidated after use or new token generated)
    """

    permission_classes = [AllowAny]

    def post(self, request):
        """
        Handle POST request for forgot password.

        Uses Django's built-in token generator which creates
        cryptographically secure tokens based on user's password hash
        and last login time.
        """
        serializer = ForgotPasswordSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                # SECURITY: Don't reveal that user doesn't exist
                # Return same message as success to prevent enumeration
                return Response({
                    'message': 'If an account with this email exists, '
                               'a password reset link has been sent.'
                })

            # Generate password reset token
            # default_token_generator creates a hash based on:
            # - User's primary key
            # - User's password hash (token invalidated when password changes)
            # - Last login timestamp (token invalidated on login)
            # - Current timestamp (token expires after a period)
            token = default_token_generator.make_token(user)

            # Encode user ID in URL-safe base64
            # This is used to identify the user in the reset link
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            # Construct the reset link pointing to frontend
            # Format: https://frontend.com/reset-password/{uid}/{token}
            reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"

            # Send email with reset link
            send_mail(
                subject='Password Reset Request',
                message=f'Click the link to reset your password: {reset_link}',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=False,  # Raise exception if email fails
            )

            return Response({
                'message': 'If an account with this email exists, '
                           'a password reset link has been sent.'
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    """
    Handle password reset via token (POST /api/auth/reset-password/{uid}/{token}/).

    This is the endpoint called when user clicks the reset link from email.

    URL parameters:
    - uidb64: Base64 encoded user ID
    - token: Password reset token

    Flow:
    1. Decode user ID from URL
    2. Validate token against user
    3. If valid, update user's password
    """

    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        """
        Handle POST request for password reset.

        Args:
            request: DRF Request object with new password
            uidb64: Base64 encoded user primary key
            token: Password reset token
        """
        serializer = ResetPasswordSerializer(data=request.data)

        if serializer.is_valid():
            try:
                # Decode the user ID from base64
                uid = force_str(urlsafe_base64_decode(uidb64))
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                user = None

            # Validate the token
            # check_token() verifies:
            # - Token was generated for this user
            # - Token hasn't expired
            # - Password hasn't been changed since token was generated
            if user is not None and default_token_generator.check_token(user, token):
                # Token is valid, update password
                user.set_password(serializer.validated_data['new_password'])
                user.save()
                return Response({'message': 'Password reset successfully'})

            return Response(
                {'error': 'Invalid token or user'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================================
# USER PROFILE VIEWS
# For authenticated users to view/update their own profile
# ============================================================

class ProfileView(generics.RetrieveUpdateDestroyAPIView):
    """
    Handle user profile operations (GET/PUT/PATCH/DELETE /api/profile/).

    RetrieveUpdateDestroyAPIView provides:
    - GET: Retrieve the user's profile
    - PUT: Full update of profile (all fields required)
    - PATCH: Partial update (only changed fields required)
    - DELETE: Delete the user's account

    Note: This view operates on the currently authenticated user,
    not a URL-specified user ID.
    """

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """
        Override get_object to return the current user.

        Normally, RetrieveUpdateAPIView expects a URL parameter (like pk)
        to identify the object. We override this to always return
        the authenticated user (request.user).
        """
        return self.request.user


# ============================================================
# ADMIN USER MANAGEMENT VIEWS
# For admins to manage all users in the system
# ============================================================

class UserListView(generics.ListAPIView):
    """
    List all customers for admin (GET /api/admin/users/).

    ListAPIView provides:
    - GET: List all objects with pagination
    - Filtering and search capabilities

    Features:
    - Only shows customers (not admins)
    - Supports filtering by is_active, gender, fitness_goal, experience_level
    - Supports search by name and email
    """

    # Only get customers, not admins
    queryset = User.objects.filter(role=User.Role.CUSTOMER)
    serializer_class = UserAdminSerializer

    # Require both authentication AND admin role
    permission_classes = [IsAuthenticated, IsAdmin]

    # Enable filtering and searching
    # DjangoFilterBackend: Exact match filtering (?is_active=true)
    # SearchFilter: Text search (?search=john)
    filter_backends = [DjangoFilterBackend, SearchFilter]

    # Fields available for exact-match filtering
    # Example: /api/admin/users/?is_active=true&gender=male
    filterset_fields = ['is_active', 'gender', 'fitness_goal', 'experience_level']

    # Fields available for text search
    # Example: /api/admin/users/?search=john
    search_fields = ['name', 'email']


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Handle single user operations for admin
    (GET/PUT/PATCH/DELETE /api/admin/users/{id}/).

    RetrieveUpdateDestroyAPIView provides:
    - GET: Retrieve a specific user
    - PUT: Full update of user
    - PATCH: Partial update
    - DELETE: Delete user

    The user is identified by the {id} URL parameter (UUID).
    """

    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class UserBlockView(APIView):
    """
    Toggle user active status (PATCH /api/admin/users/{id}/block/).

    This is a custom endpoint for blocking/unblocking users.
    When a user is blocked (is_active=False), they cannot login.
    """

    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, pk):
        """
        Toggle the is_active status of a user.

        Args:
            request: DRF Request object
            pk: User primary key (UUID) from URL

        Returns:
            Response: Success message or 404 error
        """
        try:
            user = User.objects.get(pk=pk)

            # Toggle the is_active status
            user.is_active = not user.is_active
            user.save()

            # Determine the action for the response message
            action = 'unblocked' if user.is_active else 'blocked'
            return Response({'message': f'User {action} successfully'})

        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class UserStatsView(APIView):
    """
    Get user statistics for admin dashboard (GET /api/admin/users/stats/).

    Returns aggregate statistics about users:
    - Total number of customers
    - Number of active customers
    - New customers today
    - New customers this week
    """

    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        """
        Return user statistics as JSON.

        Uses Django ORM aggregation to efficiently count users
        without loading all user objects into memory.
        """
        from django.utils import timezone
        from datetime import timedelta

        # Count total customers (excluding admins)
        total_users = User.objects.filter(role=User.Role.CUSTOMER).count()

        # Count active customers (is_active=True)
        active_users = User.objects.filter(
            role=User.Role.CUSTOMER,
            is_active=True
        ).count()

        # Get today's date (timezone-aware)
        today = timezone.now().date()

        # Count users created today
        # __date extracts the date part from DateTimeField
        new_users_today = User.objects.filter(
            role=User.Role.CUSTOMER,
            created_at__date=today
        ).count()

        # Count users created in the last 7 days
        # __gte = greater than or equal
        new_users_this_week = User.objects.filter(
            role=User.Role.CUSTOMER,
            created_at__date__gte=today - timedelta(days=7)
        ).count()

        return Response({
            'total_users': total_users,
            'active_users': active_users,
            'new_users_today': new_users_today,
            'new_users_this_week': new_users_this_week,
        })

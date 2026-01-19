"""
models.py - User Model Definition

This file defines the custom User model for the gym management system.
Instead of using Django's default User model, we create a custom one that:
- Uses email as the primary identifier (instead of username)
- Includes gym-specific fields like fitness_goal, experience_level
- Supports role-based access (customer vs admin)

Key Components:
1. UserManager - Custom manager for creating users and superusers
2. User - The main user model with all fields and methods
"""

import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    """
    Custom user manager that handles user creation.

    BaseUserManager provides helper methods for creating users.
    We override create_user and create_superuser to use email
    instead of username as the unique identifier.
    """

    def create_user(self, email, password=None, **extra_fields):
        """
        Create and save a regular user with the given email and password.

        Args:
            email (str): User's email address (required, used as username)
            password (str): User's password (will be hashed before storing)
            **extra_fields: Additional fields like name, age, gender, etc.

        Returns:
            User: The created user instance

        Raises:
            ValueError: If email is not provided
        """
        if not email:
            raise ValueError('Users must have an email address')

        # normalize_email() lowercases the domain part of email
        # e.g., User@Example.COM -> User@example.com
        email = self.normalize_email(email)

        # self.model refers to the User model (set automatically by Django)
        user = self.model(email=email, **extra_fields)

        # set_password() hashes the password using Django's password hasher
        # Never store plain text passwords!
        user.set_password(password)

        # using=self._db ensures we use the correct database
        # (important for multi-database setups)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and save a superuser with the given email and password.

        Superusers have full access to Django admin and all permissions.
        This method is called when running: python manage.py createsuperuser

        Args:
            email (str): Superuser's email address
            password (str): Superuser's password
            **extra_fields: Additional fields

        Returns:
            User: The created superuser instance
        """
        # setdefault() sets the value only if the key doesn't exist
        extra_fields.setdefault('is_staff', True)      # Can access Django admin
        extra_fields.setdefault('is_superuser', True)  # Has all permissions
        extra_fields.setdefault('role', 'admin')       # Set role to admin

        # Validate that required fields are properly set
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True')

        # Use create_user to create the superuser (reuses validation logic)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model for the gym management system.

    Inheritance:
    - AbstractBaseUser: Provides core user functionality
        * password field and hashing (set_password, check_password)
        * last_login field
        * is_active field handling
        * get_username() method

    - PermissionsMixin: Adds Django's permission framework
        * is_superuser field
        * groups relationship (ManyToMany)
        * user_permissions relationship (ManyToMany)
        * has_perm(), has_module_perms() methods

    Why custom User model?
    - Email as primary identifier instead of username
    - Custom fields for gym (fitness_goal, experience_level)
    - Role-based access control (customer/admin)
    - UUID primary key for better security and distribution
    """

    # ============================================================
    # CHOICES - Define allowed values for specific fields
    # TextChoices creates a human-readable enum
    # Format: CONSTANT = 'db_value', 'Display Label'
    # ============================================================

    class Role(models.TextChoices):
        """User roles for access control"""
        CUSTOMER = 'customer', 'Customer'  # Regular gym member
        ADMIN = 'admin', 'Admin'           # System administrator

    class Gender(models.TextChoices):
        """Gender options for user profile"""
        MALE = 'male', 'Male'
        FEMALE = 'female', 'Female'

    class FitnessGoal(models.TextChoices):
        """Fitness goals to customize workout recommendations"""
        WEIGHT_LOSS = 'weight_loss', 'Weight Loss'
        MUSCLE_GAIN = 'muscle_gain', 'Muscle Gain'
        GENERAL_FITNESS = 'general_fitness', 'General Fitness'

    class ExperienceLevel(models.TextChoices):
        """Experience level for appropriate workout difficulty"""
        BEGINNER = 'beginner', 'Beginner'
        INTERMEDIATE = 'intermediate', 'Intermediate'
        ADVANCED = 'advanced', 'Advanced'

    # ============================================================
    # HELPER METHODS
    # Required by Django's authentication system
    # ============================================================

    def get_full_name(self):
        """Return the user's full name (required by Django)"""
        return self.name

    def get_short_name(self):
        """Return user's first name for informal greetings"""
        return self.name.split(' ')[0] if self.name else ''

    # ============================================================
    # MODEL FIELDS
    # ============================================================

    # Primary key: UUID instead of auto-increment integer
    # Benefits: No sequential IDs (more secure), works across distributed systems
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,  # Generates a random UUID
        editable=False       # Cannot be changed after creation
    )

    # Authentication field (used instead of username)
    email = models.EmailField(unique=True)  # unique=True enforces no duplicates

    # Profile fields
    name = models.CharField(max_length=255)
    age = models.PositiveIntegerField(null=True, blank=True)  # Optional field
    gender = models.CharField(
        max_length=10,
        choices=Gender.choices,  # Limits values to defined choices
        null=True,
        blank=True
    )

    # Fitness-related fields
    fitness_goal = models.CharField(
        max_length=20,
        choices=FitnessGoal.choices,
        default=FitnessGoal.GENERAL_FITNESS  # Default value if not specified
    )
    experience_level = models.CharField(
        max_length=20,
        choices=ExperienceLevel.choices,
        default=ExperienceLevel.BEGINNER
    )

    # Access control fields
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.CUSTOMER  # New users are customers by default
    )
    is_active = models.BooleanField(default=True)   # Can login (False = blocked)
    is_staff = models.BooleanField(default=False)   # Can access Django admin

    # Timestamp fields (automatically managed)
    created_at = models.DateTimeField(auto_now_add=True)  # Set on creation
    updated_at = models.DateTimeField(auto_now=True)      # Updated on every save

    # ============================================================
    # MODEL CONFIGURATION
    # ============================================================

    # Link the custom manager to this model
    objects = UserManager()

    # Tell Django which field to use as the "username" for authentication
    USERNAME_FIELD = 'email'

    # Additional required fields when creating superuser via CLI
    # (email and password are already required)
    REQUIRED_FIELDS = ['name']

    class Meta:
        """
        Model metadata options
        """
        db_table = 'users'          # Custom table name (default would be 'users_user')
        ordering = ['-created_at']  # Default ordering: newest first

    def __str__(self):
        """String representation shown in admin and debugging"""
        return self.email

    @property
    def is_admin(self):
        """
        Property to check if user has admin role.

        Usage: if user.is_admin: ...

        This is used by the IsAdmin permission class for access control.
        """
        return self.role == self.Role.ADMIN

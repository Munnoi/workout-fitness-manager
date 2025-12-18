import uuid
from django.db import models
from django.conf import settings


class Exercise(models.Model):
    class MuscleGroup(models.TextChoices):
        CHEST = 'chest', 'Chest'
        BACK = 'back', 'Back'
        SHOULDERS = 'shoulders', 'Shoulders'
        BICEPS = 'biceps', 'Biceps'
        TRICEPS = 'triceps', 'Triceps'
        LEGS = 'legs', 'Legs'
        CORE = 'core', 'Core'
        FULL_BODY = 'full_body', 'Full Body'
        CARDIO = 'cardio', 'Cardio'

    class Category(models.TextChoices):
        STRENGTH = 'strength', 'Strength'
        CARDIO = 'cardio', 'Cardio'
        FLEXIBILITY = 'flexibility', 'Flexibility'
        HIIT = 'hiit', 'HIIT'

    class GenderFocus(models.TextChoices):
        MALE = 'male', 'Male'
        FEMALE = 'female', 'Female'
        BOTH = 'both', 'Both'

    class Equipment(models.TextChoices):
        NONE = 'none', 'No Equipment'
        DUMBBELLS = 'dumbbells', 'Dumbbells'
        BARBELL = 'barbell', 'Barbell'
        MACHINES = 'machines', 'Gym Machines'
        RESISTANCE_BANDS = 'resistance_bands', 'Resistance Bands'
        KETTLEBELL = 'kettlebell', 'Kettlebell'

    class Difficulty(models.TextChoices):
        BEGINNER = 'beginner', 'Beginner'
        INTERMEDIATE = 'intermediate', 'Intermediate'
        ADVANCED = 'advanced', 'Advanced'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    muscle_group = models.CharField(max_length=20, choices=MuscleGroup.choices)
    category = models.CharField(max_length=20, choices=Category.choices)
    gender_focus = models.CharField(
        max_length=10,
        choices=GenderFocus.choices,
        default=GenderFocus.BOTH
    )
    equipment = models.CharField(
        max_length=20,
        choices=Equipment.choices,
        default=Equipment.NONE
    )
    difficulty = models.CharField(
        max_length=20,
        choices=Difficulty.choices,
        default=Difficulty.BEGINNER
    )
    instructions = models.TextField()
    media_url = models.URLField(blank=True, null=True)
    sets = models.PositiveIntegerField(default=3)
    reps = models.CharField(max_length=50, default='10-12')
    rest_time = models.PositiveIntegerField(default=60, help_text='Rest time in seconds')
    safety_tips = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'exercises'
        ordering = ['name']

    def __str__(self):
        return self.name


class WorkoutProgram(models.Model):
    class Goal(models.TextChoices):
        WEIGHT_LOSS = 'weight_loss', 'Weight Loss'
        MUSCLE_GAIN = 'muscle_gain', 'Muscle Gain'
        GENERAL_FITNESS = 'general_fitness', 'General Fitness'
        STRENGTH = 'strength', 'Strength Training'
        ENDURANCE = 'endurance', 'Endurance'

    class GenderFocus(models.TextChoices):
        MALE = 'male', 'Male'
        FEMALE = 'female', 'Female'
        BOTH = 'both', 'Both'

    class Difficulty(models.TextChoices):
        BEGINNER = 'beginner', 'Beginner'
        INTERMEDIATE = 'intermediate', 'Intermediate'
        ADVANCED = 'advanced', 'Advanced'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField()
    goal = models.CharField(max_length=20, choices=Goal.choices)
    gender_focus = models.CharField(
        max_length=10,
        choices=GenderFocus.choices,
        default=GenderFocus.BOTH
    )
    difficulty = models.CharField(
        max_length=20,
        choices=Difficulty.choices,
        default=Difficulty.BEGINNER
    )
    media_url = models.URLField(blank=True, null=True)
    image = models.URLField(blank=True, null=True)
    duration_weeks = models.PositiveIntegerField(default=4)
    days_per_week = models.PositiveIntegerField(default=3)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_programs'
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'workout_programs'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class ProgramDay(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    program = models.ForeignKey(
        WorkoutProgram,
        on_delete=models.CASCADE,
        related_name='days'
    )
    week_number = models.PositiveIntegerField()
    day_number = models.PositiveIntegerField()
    day_name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_rest_day = models.BooleanField(default=False)

    class Meta:
        db_table = 'program_days'
        ordering = ['week_number', 'day_number']
        unique_together = ['program', 'week_number', 'day_number']

    def __str__(self):
        return f"{self.program.name} - Week {self.week_number}, Day {self.day_number}"


class DayExercise(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    day = models.ForeignKey(
        ProgramDay,
        on_delete=models.CASCADE,
        related_name='exercises'
    )
    exercise = models.ForeignKey(
        Exercise,
        on_delete=models.CASCADE,
        related_name='day_exercises'
    )
    order_index = models.PositiveIntegerField(default=0)
    custom_sets = models.PositiveIntegerField(null=True, blank=True)
    custom_reps = models.CharField(max_length=50, blank=True)
    custom_rest_time = models.PositiveIntegerField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'day_exercises'
        ordering = ['order_index']

    def __str__(self):
        return f"{self.day} - {self.exercise.name}"

    @property
    def sets(self):
        return self.custom_sets or self.exercise.sets

    @property
    def reps(self):
        return self.custom_reps or self.exercise.reps

    @property
    def rest_time(self):
        return self.custom_rest_time or self.exercise.rest_time


class UserEnrollment(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        COMPLETED = 'completed', 'Completed'
        PAUSED = 'paused', 'Paused'
        CANCELLED = 'cancelled', 'Cancelled'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    program = models.ForeignKey(
        WorkoutProgram,
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    start_date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    current_week = models.PositiveIntegerField(default=1)
    current_day = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_enrollments'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.name} - {self.program.name}"

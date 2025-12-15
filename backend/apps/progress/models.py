import uuid
from django.db import models
from django.conf import settings


class WorkoutHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='workout_history'
    )
    program = models.ForeignKey(
        'workouts.WorkoutProgram',
        on_delete=models.SET_NULL,
        null=True,
        related_name='history'
    )
    day = models.ForeignKey(
        'workouts.ProgramDay',
        on_delete=models.SET_NULL,
        null=True,
        related_name='history'
    )
    completed_at = models.DateTimeField(auto_now_add=True)
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    calories_burned = models.PositiveIntegerField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'workout_history'
        ordering = ['-completed_at']
        verbose_name_plural = 'Workout histories'

    def __str__(self):
        return f"{self.user.name} - {self.completed_at.date()}"


class ExerciseCompletion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    history = models.ForeignKey(
        WorkoutHistory,
        on_delete=models.CASCADE,
        related_name='exercise_completions'
    )
    exercise = models.ForeignKey(
        'workouts.Exercise',
        on_delete=models.SET_NULL,
        null=True,
        related_name='completions'
    )
    completed = models.BooleanField(default=True)
    actual_sets = models.PositiveIntegerField(null=True, blank=True)
    actual_reps = models.CharField(max_length=50, blank=True)
    weight_used = models.CharField(max_length=50, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'exercise_completions'

    def __str__(self):
        status = 'Completed' if self.completed else 'Skipped'
        return f"{self.exercise.name if self.exercise else 'Unknown'} - {status}"


class UserStreak(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='streak'
    )
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    last_workout_date = models.DateField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_streaks'

    def __str__(self):
        return f"{self.user.name} - {self.current_streak} day streak"

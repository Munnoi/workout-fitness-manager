from django.contrib import admin
from .models import WorkoutHistory, ExerciseCompletion, UserStreak


class ExerciseCompletionInline(admin.TabularInline):
    model = ExerciseCompletion
    extra = 0


@admin.register(WorkoutHistory)
class WorkoutHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'program', 'day', 'completed_at', 'duration_minutes']
    list_filter = ['completed_at', 'program']
    search_fields = ['user__name', 'user__email']
    inlines = [ExerciseCompletionInline]


@admin.register(UserStreak)
class UserStreakAdmin(admin.ModelAdmin):
    list_display = ['user', 'current_streak', 'longest_streak', 'last_workout_date']
    search_fields = ['user__name', 'user__email']

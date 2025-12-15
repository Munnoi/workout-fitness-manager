from django.contrib import admin
from .models import Exercise, WorkoutProgram, ProgramDay, DayExercise, UserEnrollment


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ['name', 'muscle_group', 'category', 'difficulty', 'equipment', 'is_active']
    list_filter = ['muscle_group', 'category', 'difficulty', 'equipment', 'gender_focus']
    search_fields = ['name', 'description']


class ProgramDayInline(admin.TabularInline):
    model = ProgramDay
    extra = 1


@admin.register(WorkoutProgram)
class WorkoutProgramAdmin(admin.ModelAdmin):
    list_display = ['name', 'goal', 'difficulty', 'duration_weeks', 'is_active', 'created_at']
    list_filter = ['goal', 'difficulty', 'gender_focus', 'is_active']
    search_fields = ['name', 'description']
    inlines = [ProgramDayInline]


@admin.register(ProgramDay)
class ProgramDayAdmin(admin.ModelAdmin):
    list_display = ['program', 'week_number', 'day_number', 'day_name', 'is_rest_day']
    list_filter = ['program', 'is_rest_day']


@admin.register(DayExercise)
class DayExerciseAdmin(admin.ModelAdmin):
    list_display = ['day', 'exercise', 'order_index']
    list_filter = ['day__program']


@admin.register(UserEnrollment)
class UserEnrollmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'program', 'status', 'start_date', 'current_week', 'current_day']
    list_filter = ['status', 'program']
    search_fields = ['user__name', 'user__email']

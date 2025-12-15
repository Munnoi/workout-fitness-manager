from django.urls import path
from .views import (
    ProgramListCreateView,
    ProgramDetailView,
    ProgramDayListCreateView,
    DayExerciseListCreateView,
    EnrollmentListCreateView,
    EnrollmentDetailView,
    EnrollInProgramView,
    CurrentProgramView,
    TodayWorkoutView,
    ProgramStatsView,
)

urlpatterns = [
    path('', ProgramListCreateView.as_view(), name='program-list'),
    path('stats/', ProgramStatsView.as_view(), name='program-stats'),
    path('current/', CurrentProgramView.as_view(), name='current-program'),
    path('today/', TodayWorkoutView.as_view(), name='today-workout'),
    path('enrollments/', EnrollmentListCreateView.as_view(), name='enrollment-list'),
    path('enrollments/<uuid:pk>/', EnrollmentDetailView.as_view(), name='enrollment-detail'),
    path('<uuid:pk>/', ProgramDetailView.as_view(), name='program-detail'),
    path('<uuid:pk>/enroll/', EnrollInProgramView.as_view(), name='program-enroll'),
    path('<uuid:program_id>/days/', ProgramDayListCreateView.as_view(), name='program-days'),
    path('days/<uuid:day_id>/exercises/', DayExerciseListCreateView.as_view(), name='day-exercises'),
]

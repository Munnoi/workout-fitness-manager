from django.urls import path
from .views import (
    WorkoutHistoryListView,
    CompleteWorkoutView,
    UserStatsView,
    UserStreakView,
    WeeklyProgressView,
    ProgressChartDataView,
    AdminProgressStatsView,
)

urlpatterns = [
    path('history/', WorkoutHistoryListView.as_view(), name='workout-history'),
    path('complete-workout/', CompleteWorkoutView.as_view(), name='complete-workout'),
    path('stats/', UserStatsView.as_view(), name='user-stats'),
    path('streak/', UserStreakView.as_view(), name='user-streak'),
    path('weekly/', WeeklyProgressView.as_view(), name='weekly-progress'),
    path('chart/', ProgressChartDataView.as_view(), name='chart-data'),
    path('admin-stats/', AdminProgressStatsView.as_view(), name='admin-progress-stats'),
]

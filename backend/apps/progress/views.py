from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Sum, Avg, Count
from datetime import timedelta

from .models import WorkoutHistory, ExerciseCompletion, UserStreak
from .serializers import (
    WorkoutHistorySerializer,
    WorkoutHistoryCreateSerializer,
    UserStreakSerializer,
    UserStatsSerializer,
)
from apps.workouts.models import UserEnrollment
from apps.users.permissions import IsAdmin


class WorkoutHistoryListView(generics.ListAPIView):
    serializer_class = WorkoutHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WorkoutHistory.objects.filter(user=self.request.user)


class CompleteWorkoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = WorkoutHistoryCreateSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            history = serializer.save()

            # Update user streak
            self._update_streak(request.user)

            # Update enrollment progress if applicable
            self._update_enrollment_progress(request.user, history)

            return Response(
                WorkoutHistorySerializer(history).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def _update_streak(self, user):
        today = timezone.now().date()
        streak, created = UserStreak.objects.get_or_create(user=user)

        if streak.last_workout_date:
            days_diff = (today - streak.last_workout_date).days

            if days_diff == 0:
                # Same day, no streak update needed
                pass
            elif days_diff == 1:
                # Consecutive day
                streak.current_streak += 1
            else:
                # Streak broken
                streak.current_streak = 1
        else:
            streak.current_streak = 1

        streak.last_workout_date = today
        if streak.current_streak > streak.longest_streak:
            streak.longest_streak = streak.current_streak
        streak.save()

    def _update_enrollment_progress(self, user, history):
        if not history.program or not history.day:
            return

        enrollment = UserEnrollment.objects.filter(
            user=user,
            program=history.program,
            status='active'
        ).first()

        if enrollment:
            # Move to next day
            next_day = enrollment.current_day + 1
            next_week = enrollment.current_week

            if next_day > enrollment.program.days_per_week:
                next_day = 1
                next_week += 1

            if next_week > enrollment.program.duration_weeks:
                enrollment.status = 'completed'
            else:
                enrollment.current_day = next_day
                enrollment.current_week = next_week

            enrollment.save()


class UserStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.now().date()
        week_start = today - timedelta(days=today.weekday())
        month_start = today.replace(day=1)

        # Get workout history stats
        history = WorkoutHistory.objects.filter(user=user)

        total_workouts = history.count()
        workouts_this_week = history.filter(completed_at__date__gte=week_start).count()
        workouts_this_month = history.filter(completed_at__date__gte=month_start).count()

        # Duration stats
        duration_stats = history.aggregate(
            total_duration=Sum('duration_minutes'),
            avg_duration=Avg('duration_minutes')
        )

        # Streak info
        try:
            streak = UserStreak.objects.get(user=user)
            current_streak = streak.current_streak
            longest_streak = streak.longest_streak
        except UserStreak.DoesNotExist:
            current_streak = 0
            longest_streak = 0

        # Completion percentage (for current program)
        completion_percentage = 0
        enrollment = UserEnrollment.objects.filter(user=user, status='active').first()
        if enrollment:
            total_days = enrollment.program.duration_weeks * enrollment.program.days_per_week
            completed_days = history.filter(program=enrollment.program).count()
            if total_days > 0:
                completion_percentage = (completed_days / total_days) * 100

        stats = {
            'total_workouts': total_workouts,
            'workouts_this_week': workouts_this_week,
            'workouts_this_month': workouts_this_month,
            'current_streak': current_streak,
            'longest_streak': longest_streak,
            'total_duration_minutes': duration_stats['total_duration'] or 0,
            'avg_workout_duration': round(duration_stats['avg_duration'] or 0, 1),
            'completion_percentage': round(completion_percentage, 1),
        }

        return Response(stats)


class UserStreakView(generics.RetrieveAPIView):
    serializer_class = UserStreakSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        streak, created = UserStreak.objects.get_or_create(user=self.request.user)
        return streak


class WeeklyProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.now().date()

        # Get last 7 days of workout data
        weekly_data = []
        for i in range(6, -1, -1):
            date = today - timedelta(days=i)
            workouts = WorkoutHistory.objects.filter(
                user=user,
                completed_at__date=date
            )
            weekly_data.append({
                'date': date.isoformat(),
                'day_name': date.strftime('%A'),
                'workouts_completed': workouts.count(),
                'total_duration': workouts.aggregate(
                    total=Sum('duration_minutes')
                )['total'] or 0
            })

        return Response(weekly_data)


class ProgressChartDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        period = request.query_params.get('period', 'month')

        if period == 'week':
            days = 7
        elif period == 'month':
            days = 30
        else:
            days = 90

        today = timezone.now().date()
        start_date = today - timedelta(days=days)

        # Get workout counts by date
        history = WorkoutHistory.objects.filter(
            user=user,
            completed_at__date__gte=start_date
        ).values('completed_at__date').annotate(
            count=Count('id'),
            duration=Sum('duration_minutes')
        ).order_by('completed_at__date')

        chart_data = []
        for entry in history:
            chart_data.append({
                'date': entry['completed_at__date'].isoformat(),
                'workouts': entry['count'],
                'duration': entry['duration'] or 0
            })

        return Response(chart_data)


class AdminProgressStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        today = timezone.now().date()
        week_start = today - timedelta(days=today.weekday())

        total_workouts_logged = WorkoutHistory.objects.count()
        workouts_this_week = WorkoutHistory.objects.filter(
            completed_at__date__gte=week_start
        ).count()

        # Most active users
        active_users = WorkoutHistory.objects.values(
            'user__name', 'user__email'
        ).annotate(
            workout_count=Count('id')
        ).order_by('-workout_count')[:10]

        return Response({
            'total_workouts_logged': total_workouts_logged,
            'workouts_this_week': workouts_this_week,
            'most_active_users': list(active_users)
        })

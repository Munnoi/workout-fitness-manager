from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone

from .models import Exercise, WorkoutProgram, ProgramDay, DayExercise, UserEnrollment
from .serializers import (
    ExerciseSerializer,
    ExerciseListSerializer,
    WorkoutProgramSerializer,
    WorkoutProgramListSerializer,
    WorkoutProgramCreateSerializer,
    ProgramDaySerializer,
    DayExerciseSerializer,
    UserEnrollmentSerializer,
    EnrollmentCreateSerializer,
)
from apps.users.permissions import IsAdmin


# Exercise Views
class ExerciseListCreateView(generics.ListCreateAPIView):
    queryset = Exercise.objects.filter(is_active=True)
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['muscle_group', 'category', 'gender_focus', 'equipment', 'difficulty']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated(), IsAdmin()]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ExerciseListSerializer
        return ExerciseSerializer

    def perform_create(self, serializer):
        serializer.save()


class ExerciseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated(), IsAdmin()]


# Workout Program Views
class ProgramListCreateView(generics.ListCreateAPIView):
    queryset = WorkoutProgram.objects.filter(is_active=True)
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['goal', 'gender_focus', 'difficulty', 'duration_weeks']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at', 'duration_weeks']

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated(), IsAdmin()]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return WorkoutProgramListSerializer
        return WorkoutProgramCreateSerializer

    def get_queryset(self):
        queryset = WorkoutProgram.objects.filter(is_active=True)

        # For authenticated customers, only show programs matching their experience level.
        if self.request.user.is_authenticated and not self.request.user.is_admin:
            queryset = queryset.filter(difficulty=self.request.user.experience_level)

        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ProgramDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = WorkoutProgram.objects.prefetch_related('days__exercises__exercise', 'enrollments').all()

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated(), IsAdmin()]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return WorkoutProgramSerializer
        return WorkoutProgramCreateSerializer


class ProgramDayListCreateView(generics.ListCreateAPIView):
    serializer_class = ProgramDaySerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        program_id = self.kwargs['program_id']
        return ProgramDay.objects.filter(program_id=program_id)

    def perform_create(self, serializer):
        program_id = self.kwargs['program_id']
        serializer.save(program_id=program_id)


class DayExerciseListCreateView(generics.ListCreateAPIView):
    serializer_class = DayExerciseSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        day_id = self.kwargs['day_id']
        return DayExercise.objects.filter(day_id=day_id)

    def perform_create(self, serializer):
        day_id = self.kwargs['day_id']
        serializer.save(day_id=day_id)


# Enrollment Views
class EnrollmentListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserEnrollment.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserEnrollmentSerializer
        return EnrollmentCreateSerializer


class EnrollmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserEnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserEnrollment.objects.filter(user=self.request.user)


class EnrollInProgramView(APIView):
    permission_classes = [IsAuthenticated]

    @staticmethod
    def _bootstrap_program_days(program):
        candidate_exercises = Exercise.objects.filter(
            is_active=True,
            difficulty=program.difficulty
        ).filter(gender_focus__in=['both', program.gender_focus]).order_by('name')

        if not candidate_exercises.exists():
            return False

        for week in range(1, program.duration_weeks + 1):
            for day_number in range(1, program.days_per_week + 1):
                day = ProgramDay.objects.create(
                    program=program,
                    week_number=week,
                    day_number=day_number,
                    day_name=f'Workout {day_number}',
                    description='Auto-generated schedule'
                )

                for order_index, exercise in enumerate(candidate_exercises, start=1):
                    DayExercise.objects.create(
                        day=day,
                        exercise=exercise,
                        order_index=order_index
                    )

        return True

    def post(self, request, pk):
        try:
            program = WorkoutProgram.objects.get(pk=pk, is_active=True)
        except WorkoutProgram.DoesNotExist:
            return Response(
                {'error': 'Program not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if program.difficulty != request.user.experience_level:
            return Response(
                {'error': f"This program is for {program.difficulty} users. Your experience level is {request.user.experience_level}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not ProgramDay.objects.filter(program=program).exists():
            schedule_created = self._bootstrap_program_days(program)
            if not schedule_created:
                return Response(
                    {'error': 'This program has no scheduled workout days yet. Please choose another program.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Check if already enrolled
        existing = UserEnrollment.objects.filter(
            user=request.user,
            program=program,
            status='active'
        ).exists()

        if existing:
            return Response(
                {'error': 'Already enrolled in this program'},
                status=status.HTTP_400_BAD_REQUEST
            )

        enrollment = UserEnrollment.objects.create(
            user=request.user,
            program=program,
            start_date=timezone.now().date()
        )

        return Response(
            UserEnrollmentSerializer(enrollment).data,
            status=status.HTTP_201_CREATED
        )


class CurrentProgramView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        enrollment = UserEnrollment.objects.filter(
            user=request.user,
            status='active'
        ).select_related('program').first()

        if not enrollment:
            return Response(
                {'message': 'No active enrollment'},
                status=status.HTTP_404_NOT_FOUND
            )

        program_data = WorkoutProgramSerializer(enrollment.program).data
        return Response({
            'enrollment': UserEnrollmentSerializer(enrollment).data,
            'program': program_data
        })


class TodayWorkoutView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        enrollments = UserEnrollment.objects.filter(
            user=request.user,
            status='active'
        ).select_related('program')

        if not enrollments.exists():
            return Response(
                {'message': 'No active enrollment'},
                status=status.HTTP_404_NOT_FOUND
            )

        selected_enrollment = None
        selected_day = None

        for enrollment in enrollments:
            day = ProgramDay.objects.filter(
                program=enrollment.program,
                week_number=enrollment.current_week,
                day_number=enrollment.current_day
            ).first()

            if not day:
                day = ProgramDay.objects.filter(
                    program=enrollment.program
                ).order_by('week_number', 'day_number').first()

                if day:
                    enrollment.current_week = day.week_number
                    enrollment.current_day = day.day_number
                    enrollment.save(update_fields=['current_week', 'current_day', 'updated_at'])

            if day:
                selected_enrollment = enrollment
                selected_day = day
                break

        if not selected_day:
            return Response(
                {'message': 'No workout scheduled for today. Your active program has no workout days configured.'},
                status=status.HTTP_404_NOT_FOUND
            )

        day_data = ProgramDaySerializer(selected_day).data

        # Remove hardcoded weekday if present (e.g., "Monday - Workout 1" -> "Workout 1")
        if ' - ' in day_data['day_name']:
            day_data['day_name'] = day_data['day_name'].split(' - ')[1]

        return Response({
            'enrollment': UserEnrollmentSerializer(selected_enrollment).data,
            'day': day_data
        })


class ProgramStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        total_programs = WorkoutProgram.objects.count()
        active_programs = WorkoutProgram.objects.filter(is_active=True).count()
        total_exercises = Exercise.objects.count()
        total_enrollments = UserEnrollment.objects.filter(status='active').count()

        # Most popular programs
        from django.db.models import Count
        popular_programs = WorkoutProgram.objects.annotate(
            enrollment_count=Count('enrollments')
        ).order_by('-enrollment_count')[:5]

        return Response({
            'total_programs': total_programs,
            'active_programs': active_programs,
            'total_exercises': total_exercises,
            'active_enrollments': total_enrollments,
            'popular_programs': WorkoutProgramListSerializer(popular_programs, many=True).data
        })

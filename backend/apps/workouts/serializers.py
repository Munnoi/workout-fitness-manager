from rest_framework import serializers
from .models import Exercise, WorkoutProgram, ProgramDay, DayExercise, UserEnrollment


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class ExerciseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = [
            'id', 'name', 'muscle_group', 'category',
            'gender_focus', 'equipment', 'difficulty', 'media_url'
        ]


class DayExerciseSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer(read_only=True)
    exercise_id = serializers.UUIDField(write_only=True)
    sets = serializers.ReadOnlyField()
    reps = serializers.ReadOnlyField()
    rest_time = serializers.ReadOnlyField()

    class Meta:
        model = DayExercise
        fields = [
            'id', 'exercise', 'exercise_id', 'order_index',
            'custom_sets', 'custom_reps', 'custom_rest_time',
            'notes', 'sets', 'reps', 'rest_time'
        ]


class ProgramDaySerializer(serializers.ModelSerializer):
    exercises = DayExerciseSerializer(many=True, read_only=True)

    class Meta:
        model = ProgramDay
        fields = [
            'id', 'week_number', 'day_number', 'day_name',
            'description', 'is_rest_day', 'exercises'
        ]


class ProgramDayCreateSerializer(serializers.ModelSerializer):
    exercises = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = ProgramDay
        fields = [
            'week_number', 'day_number', 'day_name',
            'description', 'is_rest_day', 'exercises'
        ]


class WorkoutProgramSerializer(serializers.ModelSerializer):
    days = ProgramDaySerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    total_exercises = serializers.SerializerMethodField()
    enrollment_count = serializers.SerializerMethodField()

    class Meta:
        model = WorkoutProgram
        fields = [
            'id', 'name', 'description', 'goal', 'gender_focus',
            'difficulty', 'duration_weeks', 'days_per_week',
            'created_by', 'created_by_name', 'is_active',
            'created_at', 'days', 'total_exercises', 'enrollment_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']

    def get_total_exercises(self, obj):
        count = 0
        for day in obj.days.all():
            count += day.exercises.count()
        return count

    def get_enrollment_count(self, obj):
        return obj.enrollments.filter(status='active').count()


class WorkoutProgramListSerializer(serializers.ModelSerializer):
    enrollment_count = serializers.SerializerMethodField()

    class Meta:
        model = WorkoutProgram
        fields = [
            'id', 'name', 'description', 'goal', 'gender_focus',
            'difficulty', 'duration_weeks', 'days_per_week',
            'is_active', 'enrollment_count'
        ]

    def get_enrollment_count(self, obj):
        return obj.enrollments.filter(status='active').count()


class WorkoutProgramCreateSerializer(serializers.ModelSerializer):
    days = ProgramDayCreateSerializer(many=True, required=False)

    class Meta:
        model = WorkoutProgram
        fields = [
            'name', 'description', 'goal', 'gender_focus',
            'difficulty', 'duration_weeks', 'days_per_week', 'days'
        ]

    def create(self, validated_data):
        days_data = validated_data.pop('days', [])
        program = WorkoutProgram.objects.create(**validated_data)

        for day_data in days_data:
            exercises_data = day_data.pop('exercises', [])
            day = ProgramDay.objects.create(program=program, **day_data)

            for idx, exercise_data in enumerate(exercises_data):
                DayExercise.objects.create(
                    day=day,
                    exercise_id=exercise_data.get('exercise_id'),
                    order_index=exercise_data.get('order_index', idx),
                    custom_sets=exercise_data.get('custom_sets'),
                    custom_reps=exercise_data.get('custom_reps'),
                    custom_rest_time=exercise_data.get('custom_rest_time'),
                    notes=exercise_data.get('notes', '')
                )

        return program


class UserEnrollmentSerializer(serializers.ModelSerializer):
    program = WorkoutProgramListSerializer(read_only=True)
    program_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = UserEnrollment
        fields = [
            'id', 'program', 'program_id', 'start_date', 'status',
            'current_week', 'current_day', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'status', 'current_week', 'current_day']


class EnrollmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserEnrollment
        fields = ['program', 'start_date']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

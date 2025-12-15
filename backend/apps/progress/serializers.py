from rest_framework import serializers
from .models import WorkoutHistory, ExerciseCompletion, UserStreak
from apps.workouts.serializers import ExerciseListSerializer


class ExerciseCompletionSerializer(serializers.ModelSerializer):
    exercise_name = serializers.CharField(source='exercise.name', read_only=True)

    class Meta:
        model = ExerciseCompletion
        fields = [
            'id', 'exercise', 'exercise_name', 'completed',
            'actual_sets', 'actual_reps', 'weight_used', 'notes'
        ]


class WorkoutHistorySerializer(serializers.ModelSerializer):
    exercise_completions = ExerciseCompletionSerializer(many=True, read_only=True)
    program_name = serializers.CharField(source='program.name', read_only=True)
    day_name = serializers.CharField(source='day.day_name', read_only=True)

    class Meta:
        model = WorkoutHistory
        fields = [
            'id', 'program', 'program_name', 'day', 'day_name',
            'completed_at', 'duration_minutes', 'calories_burned',
            'notes', 'exercise_completions'
        ]
        read_only_fields = ['id', 'completed_at']


class WorkoutHistoryCreateSerializer(serializers.ModelSerializer):
    exercise_completions = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = WorkoutHistory
        fields = [
            'program', 'day', 'duration_minutes',
            'calories_burned', 'notes', 'exercise_completions'
        ]

    def create(self, validated_data):
        exercise_completions_data = validated_data.pop('exercise_completions', [])
        history = WorkoutHistory.objects.create(
            user=self.context['request'].user,
            **validated_data
        )

        for completion_data in exercise_completions_data:
            ExerciseCompletion.objects.create(
                history=history,
                **completion_data
            )

        return history


class UserStreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStreak
        fields = ['current_streak', 'longest_streak', 'last_workout_date']


class UserStatsSerializer(serializers.Serializer):
    total_workouts = serializers.IntegerField()
    workouts_this_week = serializers.IntegerField()
    workouts_this_month = serializers.IntegerField()
    current_streak = serializers.IntegerField()
    longest_streak = serializers.IntegerField()
    total_duration_minutes = serializers.IntegerField()
    avg_workout_duration = serializers.FloatField()
    completion_percentage = serializers.FloatField()

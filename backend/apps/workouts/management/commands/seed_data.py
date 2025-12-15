from django.core.management.base import BaseCommand
from apps.workouts.models import Exercise, WorkoutProgram, ProgramDay, DayExercise

class Command(BaseCommand):
    help = 'Seeds the database with initial exercises and programs'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # Exercises Data
        exercises_data = [
            {
                'name': 'Push Up',
                'description': 'A classic compound exercise for chest, shoulders, and triceps.',
                'muscle_group': 'chest',
                'category': 'strength',
                'difficulty': 'beginner',
                'equipment': 'none',
                'gender_focus': 'both',
                'instructions': """1. Start in a high plank position.
2. Lower your body until your chest nearly touches the floor.
3. Push back up to the starting position.""",
                'sets': 3,
                'reps': '10-15',
                'rest_time': 60
            },
            {
                'name': 'Squat',
                'description': 'Fundamental lower body exercise for quads, glutes, and hamstrings.',
                'muscle_group': 'legs',
                'category': 'strength',
                'difficulty': 'beginner',
                'equipment': 'none',
                'gender_focus': 'both',
                'instructions': """1. Stand with feet shoulder-width apart.
2. Lower your hips back and down as if sitting in a chair.
3. Keep your chest up and back straight.
4. Return to standing.""",
                'sets': 3,
                'reps': '12-15',
                'rest_time': 90
            },
            {
                'name': 'Lunges',
                'description': 'Unilateral leg exercise for balance and strength.',
                'muscle_group': 'legs',
                'category': 'strength',
                'difficulty': 'beginner',
                'equipment': 'none',
                'gender_focus': 'both',
                'instructions': """1. Step forward with one leg.
2. Lower your hips until both knees are bent at a 90-degree angle.
3. Push off the front foot to return to start.""",
                'sets': 3,
                'reps': '10 each leg',
                'rest_time': 60
            },
            {
                'name': 'Plank',
                'description': 'Isometric core exercise.',
                'muscle_group': 'core',
                'category': 'strength',
                'difficulty': 'beginner',
                'equipment': 'none',
                'gender_focus': 'both',
                'instructions': """1. Hold a push-up position but on your forearms.
2. Keep your body in a straight line from head to heels.
3. Hold for the designated time.""",
                'sets': 3,
                'reps': '30-60 sec',
                'rest_time': 60
            },
            {
                'name': 'Dumbbell Bench Press',
                'description': 'Chest press using dumbbells for better range of motion.',
                'muscle_group': 'chest',
                'category': 'strength',
                'difficulty': 'intermediate',
                'equipment': 'dumbbells',
                'gender_focus': 'both',
                'instructions': """1. Lie on a bench with dumbbells in hand.
2. Press the weights up over your chest.
3. Lower them slowly to the sides of your chest.""",
                'sets': 3,
                'reps': '8-12',
                'rest_time': 90
            },
            {
                'name': 'Dumbbell Rows',
                'description': 'Back exercise for lats and rhomboids.',
                'muscle_group': 'back',
                'category': 'strength',
                'difficulty': 'intermediate',
                'equipment': 'dumbbells',
                'gender_focus': 'both',
                'instructions': """1. Place one knee and hand on a bench.
2. Pull the dumbbell up towards your hip.
3. Lower it back down with control.""",
                'sets': 3,
                'reps': '10-12',
                'rest_time': 60
            },
            {
                'name': 'Shoulder Press',
                'description': 'Overhead press for shoulder strength.',
                'muscle_group': 'shoulders',
                'category': 'strength',
                'difficulty': 'intermediate',
                'equipment': 'dumbbells',
                'gender_focus': 'both',
                'instructions': """1. Sit or stand with dumbbells at shoulder height.
2. Press them straight up overhead.
3. Lower back to shoulder height.""",
                'sets': 3,
                'reps': '10-12',
                'rest_time': 90
            },
            {
                'name': 'Bicep Curls',
                'description': 'Isolation exercise for biceps.',
                'muscle_group': 'biceps',
                'category': 'strength',
                'difficulty': 'beginner',
                'equipment': 'dumbbells',
                'gender_focus': 'both',
                'instructions': """1. Stand with dumbbells at your sides.
2. Curl the weights up towards your shoulders.
3. Lower slowly.""",
                'sets': 3,
                'reps': '12-15',
                'rest_time': 60
            },
             {
                'name': 'Tricep Dips',
                'description': 'Bodyweight exercise for triceps.',
                'muscle_group': 'triceps',
                'category': 'strength',
                'difficulty': 'beginner',
                'equipment': 'none',
                'gender_focus': 'both',
                'instructions': """1. Use a bench or chair.
2. Lower your body by bending your elbows.
3. Push back up to straighten your arms.""",
                'sets': 3,
                'reps': '10-15',
                'rest_time': 60
            },
            {
                'name': 'Jumping Jacks',
                'description': 'Cardio warm-up exercise.',
                'muscle_group': 'cardio',
                'category': 'cardio',
                'difficulty': 'beginner',
                'equipment': 'none',
                'gender_focus': 'both',
                'instructions': """1. Jump feet apart and raise arms overhead.
2. Jump feet together and lower arms.""",
                'sets': 3,
                'reps': '30-60 sec',
                'rest_time': 45
            },
             {
                'name': 'Burpees',
                'description': 'Full body metabolic conditioning.',
                'muscle_group': 'full_body',
                'category': 'hiit',
                'difficulty': 'advanced',
                'equipment': 'none',
                'gender_focus': 'both',
                'instructions': """1. Drop to a squat.
2. Kick feet back to push-up position.
3. Do a push-up (optional).
4. Jump feet forward and jump up.""",
                'sets': 3,
                'reps': '10-15',
                'rest_time': 90
            },
        ]

        created_exercises = {}
        for ex_data in exercises_data:
            exercise, created = Exercise.objects.get_or_create(
                name=ex_data['name'],
                defaults=ex_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created exercise: {exercise.name}"))
            else:
                self.stdout.write(f"Exercise already exists: {exercise.name}")
            created_exercises[exercise.name] = exercise

        # Programs Data
        programs_data = [
            {
                'name': 'Beginner Full Body',
                'description': 'A perfect starting point for anyone new to fitness. This program targets all major muscle groups.',
                'duration_weeks': 4,
                'difficulty': 'beginner',
                'goal': 'general_fitness',
                'gender_focus': 'both',
                'days_per_week': 3,
                'exercises': ['Squat', 'Push Up', 'Lunges', 'Plank', 'Jumping Jacks']
            },
            {
                'name': 'Home Cardio Blast',
                'description': 'Get your heart rate up and burn calories with this equipment-free cardio routine.',
                'duration_weeks': 4,
                'difficulty': 'beginner',
                'goal': 'weight_loss',
                'gender_focus': 'both',
                'days_per_week': 3,
                'exercises': ['Jumping Jacks', 'Burpees', 'Squat', 'Lunges']
            },
            {
                'name': 'Upper Body Strength',
                'description': 'Focus on building strength and definition in your chest, back, shoulders, and arms.',
                'duration_weeks': 6,
                'difficulty': 'intermediate',
                'goal': 'muscle_gain',
                'gender_focus': 'male',
                'days_per_week': 4,
                'exercises': ['Dumbbell Bench Press', 'Dumbbell Rows', 'Shoulder Press', 'Bicep Curls', 'Tricep Dips', 'Push Up']
            },
             {
                'name': 'Lower Body Tone',
                'description': 'Sculpt and strengthen your legs and glutes.',
                'duration_weeks': 6,
                'difficulty': 'intermediate',
                'goal': 'muscle_gain',
                'gender_focus': 'female',
                'days_per_week': 3,
                'exercises': ['Squat', 'Lunges', 'Plank', 'Jumping Jacks']
            }
        ]

        for prog_data in programs_data:
            ex_names = prog_data.pop('exercises')
            program, created = WorkoutProgram.objects.get_or_create(
                name=prog_data['name'],
                defaults=prog_data
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created program: {program.name}"))
                
                # Create Program Days
                day_names = ['Monday', 'Wednesday', 'Friday', 'Saturday']
                
                for week in range(1, program.duration_weeks + 1):
                    for day_num in range(1, program.days_per_week + 1):
                         day_name = day_names[(day_num - 1) % len(day_names)]
                         
                         program_day = ProgramDay.objects.create(
                             program=program,
                             week_number=week,
                             day_number=day_num,
                             day_name=f"{day_name} - Workout {day_num}"
                         )

                         # Add exercises to the day
                         for i, ex_name in enumerate(ex_names):
                            if ex_name in created_exercises:
                                 DayExercise.objects.create(
                                    day=program_day,
                                    exercise=created_exercises[ex_name],
                                    order_index=i + 1
                                 )
            else:
                 self.stdout.write(f"Program already exists: {program.name}")

        self.stdout.write(self.style.SUCCESS('Successfully seeded database!'))
''
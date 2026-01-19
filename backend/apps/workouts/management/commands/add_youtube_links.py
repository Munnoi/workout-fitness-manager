from django.core.management.base import BaseCommand
from apps.workouts.models import Exercise


class Command(BaseCommand):
    help = 'Adds YouTube tutorial links to exercises'

    def handle(self, *args, **kwargs):
        self.stdout.write('Adding YouTube links to exercises...')

        # YouTube tutorial links for common exercises
        youtube_links = {
            'Push Up': 'https://www.youtube.com/watch?v=IODxDxX7oi4',
            'Squat': 'https://www.youtube.com/watch?v=aclHkVaku9U',
            'Lunges': 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
            'Plank': 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
            'Dumbbell Bench Press': 'https://www.youtube.com/watch?v=VmB1G1K7v94',
            'Dumbbell Rows': 'https://www.youtube.com/watch?v=roCP6wCXPqo',
            'Shoulder Press': 'https://www.youtube.com/watch?v=qEwKCR5JCog',
            'Bicep Curls': 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
            'Tricep Dips': 'https://www.youtube.com/watch?v=0326dy_-CzM',
            'Jumping Jacks': 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
            'Burpees': 'https://www.youtube.com/watch?v=dZgVxmf6jkA',
            # Additional common exercises
            'Deadlift': 'https://www.youtube.com/watch?v=op9kVnSso6Q',
            'Pull Up': 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
            'Lat Pulldown': 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
            'Leg Press': 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
            'Calf Raises': 'https://www.youtube.com/watch?v=-M4-G8p8fmc',
            'Russian Twist': 'https://www.youtube.com/watch?v=wkD8rjkodUI',
            'Mountain Climbers': 'https://www.youtube.com/watch?v=nmwgirgXLYM',
            'Leg Raises': 'https://www.youtube.com/watch?v=JB2oyawG9KI',
            'Crunches': 'https://www.youtube.com/watch?v=Xyd_fa5zoEU',
            'Bench Press': 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
            'Incline Press': 'https://www.youtube.com/watch?v=SrqOu55lrYU',
            'Chest Fly': 'https://www.youtube.com/watch?v=eozdVDA78K0',
            'Lateral Raises': 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
            'Front Raises': 'https://www.youtube.com/watch?v=-t7fuZ0KhDA',
            'Face Pulls': 'https://www.youtube.com/watch?v=rep-qVOkqgk',
            'Hammer Curls': 'https://www.youtube.com/watch?v=zC3nLlEvin4',
            'Tricep Pushdown': 'https://www.youtube.com/watch?v=2-LAMcpzODU',
            'Skull Crushers': 'https://www.youtube.com/watch?v=d_KZxkY_0cM',
            'Hip Thrust': 'https://www.youtube.com/watch?v=SEdqd1n0cvg',
            'Glute Bridge': 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E',
            'Step Ups': 'https://www.youtube.com/watch?v=WCFCdxzFBa4',
            'Box Jumps': 'https://www.youtube.com/watch?v=NBY9-kTuHEk',
            'Jump Rope': 'https://www.youtube.com/watch?v=u3zgHI8QnqE',
            'High Knees': 'https://www.youtube.com/watch?v=D0b9wGueamk',
        }

        updated_count = 0
        not_found = []

        for exercise_name, youtube_url in youtube_links.items():
            try:
                # Try exact match first
                exercise = Exercise.objects.get(name=exercise_name)
                exercise.media_url = youtube_url
                exercise.save()
                updated_count += 1
                self.stdout.write(self.style.SUCCESS(f"Updated: {exercise_name}"))
            except Exercise.DoesNotExist:
                # Try case-insensitive match
                exercises = Exercise.objects.filter(name__iexact=exercise_name)
                if exercises.exists():
                    for ex in exercises:
                        ex.media_url = youtube_url
                        ex.save()
                        updated_count += 1
                        self.stdout.write(self.style.SUCCESS(f"Updated: {ex.name}"))
                else:
                    # Try partial match
                    exercises = Exercise.objects.filter(name__icontains=exercise_name)
                    if exercises.exists():
                        for ex in exercises:
                            if not ex.media_url:  # Only update if no URL exists
                                ex.media_url = youtube_url
                                ex.save()
                                updated_count += 1
                                self.stdout.write(self.style.SUCCESS(f"Updated (partial match): {ex.name}"))
                    else:
                        not_found.append(exercise_name)

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(f'Successfully updated {updated_count} exercises with YouTube links!'))

        if not_found:
            self.stdout.write(self.style.WARNING(f'Exercises not found in database: {", ".join(not_found)}'))

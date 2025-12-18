import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.workouts.models import WorkoutProgram

def create_missing_programs():
    # 1. Yoga & Flexibility
    yoga, created = WorkoutProgram.objects.get_or_create(
        name='Yoga & Flexibility',
        defaults={
            'description': 'Improve balance, flexibility, and find your inner peace with this comprehensive yoga program.',
            'goal': 'general_fitness',
            'difficulty': 'beginner',
            'duration_weeks': 4,
            'days_per_week': 3,
            'gender_focus': 'both',
            'image': 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=600&auto=format&fit=crop',
            'media_url': 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
        }
    )
    if created:
        print('Created "Yoga & Flexibility" program.')
    else:
        # Update image if it exists but is missing/wrong
        yoga.image = 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=600&auto=format&fit=crop'
        yoga.save()
        print('Updated "Yoga & Flexibility" program.')

    # 2. Cardio Blast
    cardio, created = WorkoutProgram.objects.get_or_create(
        name='Cardio Blast',
        defaults={
            'description': 'Improve your heart health and endurance levels with high-energy cardio sessions.',
            'goal': 'general_fitness',
            'difficulty': 'intermediate',
            'duration_weeks': 4,
            'days_per_week': 4,
            'gender_focus': 'both',
            'image': 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=600&auto=format&fit=crop',
            'media_url': 'https://www.youtube.com/watch?v=gC_L9qAHVJ8',
        }
    )
    if created:
        print('Created "Cardio Blast" program.')
    else:
        # Update image if it exists but is missing/wrong
        cardio.image = 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=600&auto=format&fit=crop'
        cardio.save()
        print('Updated "Cardio Blast" program.')

if __name__ == '__main__':
    create_missing_programs()

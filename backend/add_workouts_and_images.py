import os
import django
import sys
import random

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.workouts.models import WorkoutProgram

# Images for different categories
IMAGES = {
    'weight_loss': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop',
    'muscle_gain': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop',
    'general_fitness': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop',
    'strength': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop',
    'endurance': 'https://images.unsplash.com/photo-1552674605-5d226f5abdff?w=800&auto=format&fit=crop',
    'hiit': 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&auto=format&fit=crop',
}

def update_existing_programs():
    programs = WorkoutProgram.objects.all()
    count = 0
    for program in programs:
        if not program.image:
            # Assign image based on goal
            if program.goal in IMAGES:
                program.image = IMAGES[program.goal]
            else:
                program.image = random.choice(list(IMAGES.values()))
            program.save()
            count += 1
    print(f'Updated {count} existing programs with images.')

def create_new_programs():
    # 1. Weight Loss Program
    wl_program, created = WorkoutProgram.objects.get_or_create(
        name='Ultimate Weight Loss Challenge',
        defaults={
            'description': 'A 6-week intensive program designed to burn fat and boost your metabolism through a combination of HIIT, cardio, and circuit training.',
            'goal': 'weight_loss',
            'difficulty': 'intermediate',
            'duration_weeks': 6,
            'days_per_week': 5,
            'gender_focus': 'both',
            'image': IMAGES['weight_loss'],
            'media_url': 'https://www.youtube.com/watch?v=gC_L9qAHVJ8',
        }
    )
    if created:
        print('Created "Ultimate Weight Loss Challenge" program.')
    else:
        print('"Ultimate Weight Loss Challenge" already exists.')

    # 2. Intensity Workout (HIIT)
    hiit_program, created = WorkoutProgram.objects.get_or_create(
        name='High Intensity Shred',
        defaults={
            'description': 'Push your limits with this advanced high-intensity interval training program. Short, explosive workouts to get you lean and fit fast.',
            'goal': 'endurance',  # closest to HIIT goal if strict enum
            'difficulty': 'advanced',
            'duration_weeks': 4,
            'days_per_week': 4,
            'gender_focus': 'both',
            'image': IMAGES['hiit'],
            'media_url': 'https://www.youtube.com/watch?v=M0uO8X3_tEA',
        }
    )
    if created:
        print('Created "High Intensity Shred" program.')
    else:
        print('"High Intensity Shred" already exists.')

if __name__ == '__main__':
    print('Starting update...')
    update_existing_programs()
    create_new_programs()
    print('Done.')

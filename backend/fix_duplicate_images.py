import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.workouts.models import WorkoutProgram

def fix_images():
    # 1. Fix Lower Body Tone
    try:
        lower_body = WorkoutProgram.objects.get(name='Lower Body Tone')
        # Image: Squats / Leg focus
        lower_body.image = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
        lower_body.save()
        print(f'Updated image for: {lower_body.name}')
    except WorkoutProgram.DoesNotExist:
        print('Program "Lower Body Tone" not found.')

    # 2. Fix Home Cardio Blast
    try:
        home_cardio = WorkoutProgram.objects.get(name='Home Cardio Blast')
        # Image: Jumping rope / Cardio
        home_cardio.image = 'https://plus.unsplash.com/premium_photo-1664474702997-a6a44f8b2212?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        home_cardio.save()
        print(f'Updated image for: {home_cardio.name}')
    except WorkoutProgram.DoesNotExist:
        print('Program "Home Cardio Blast" not found.')

if __name__ == '__main__':
    fix_images()

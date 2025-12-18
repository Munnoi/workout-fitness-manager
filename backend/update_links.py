import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.workouts.models import Exercise, WorkoutProgram

# Dictionary mapping keywords to YouTube URLs
VIDEO_LINKS = {
    'chest': 'https://www.youtube.com/watch?v=83eJEyrQe0A',
    'bench': 'https://www.youtube.com/watch?v=83eJEyrQe0A',
    'push up': 'https://www.youtube.com/watch?v=83eJEyrQe0A',
    'back': 'https://www.youtube.com/watch?v=e_04h13_uM4',
    'pull': 'https://www.youtube.com/watch?v=e_04h13_uM4',
    'row': 'https://www.youtube.com/watch?v=e_04h13_uM4',
    'leg': 'https://www.youtube.com/watch?v=WUzdhW_k82I',
    'squat': 'https://www.youtube.com/watch?v=WUzdhW_k82I',
    'lunge': 'https://www.youtube.com/watch?v=WUzdhW_k82I',
    'bicep': 'https://www.youtube.com/watch?v=jDwoBqPH0jk',
    'tricep': 'https://www.youtube.com/watch?v=jDwoBqPH0jk',
    'curl': 'https://www.youtube.com/watch?v=jDwoBqPH0jk',
    'arm': 'https://www.youtube.com/watch?v=jDwoBqPH0jk',
    'abs': 'https://www.youtube.com/watch?v=2pLT-ilgU_w',
    'core': 'https://www.youtube.com/watch?v=2pLT-ilgU_w',
    'plank': 'https://www.youtube.com/watch?v=2pLT-ilgU_w',
    'cardio': 'https://www.youtube.com/watch?v=gC_L9qAHVJ8',
    'run': 'https://www.youtube.com/watch?v=gC_L9qAHVJ8',
    'hiit': 'https://www.youtube.com/watch?v=gC_L9qAHVJ8',
    'yoga': 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
    'stretch': 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
    'flexibility': 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
}

DEFAULT_VIDEO = 'https://www.youtube.com/watch?v=UItWltVZZmE'

def get_video_url(text):
    text = text.lower()
    for keyword, url in VIDEO_LINKS.items():
        if keyword in text:
            return url
    return DEFAULT_VIDEO

def update_exercises():
    exercises = Exercise.objects.all()
    count = 0
    for exercise in exercises:
        # Update all links to ensure valid URLs
        exercise.media_url = get_video_url(exercise.name + ' ' + exercise.muscle_group)
        exercise.save()
        count += 1
    print(f'Updated {count} exercises with video links.')

def update_programs():
    programs = WorkoutProgram.objects.all()
    count = 0
    for program in programs:
        # Update all links to ensure valid URLs
        program.media_url = get_video_url(program.name + ' ' + program.description)
        program.save()
        count += 1
    print(f'Updated {count} programs with video links.')

if __name__ == '__main__':
    print('Starting video link update...')
    update_exercises()
    update_programs()
    print('Done.')

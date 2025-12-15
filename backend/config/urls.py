"""
URL configuration for FitLife Workout Planner project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls')),
    path('api/users/', include('apps.users.urls_admin')),
    path('api/profile/', include('apps.users.urls_profile')),
    path('api/exercises/', include('apps.workouts.urls_exercises')),
    path('api/programs/', include('apps.workouts.urls_programs')),
    path('api/progress/', include('apps.progress.urls')),
    path('api/contact/', include('apps.contact.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

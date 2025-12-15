from django.urls import path
from .views import (
    ContactMessageCreateView,
    ContactMessageListView,
    ContactMessageDetailView,
    ContactMessageReplyView,
    ContactStatsView,
)

urlpatterns = [
    path('', ContactMessageCreateView.as_view(), name='contact-create'),
    path('list/', ContactMessageListView.as_view(), name='contact-list'),
    path('stats/', ContactStatsView.as_view(), name='contact-stats'),
    path('<uuid:pk>/', ContactMessageDetailView.as_view(), name='contact-detail'),
    path('<uuid:pk>/reply/', ContactMessageReplyView.as_view(), name='contact-reply'),
]

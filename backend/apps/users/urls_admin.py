from django.urls import path
from .views import UserListView, UserDetailView, UserBlockView, UserStatsView

urlpatterns = [
    path('', UserListView.as_view(), name='user-list'),
    path('stats/', UserStatsView.as_view(), name='user-stats'),
    path('<uuid:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('<uuid:pk>/block/', UserBlockView.as_view(), name='user-block'),
]

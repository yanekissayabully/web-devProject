from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import AllowAny
from . import views
from .views import register_user
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Auth
    path('register/', register_user),
    path('login/', TokenObtainPairView.as_view(permission_classes=[AllowAny]), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Posts
    path('posts/', views.get_posts, name='get_posts'),
    path('posts/create/', views.create_post, name='create_post'),
    path('myposts/', views.MyPostsView.as_view(), name='my_posts'),
    path('posts/<int:post_id>/like/', views.like_post, name='like_post'),
    path('posts/<int:post_id>/comments/', views.get_post_comments, name='post_comments'),

    # Comments
    path('comments/create/', views.create_comment, name='create_comment'),

    # Profiles
    path('profile/me/', views.get_my_profile, name='my_profile'),
    path('profile/update/', views.update_my_profile, name='update_profile'),
    path('profile/<str:username>/', views.get_profile_by_username, name='profile_by_username'),
    path('profile/<str:username>/follows/', views.get_follow_counts, name='follow_counts'),

    # Follows
    path('follow/<str:username>/', views.follow_user, name='follow_user'),
    path('unfollow/<str:username>/', views.unfollow_user, name='unfollow_user'),
    path('follow/<str:username>/check/', views.check_follow_status, name='check_follow_status'),

    path('thread/create-or-get/<str:username>/', views.get_or_create_thread),
    path('chat/messages/<int:thread_id>/', views.get_messages),
    path('chat/messages/<int:thread_id>/send/', views.send_message),
    path('thread/<str:username>/', views.get_or_create_thread, name='get_or_create_thread'),
    path('follow/status/<str:username>/', views.check_follow_status, name='check_follow_status'),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

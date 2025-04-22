from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from rest_framework.permissions import AllowAny

urlpatterns = [
    path('register/', views.register_user),
    path('login/', TokenObtainPairView.as_view(permission_classes=[AllowAny])),
    path('token/refresh/', TokenRefreshView.as_view()),

    path('posts/', views.get_posts),
    path('posts/create/', views.create_post),
    path('myposts/', views.MyPostsView.as_view()),

    path('comments/create/', views.create_comment),
    path('posts/<int:post_id>/comments/', views.get_post_comments),

    path('posts/<int:post_id>/like/', views.like_post),

    path('profile/me/', views.get_my_profile),
    path('profile/update/', views.update_my_profile),
    path('profile/<str:username>/', views.get_profile_by_username),

]

from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer, RegisterSerializer

# Регистрация
@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# Получить все посты
@api_view(['GET'])
def get_posts(request):
    posts = Post.objects.all().order_by('-created_at')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

# Создать пост (только авторизованные)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# Получить мои посты (CBV)
class MyPostsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = Post.objects.filter(author=request.user)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

# Создание комментария
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request):
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# Получение комментариев по посту
@api_view(['GET'])
def get_post_comments(request, post_id):
    comments = Comment.objects.filter(post__id=post_id).order_by('-created_at')
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)

#likes
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        post.likes += 1
        post.save()
        return Response({'message': 'Liked!', 'likes': post.likes})
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=404)

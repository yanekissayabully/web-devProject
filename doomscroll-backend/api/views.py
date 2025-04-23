from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import Post, Comment, Profile
from django.contrib.auth.models import User
from .serializers import PostSerializer, CommentSerializer, RegisterSerializer, ProfileSerializer

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import Like
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes


@method_decorator(csrf_exempt, name='dispatch')
class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_posts(request):
    posts = Post.objects.all().order_by('-created_at')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


class MyPostsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = Post.objects.filter(author=request.user)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request):
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
def get_post_comments(request, post_id):
    comments = Comment.objects.filter(post__id=post_id).order_by('-created_at')
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({'error': 'Пост не найден'}, status=404)

    # Проверяем: уже лайкал?
    if Like.objects.filter(user=request.user, post=post).exists():
        return Response({'error': 'Ты уже лайкал'}, status=400)

    # Если не лайкал — лайкаем
    Like.objects.create(user=request.user, post=post)
    return Response({'message': 'Лайк поставлен'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_profile(request):
    profile, created = Profile.objects.get_or_create(user=request.user)
    serializer = ProfileSerializer(profile)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_my_profile(request):
    profile = Profile.objects.get(user=request.user)
    serializer = ProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)



@api_view(['GET'])
def get_profile_by_username(request, username):
    try:
        user = User.objects.get(username=username)
        profile = Profile.objects.get(user=user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
    except:
        return Response({'error': 'User not found'}, status=404)

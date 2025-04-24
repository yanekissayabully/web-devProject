from mailbox import Message
from threading import Thread
from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import Post, Comment, Profile
from django.contrib.auth.models import User
from .serializers import (
    PostSerializer, CommentSerializer, RegisterSerializer, ProfileSerializer,
    ThreadSerializer, MessageSerializer, ThreadDisplaySerializer
)
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes
from .models import Follow
from .serializers import ThreadSerializer, MessageSerializer



@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
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
@parser_classes([MultiPartParser, FormParser])  # добавим это
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
        post.likes += 1
        post.save()
        return Response({'message': 'Liked!', 'likes': post.likes})
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_profile(request):
    profile, created = Profile.objects.get_or_create(user=request.user)
    serializer = ProfileSerializer(profile)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_my_profile(request):
    profile = Profile.objects.get(user=request.user)
    serializer = ProfileSerializer(profile, data=request.data)
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_follow_counts(request, username):
    try:
        user = User.objects.get(username=username)
        followers = Follow.objects.filter(following=user).count()
        following = Follow.objects.filter(follower=user).count()
        return Response({'followers': followers, 'following': following})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user(request, username):
    try:
        to_follow = User.objects.get(username=username)
        if to_follow == request.user:
            return Response({'error': 'Нельзя подписаться на самого себя'}, status=400)
        Follow.objects.get_or_create(follower=request.user, following=to_follow)
        return Response({'message': f'Подписка на {username} успешна'})
    except User.DoesNotExist:
        return Response({'error': 'Пользователь не найден'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unfollow_user(request, username):
    try:
        to_unfollow = User.objects.get(username=username)
        Follow.objects.filter(follower=request.user, following=to_unfollow).delete()
        return Response({'message': f'Отписка от {username} успешна'})
    except User.DoesNotExist:
        return Response({'error': 'Пользователь не найден'}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_follow_status(request, username):
    try:
        user = User.objects.get(username=username)
        is_following = Follow.objects.filter(follower=request.user, following=user).exists()
        return Response({'is_following': is_following})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


@api_view(['POST'])
@permission_classes([AllowAny])
def get_or_create_thread(request, username):
    try:
        print("request.user:", request.user)
        print("is_authenticated:", request.user.is_authenticated)
        print("username:", username)

        user2 = User.objects.get(username=username)
        user1 = request.user

        if user1 == user2:
            return Response({'error': 'Нельзя создать чат с самим собой'}, status=400)

        if user1.id > user2.id:
            user1, user2 = user2, user1

        thread, created = Thread.objects.get_or_create(user1=user1, user2=user2)
        print("thread:", thread, "created:", created)

        serializer = ThreadDisplaySerializer(thread)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'error': 'Пользователь не найден'}, status=404)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request, thread_id):
    try:
        thread = Thread.objects.get(id=thread_id)
        if request.user not in [thread.user1, thread.user2]:
            return Response({'error': 'Not allowed'}, status=403)

        messages = thread.messages.all().order_by('created_at')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    except Thread.DoesNotExist:
        return Response({'error': 'Thread not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request, thread_id):
    try:
        thread = Thread.objects.get(id=thread_id)
        if request.user not in [thread.user1, thread.user2]:
            return Response({'error': 'Not allowed'}, status=403)

        text = request.data.get('text')
        msg = Message.objects.create(thread=thread, sender=request.user, text=text)
        serializer = MessageSerializer(msg)
        return Response(serializer.data, status=201)
    except Thread.DoesNotExist:
        return Response({'error': 'Thread not found'}, status=404)

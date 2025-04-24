from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post, Comment, Profile, Thread, Message

# 🔹 Мини-сериалайзер для краткой инфы о юзере (для чатов и сообщений)
class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

# 🔹 Полный сериалайзер юзера (с аватаром)
class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar']

    def get_avatar(self, obj):
        try:
            return obj.profile.avatar.url if obj.profile.avatar else None
        except Profile.DoesNotExist:
            return None

# 🔹 Сериалайзер комментария
class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'text', 'created_at']

# 🔹 Сериалайзер поста
class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    likes = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'author', 'content', 'image', 'created_at', 'likes', 'comments']

    def get_likes(self, obj):
        return obj.like_set.count()

    def get_comments(self, obj):
        comments = Comment.objects.filter(post=obj).order_by('-created_at')
        return CommentSerializer(comments, many=True).data

# 🔹 Сериалайзер профиля
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['id', 'user', 'bio', 'doom_level', 'avatar', 'followers_count', 'following_count']

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()

# 🔹 Сериалайзер регистрации
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        Profile.objects.create(user=user)
        return user

# 🔹 Сериалайзер чата (thread)
class ThreadSerializer(serializers.ModelSerializer):
    user1 = UserMiniSerializer(read_only=True)
    user2 = UserMiniSerializer(read_only=True)

    class Meta:
        model = Thread
        fields = ['id', 'user1', 'user2']

# 🔹 Сериалайзер сообщения
class MessageSerializer(serializers.ModelSerializer):
    sender = UserMiniSerializer()

    class Meta:
        model = Message
        fields = ['id', 'thread', 'sender', 'text', 'created_at']


class ThreadDisplaySerializer(serializers.ModelSerializer):
    user1 = UserSerializer(read_only=True)
    user2 = UserSerializer(read_only=True)

    class Meta:
        model = Thread
        fields = ['id', 'user1', 'user2']

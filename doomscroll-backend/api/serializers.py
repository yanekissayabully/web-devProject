from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post, Comment, Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

#posti
class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Post
        fields = ['id','author','content','created_at']

#comments
class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'text', 'created_at']

#profil
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ['id', 'user', 'bio', 'doom_level']

#rega
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
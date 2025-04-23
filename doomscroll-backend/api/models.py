from django.db import models
from django.contrib.auth.models import User
# Create your models here.

def upload_avatar(instance, filename):
    return f'avatars/{instance.user.username}/{filename}'

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    doom_level = models.IntegerField(default=0)
    avatar = models.ImageField(upload_to=upload_avatar, blank=True, null=True)

    def __str__(self):
        return self.user.username
    
class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.author.username}: {self.content[:30]}..."
    
class Comment(models.Model):
    post = models.ForeignKey(Post, related_name="comments", on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author.username} на пост {self.post.id}"
    
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')  # Один лайк от одного юзера

    def __str__(self):
        return f'{self.user.username} liked post {self.post.id}'

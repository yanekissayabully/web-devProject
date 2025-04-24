from django.db import models
from django.contrib.auth.models import User

# Путь для загрузки аватарок
def upload_avatar(instance, filename):
    return f'avatars/{instance.user.username}/{filename}'

# Путь для загрузки изображений постов
def upload_post_image(instance, filename):
    return f'posts/{instance.author.username}/{filename}'

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    doom_level = models.IntegerField(default=0)
    avatar = models.ImageField(upload_to=upload_avatar, blank=True, null=True)
    followers = models.ManyToManyField('self', symmetrical=False, related_name='following', blank=True)

    def __str__(self):
        return self.user.username

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(blank=True)
    image = models.ImageField(upload_to='post_images/', blank=True, null=True)  # ← НОВОЕ ПОЛЕ
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

class Follow(models.Model):
    follower = models.ForeignKey(User, related_name='following', on_delete=models.CASCADE)
    following = models.ForeignKey(User, related_name='followers', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')

    def __str__(self):
        return f'{self.follower.username} → {self.following.username}'


class Thread(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='thread_user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='thread_user2')

    class Meta:
        unique_together = ('user1', 'user2')

    def __str__(self):
        return f"Chat: {self.user1.username} ↔ {self.user2.username}"

class Message(models.Model):
    thread = models.ForeignKey(Thread, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username}: {self.text[:20]}"

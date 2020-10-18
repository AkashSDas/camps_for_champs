from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


# ==============================
# Post Model
# ==============================
class Post(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField(blank=False)
    date_posted = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateField(auto_now=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    likes = models.ManyToManyField(User, related_name='likes', blank=True)
    dislikes = models.ManyToManyField(
        User, related_name='dislikes', blank=True)

    def __str__(self):
        return self.title

    # Total likes on a post
    def total_likes(self):
        return self.likes.count()

    # Total dislikes on a post
    def total_dislikes(self):
        return self.dislikes.count()

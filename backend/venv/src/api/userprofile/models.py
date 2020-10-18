from api.campplan.models import CampPlan
from api.campproduct.models import CampProduct
from django.contrib.auth import get_user_model
from django.db import models
from PIL import Image

User = get_user_model()


# ==============================
# UserProfile Model
# ==============================
class UserProfile(models.Model):
    MALE = 0
    FEMALE = 1
    TRANSGENDER = 2
    DONT_WANT_TO_ANS = 3
    GENDER_CHOICES = (
        (MALE, 'Male'),
        (FEMALE, 'Female'),
        (TRANSGENDER, 'Transgender'),
        (DONT_WANT_TO_ANS, "Don't want to answer"),
    )

    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    phone_number = models.CharField(max_length=50, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    gender = models.IntegerField(
        default=DONT_WANT_TO_ANS, choices=GENDER_CHOICES)

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    image = models.ImageField(
        unique=True, default='user_profile_images/default.png',
        upload_to='user_profile_images/', blank=True, null=True)

    # TODO: add feature of last camp plans & products bought

    def __str__(self):
        return self.user.username

    def save(self, *args, **kwargs):
        super(UserProfile, self).save(*args, **kwargs)

        # if user has a image
        if self.image:
            # Resizing the image for better performance
            img = Image.open(self.image.path)
            if img.height > 300 or img.width > 300:
                output_size = (300, 300)
                img.thumbnail(output_size)
                img.save(self.image.path)

from django.db import models


# =========================
# Gallery Model
# =========================
class Gallery(models.Model):
    image = models.ImageField(unique=True, default='gallery/default.png',
                              upload_to='gallery/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        # image filename 
        return self.image.name.split('/')[-1]

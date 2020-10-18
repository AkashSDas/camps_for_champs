from api.category.models import Category
from django.db import models


# ==============================
# Camp Product Model
# ==============================
class CampProduct(models.Model):
    name = models.CharField(max_length=128)
    description = models.CharField(max_length=256)
    price = models.FloatField()
    stock = models.IntegerField(default=0)

    image = models.ImageField(unique=True, default='camp_product_images/default.png',
                              upload_to='camp_product_images/', blank=True, null=True)

    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    # To round the self.price to 2 decimals
    def save(self, *args, **kwargs):
        self.price = round(self.price, 2)
        return super().save(*args, **kwargs)

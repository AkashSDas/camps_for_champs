from api.category.models import Category
from django.core.exceptions import ValidationError
from django.db import models


# =============================
# Camp Plan Model
# =============================
class CampPlan(models.Model):
    name = models.CharField(max_length=128, unique=True)
    description = models.CharField(max_length=256)
    price = models.FloatField()
    location = models.CharField(max_length=256)

    image = models.ImageField(unique=True, default='camp_plan_images/default.png',
                              upload_to='camp_plan_images/', blank=True, null=True)

    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, blank=True, null=True)

    # camp start and end dates
    start_date = models.DateField()
    end_date = models.DateField()

    is_active = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    # To round the self.price to 2 decimals
    def save(self, *args, **kwargs):
        self.price = round(self.price, 2)
        return super().save(*args, **kwargs)

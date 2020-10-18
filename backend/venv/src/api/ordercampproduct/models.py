from api.campproduct.models import CampProduct
from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


# ===========================
# OrderCampProduct Model
# ===========================
class OrderCampProduct(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    products = models.ManyToManyField(CampProduct)
    product_names = models.CharField(max_length=1024, blank=True, null=True)
    total_products = models.IntegerField(default=0)
    transaction_id = models.CharField(max_length=256, default=0)
    total_amount = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username

    # To round the self.total_amount to 2 decimals
    def save(self, *args, **kwargs):
        self.total_amount = round(float(self.total_amount), 2)
        return super().save(*args, **kwargs)

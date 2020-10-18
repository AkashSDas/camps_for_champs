from django.db import models


# =========================
# Category Model
# =========================
class Category(models.Model):
    # Type of sections
    NO_SECTION = 0
    CAMP_PRODUCT = 1
    CAMP_PLAN = 2
    SECTION_CHOICES = (
        (NO_SECTION, 'no_category'),
        (CAMP_PRODUCT, 'camp_product'),
        (CAMP_PLAN, 'camp_plan')
    )

    name = models.CharField(max_length=128, unique=True)
    description = models.CharField(max_length=256)
    section = models.IntegerField(default=NO_SECTION, choices=SECTION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

from rest_framework import serializers

from .models import CampPlan


# ==============================
# Camp Plan Serializer
# ==============================
class CampPlanSerializer(serializers.HyperlinkedModelSerializer):
    # to get image url in GET request
    image = serializers.ImageField(
        max_length=None, allow_empty_file=False, allow_null=True, required=False)

    class Meta:
        model = CampPlan
        fields = (
            'id',
            'name',
            'description',
            'price',
            'start_date',
            'end_date',
            'is_active',
            'image',
            'category',
            'location'
        )

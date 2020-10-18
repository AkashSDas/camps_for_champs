from rest_framework import serializers

from .models import CampProduct


# ============================
# Camp Product Serializer
# ============================
class CampProductSerializer(serializers.HyperlinkedModelSerializer):
    # to get image url in GET request
    image = serializers.ImageField(
        max_length=None, allow_empty_file=False, allow_null=True, required=False)

    class Meta:
        model = CampProduct
        fields = (
            'id',
            'name',
            'description',
            'price',
            'stock',
            'image',
            'category'
        )

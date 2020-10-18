from rest_framework import serializers

from .models import Gallery


# ===========================
# Gallery Serializer
# ===========================
class GallerySerializer(serializers.HyperlinkedModelSerializer):
    # to get image url in GET request
    image = serializers.ImageField(
        max_length=None, allow_empty_file=False, allow_null=True, required=False)

    class Meta:
        model = Gallery
        fields = (
            'image',
        )

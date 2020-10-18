from rest_framework import serializers

from .models import Category


# ===========================
# Category Serializer
# ===========================
class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = (
            'name',
            'description',
            'section'
        )

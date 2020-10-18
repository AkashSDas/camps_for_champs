from rest_framework import serializers

from .models import OrderCampProduct


# ==============================
# OrderCampProduct Serializer
# ==============================
class OrderCampProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = OrderCampProduct
        fields = (
            'id',
            'user',
            'products',
            'total_products',
            'transaction_id',
            'total_amount'
        )

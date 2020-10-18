from rest_framework import serializers

from .models import OrderCampPlan


# ===========================
# OrderCampPlan Serializer
# ===========================
class OrderCampPlanSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = OrderCampPlan
        fields = (
            'id',
            'user',
            'plans',
            'total_plans',
            'transaction_id',
            'total_amount'
        )

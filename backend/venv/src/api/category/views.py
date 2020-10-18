from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from .models import Category
from .serializers import CategorySerializer


# ========================
# Category ViewSet
# ========================
class CategoryViewSet(viewsets.ModelViewSet):
    # Only admin can do CUD (from CRUD) operations
    permission_classes_by_action = {
        'create': [IsAdminUser],
        'update': [IsAdminUser],
        'destroy': [IsAdminUser],
        'partial_update': [IsAdminUser]
    }

    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer

    # handle permissions
    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except:
            return [permission() for permission in self.permission_classes]

from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from .models import Gallery
from .serializers import GallerySerializer


# =============================
# Home view
# =============================
def home_view(req, *args, **kwargs):
    return JsonResponse({'project': 'CampsForChamps'})


# =============================
# Gallery ViewSet
# =============================
class GalleryViewSet(viewsets.ModelViewSet):
    # Only admin can do CUD (from CRUD) operations
    permission_classes_by_action = {
        'create': [IsAdminUser],
        'update': [IsAdminUser],
        'destroy': [IsAdminUser],
        'partial_update': [IsAdminUser]
    }

    queryset = Gallery.objects.all().order_by('-created_at')
    serializer_class = GallerySerializer

    # handle permissions
    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except:
            return [permission() for permission in self.permission_classes]

from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from .models import UserProfile
from .permissions import IsOwner
from .serializers import UserProfileSerializer


# ==============================
# UserProfile ViewSet
# ==============================
class UserProfileViewSet(viewsets.ModelViewSet):
    # owner can only do update and partial_update operations
    permission_classes_by_action = {
        'create': [IsAdminUser],
        'update': [IsOwner],
        'destroy': [IsAdminUser],
        'partial_update': [IsOwner],
    }

    queryset = UserProfile.objects.all().order_by('id')
    serializer_class = UserProfileSerializer

    # handle permissions
    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except:
            return [permission() for permission in self.permission_classes]

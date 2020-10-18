from datetime import date

from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from .models import CampPlan
from .serializers import CampPlanSerializer


# ===========================
# Camp Plan ViewSet
# ===========================
class CampPlanViewSet(viewsets.ModelViewSet):
    # Only admin can do CUD (from CRUD) operations
    permission_classes_by_action = {
        'create': [IsAdminUser],
        'update': [IsAdminUser],
        'destroy': [IsAdminUser],
        'partial_update': [IsAdminUser]
    }

    queryset = CampPlan.objects.all().order_by('name')
    serializer_class = CampPlanSerializer

    # overriding create method to validate camp start & end dates
    def create(self, request, *agrs, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # validating camp start & end dates
            start_date = serializer.validated_data.get('start_date')
            end_date = serializer.validated_data.get('end_date')

            if start_date > end_date:
                return JsonResponse({'error': 'Camp start date should be less than camp end date'})
            if date.today() > start_date:
                return JsonResponse({'error': 'Camp start date should be more than current date'})
            if date.today() > end_date:
                return JsonResponse({'error': 'Camp end date should be more than current date'})

            serializer.save()
            return JsonResponse({'success': 'Successfully created camp plan'})
        else:
            return JsonResponse({'error': serializer.errors})

    # handle permissions
    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except:
            return [permission() for permission in self.permission_classes]

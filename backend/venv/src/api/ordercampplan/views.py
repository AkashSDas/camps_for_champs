from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from .models import OrderCampPlan
from .serializers import OrderCampPlanSerializer

User = get_user_model()


# ===========================
# OrderCampPlan ViewSet
# ===========================
class OrderCampPlanViewSet(viewsets.ModelViewSet):
    # Only admin can do CUD (from CRUD) operations
    permission_classes_by_action = {
        'create': [IsAdminUser],
        'update': [IsAdminUser],
        'destroy': [IsAdminUser],
        'partial_update': [IsAdminUser]
    }

    queryset = OrderCampPlan.objects.all().order_by('id')
    serializer_class = OrderCampPlanSerializer

    # handle permissions
    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except:
            return [permission() for permission in self.permission_classes]


# validate user
def validate_user_session(id, session_token):
    try:
        user = User.objects.get(pk=id)
        if user.session_token == session_token:
            return True
        return False
    except User.DoesNotExist:
        return False


# ===========================
# Add order view
# ===========================
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def add(request, id, token, *args, **kwargs):
    # token: session token
    if not validate_user_session(id, token):
        return JsonResponse({'error': 'Please re-login', 'code': '1'})

    user_id = id

    plans = request.POST['plans']
    plan_names = request.POST['plan_names']
    total_plans = request.POST['total_plans']
    transaction_id = request.POST['transaction_id']
    total_amount = request.POST['total_amount']

    # plans will a string like => 3,4,5 (numbers are plans ids)
    plans = plans.split(',')
    plans = [int(p) for p in plans]

    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'})

    order_camp_plan = OrderCampPlan(user=user, plan_names=plan_names,
                                    total_plans=total_plans, transaction_id=transaction_id, total_amount=total_amount)
    order_camp_plan.save()

    # adding ids of plans
    for p in plans:
        order_camp_plan.plans.add(p)
    return JsonResponse({'success': True, 'error': False, 'message': 'Camp plan order placed successfully'})

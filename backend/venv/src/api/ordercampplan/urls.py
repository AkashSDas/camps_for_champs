from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'', views.OrderCampPlanViewSet)

urlpatterns = [
    path('add/<str:id>/<str:token>/', views.add, name='add_camp_plan_order'),
    path('', include(router.urls)),
]

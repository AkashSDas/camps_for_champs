from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'', views.OrderCampProductViewSet)

urlpatterns = [
    path('add/<str:id>/<str:token>/', views.add, name='add_camp_product_order'),
    path('', include(router.urls)),
]

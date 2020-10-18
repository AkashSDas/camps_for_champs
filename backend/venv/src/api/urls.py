from django.urls import include, path

from .views import GalleryViewSet, home_view

gallery_view = GalleryViewSet.as_view({'get': 'list'})

urlpatterns = [
    path('', home_view, name='api.home_view'),
    path('gallery/', gallery_view, name='api.gallery_view'),
    path('user/', include('api.user.urls')),
    path('category/', include('api.category.urls')),
    path('camp-product/', include('api.campproduct.urls')),
    path('camp-plan/', include('api.campplan.urls')),
    path('profile/', include('api.userprofile.urls')),
    path('order-camp-product/', include('api.ordercampproduct.urls')),
    path('order-camp-plan/', include('api.ordercampplan.urls')),
    path('post/', include('api.post.urls')),
    path('payment/', include('api.payment.urls')),
]

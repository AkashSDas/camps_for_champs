from django.urls import include, path
from rest_framework import routers

from .views import (CommentViewSet, PostViewSet, disliked_post_view,
                    liked_post_view)

router = routers.DefaultRouter()
router.register(r'post', PostViewSet)
router.register(r'comment', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('post/<int:post_id>/<str:user_id>/liked/',
         liked_post_view, name='liked_post'),
    path('post/<int:post_id>/<str:user_id>/disliked/',
         disliked_post_view, name='disliked_post'),
]

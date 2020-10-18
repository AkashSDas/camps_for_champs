from django.urls import include, path
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

from . import views

router = routers.DefaultRouter()
router.register(r'', views.UserViewSet)

urlpatterns = [
    path('login/', views.signin, name='login'),
    path('<int:id>/logout/', views.signout, name='logout'),
    path('change-password/', views.ChangePasswordView.as_view(),
         name='password_chage'),
    path('password_reset/', include('django_rest_passwordreset.urls'),
         name='password_reset'),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('', include(router.urls)),
]


'''
     *** Password reset urls (django_rest_passwordreset) ***
     
     password_reset/ 
          => this needs USERNAME_FIELD (here email) for whom you want to 
             change the password 
             
     password_reset/confirm/ 
          => this will ask for the password reset token and new password.
'''

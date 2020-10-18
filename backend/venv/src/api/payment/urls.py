from django.urls import include, path

from . import views

urlpatterns = [
    path('braintree-token/<str:id>/<str:token>/',
         views.generate_braintree_token, name='generate_braintree_token'),
    path('braintree-payment/<str:id>/<str:token>/',
         views.braintree_payment, name='braintree_payment'),
    path('stripe-payment/<str:id>/<str:token>/',
         views.stripe_payment, name='stripe_payment'),
]

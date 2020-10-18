import braintree
import stripe
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


# validate session token
def validate_user_session(id, token):
    User = get_user_model()
    try:
        user = User.objects.get(pk=id)
        if user.session_token == token:
            return True
        return False
    except User.DoesNotExist:
        return False


# ==========================
# Braintree Payment
# ==========================

# braintree payment gateway
gateway = braintree.BraintreeGateway(
    braintree.Configuration(
        environment=braintree.Environment.Sandbox,
        merchant_id='your_merchant_id',
        public_key='your_public_key',
        private_key='your_private_key'
    )
)


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def generate_braintree_token(request, id, token, *args, **kwargs):
    if not validate_user_session(id, token):
        return JsonResponse({'error': 'Invalid session, Please login again'})
    return JsonResponse({'clientToken': gateway.client_token.generate(), 'success': True})


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def braintree_payment(request, id, token, *args, **kwargs):
    if not validate_user_session(id, token):
        return JsonResponse({'error': 'Invalid session, Please login again'})

    nonce_from_the_client = request.POST['paymentMethodNonce']
    amount_from_the_client = request.POST['amount']

    result = gateway.transaction.sale({
        'amount': amount_from_the_client,
        'payment_method_nonce': nonce_from_the_client,
        'options': {
            'submit_for_settlement': True
        }
    })

    if result.is_success:
        return JsonResponse({'success': result.is_success, 'transaction': {'id': result.transaction.id, 'amount': result.transaction.amount}})
    else:
        return JsonResponse({'error': True, 'success': False})


# ==========================
# Stripe Payment
# ==========================
# your strip sk_ key
stripe.api_key = 'sk_test_...'


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def stripe_payment(request, id, token, *args, **kwargs):
    if not validate_user_session(id, token):
        return JsonResponse({'error': 'Invalid session, Please login again'})

    try:
        amount = int(request.POST['amount'])
        currency = 'usd'
        receipt_email = request.user.email
        customer_id = int(request.user.id)
        description = f"Description: {request.POST['product_names']}"
        source = request.POST['source']

        customer = stripe.Customer.create(
            name=request.user.username,
            email=receipt_email,
            source=source,
            description=description
        )

        charge = stripe.Charge.create(
            amount=amount,
            currency=currency,
            receipt_email=receipt_email,
            customer=customer.id,
            description=description
        )

        stripe_id = charge.get('id', None)
        pay_status = charge.get('status', 'pending')

        return JsonResponse({'status': pay_status, 'stripe_id': stripe_id, 'amount': amount})

    except stripe.error.CardError as e:
        body = e.json_body
        err = body.get('error', {})
        print('Status is: %s' % e.http_status)
        print('Type is: %s' % err.get('type'))
        print('Code is: %s' % err.get('code'))
        print('Message is %s' % err.get('message'))
        return Response(err.get('message'))
    except stripe.error.RateLimitError as e:
        # Too many requests made to the API too quickly
        return Response("The API was not able to respond, try again.")
    except stripe.error.InvalidRequestError as e:
        # invalid parameters were supplied to Stripe's API
        return Response("Invalid parameters, unable to process payment. {}".format(e))
    except stripe.error.AuthenticationError as e:
        # Authentication with Stripe's API failed
        # (maybe you changed API keys recently)
        return Response("stripe.error.AuthenticationError {}".format(e))
    except stripe.error.APIConnectionError as e:
        # Network communication with Stripe failed
        return Response("Network communication failed, try again.")
    except stripe.error.StripeError as e:
        # Display a very generic error to the user, and maybe
        # send yourself an email
        return Response("Internal Error, contact support.")

    # Something else happened, completely unrelated to Stripe
    except Exception as e:
        return Response('Unable to process payment, try again. {}'.format(e))

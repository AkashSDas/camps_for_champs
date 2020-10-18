import random
import re

from django.contrib.auth import get_user_model, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, viewsets
from rest_framework.authentication import get_authorization_header
from rest_framework.permissions import AllowAny, IsAuthenticated

from .permissions import IsOwnerOrReadOnly
from .serializers import ChangePasswordSerializer, UserSerializer

User = get_user_model()


# ============================
# Generate session token
# ============================
# here length is same as in User model
def generate_session_token(length=10):
    return ''.join(random.SystemRandom().choice([chr(i) for i in range(97, 123)] + [str(i) for i in range(10)]) for _ in range(length))


# ============================
# Sign In
# ============================
@csrf_exempt
def signin(request, *args, **kwargs):
    if not request.method == 'POST':
        return JsonResponse({'error': 'Send a post request with valid parameters'})

    email = request.POST['email']
    password = request.POST['password']
    # confirm_password = request.POST['confirm_password']

    # validating email
    if not re.match('^[\w\.\+\-]+\@[\w]+\.[a-z]{2,3}$', email):
        return JsonResponse({'error': 'Enter a valid email address'})

    # validating password
    # if len(str(password)) < 8:
    #     return JsonResponse({'error': 'Password must be atleast 8 characters long'})
    # if password != confirm_password:
    #     return JsonResponse({'error': 'Password and confirm password must be same'})

    # user model
    User = get_user_model()

    try:
        user = User.objects.get(email=email)
        if user.check_password(password):
            user_dict = User.objects.filter(email=email).values().first()
            user_dict.pop('password')

            if user.session_token != '0':
                user.session_token = '0'
                user.save()
                return JsonResponse({'error': 'Previous session exists'})

            token = generate_session_token()
            user.session_token = token
            user.save()
            login(request, user)
            return JsonResponse({'token': token, 'user': user_dict})
        else:
            return JsonResponse({'error': 'Invalid password'})
    except User.DoesNotExist:
        return JsonResponse({'error': 'Invalid email'})


# ============================
# Sign Out
# ============================
def signout(request, id):
    logout(request)

    User = get_user_model()

    try:
        user = User.objects.get(pk=id)
        user.session_token = '0'
        user.save()
    except User.DoesNotExist:
        return JsonResponse({'error': 'Invalid user id'})
    return JsonResponse({'success': 'Logout success'})


# ====================================
# User viewset
# ====================================
class UserViewSet(viewsets.ModelViewSet):
    permission_classes_by_action = {
        'create': [AllowAny],
        'update': [IsOwnerOrReadOnly],
        'destroy': [IsOwnerOrReadOnly],
        'partial_update': [IsOwnerOrReadOnly]
    }

    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer

    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]


# ====================================
# Change password (not password reset)
# ====================================
class ChangePasswordView(generics.UpdateAPIView):
    model = User
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.obj = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # check old password
            if not self.obj.check_password(serializer.data.get('old_password')):
                return JsonResponse({'error': 'Wrong old password'})

            # setting new password
            self.obj.set_password(serializer.data.get('new_password'))
            self.obj.save()
            return JsonResponse({'success': 'Password successfully changed'})
        else:
            # improve response
            return JsonResponse({'error': serializer.errors})

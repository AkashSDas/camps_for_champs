from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager,
                                        PermissionsMixin)
from django.core.mail import EmailMultiAlternatives
from django.db import models
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created


# ===========================
# Custom user manager model
# ===========================
class UserManager(BaseUserManager):

    # creating user
    def create_user(self, username, email, password=None, is_active=True, is_staff=False, is_admin=False):
        if not username:
            return ValueError('User must have a username')
        if not email:
            return ValueError('User must have an email address')
        if not password:
            return ValueError('User must have a password')

        email = self.normalize_email(email)
        user_obj = self.model(username=username, email=email)
        user_obj.set_password(password)

        user_obj.is_active = is_active
        user_obj.is_staff = is_staff
        user_obj.is_admin = is_admin

        user_obj.save(using=self._db)
        return user_obj

    # creating staff
    def create_staff(self, username, email, password=None):
        user = self.create_user(
            username=username, email=email, password=password, is_staff=True)
        return user

    # creating superuser
    def create_superuser(self, username, email, password=None):
        user = self.create_user(
            username=username, email=email, password=password, is_staff=True, is_admin=True)
        return user


# ===========================
# Custom user model
# ===========================
class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=20, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    session_token = models.CharField(max_length=10, default=0)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [
        'username',
    ]

    objects = UserManager()

    def __str__(self):
        return self.username

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True


# ===========================
# Password reset tokens
# ===========================

'''
    *** Issues with password reset tokens ***

    If a user is logged in then too he/she can ask for email password 
    reset.
    
    Also if person A has requested for password reset via email and 
    person B has got person A's password reset token then he/she can 
    reset the password of person A using this token(before it expires).
'''


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    # send an e-mail to the user
    context = {
        'current_user': reset_password_token.user,
        'username': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        'reset_password_url': f"{reverse('password_reset:reset-password-request')}?token={reset_password_token.key}",
        'token': reset_password_token.key
    }

    # render email text
    email_html_message = f'''
        Password reset, Django Rest Framework Authentication API

        Password reset token: {context['token']}
        Copy & paste this token in the token input field while resetting your password
    '''

    msg = EmailMultiAlternatives(
        # title
        'Password reset, Django Rest Framework Authentication API',
        # message
        email_html_message,
        # from
        'noreply@somehost.local',
        # to
        [reset_password_token.user.email]
    )

    msg.send()

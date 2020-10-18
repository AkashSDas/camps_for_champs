from django.apps import AppConfig


class UserprofileConfig(AppConfig):
    name = 'api.userprofile'

    def ready(self):
        from . import signals

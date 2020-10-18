from rest_framework.permissions import BasePermission


class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        try:
            return obj.author == request.user
        except:
            # for FluentComment ('FluentComment' object has no attribute 'author')
            return obj.user == request.user

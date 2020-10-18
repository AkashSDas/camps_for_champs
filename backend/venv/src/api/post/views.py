from datetime import datetime

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.contenttypes.models import ContentType
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from fluent_comments.models import FluentComment
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Post
from .permissions import IsOwnerOrReadOnly
from .serializers import CommentSerializer, PostSerializer

User = get_user_model()


# ==============================
# Post ViewSet
# ==============================
class PostViewSet(viewsets.ModelViewSet):
    permission_classes_by_action = {
        'create': [IsAuthenticated],
        'update': [IsAuthenticated, IsOwnerOrReadOnly],
        'destroy': [IsAuthenticated, IsOwnerOrReadOnly],
        'partial_update': [IsAuthenticated, IsOwnerOrReadOnly]
    }

    queryset = Post.objects.all().order_by('-last_modified')
    serializer_class = PostSerializer

    # handle permissions
    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]


# ==============================
# Like post view
# ==============================
@csrf_exempt
@permission_classes([IsAuthenticated, ])
def liked_post_view(request, post_id, user_id, *args, **kwargs):
    try:
        post = Post.objects.filter(pk=post_id).first()

        # Checking if user has already liked or disliked the post
        already_liked = post.likes.filter(id=user_id).exists()
        already_disliked = post.dislikes.filter(id=user_id).exists()

        user = User.objects.filter(id=user_id).first()

        # checking if the user has already liked the video or
        # not and take actions based on that
        if not already_liked and not already_disliked:
            post.likes.add(user)
        elif already_liked and not already_disliked:
            post.likes.remove(user)
        elif not already_liked and already_disliked:
            post.dislikes.remove(user)
            post.likes.add(user)

        return JsonResponse({'success': True, 'error': False})
    except:
        return JsonResponse({'error': True, 'success': False})


# ==============================
# Dislike post view
# ==============================
@csrf_exempt
@permission_classes([IsAuthenticated, ])
def disliked_post_view(request, post_id, user_id, *args, **kwargs):
    try:
        post = Post.objects.filter(pk=post_id).first()

        # Checking if user has already liked or disliked the post
        already_liked = post.likes.filter(id=user_id).exists()
        already_disliked = post.dislikes.filter(id=user_id).exists()

        user = User.objects.filter(id=user_id).first()

        # checking if the user has already disliked the video or
        # not and take actions based on that
        if not already_liked and not already_disliked:
            post.dislikes.add(user)
        elif already_disliked and not already_liked:
            post.dislikes.remove(user)
        elif not already_disliked and already_liked:
            post.likes.remove(user)
            post.dislikes.add(user)

        return JsonResponse({'success': True, 'error': False})
    except:
        return JsonResponse({'error': True, 'success': False})


# ==============================
# Comment ViewSet
# ==============================
class CommentViewSet(viewsets.ModelViewSet):
    # owner can only do update and partial_update operations
    permission_classes_by_action = {
        'create': [IsAuthenticated],
        'update': [IsOwnerOrReadOnly],
        'destroy': [IsOwnerOrReadOnly],
        'partial_update': [IsOwnerOrReadOnly],
    }

    queryset = FluentComment.objects.all()
    serializer_class = CommentSerializer

    # overriding create method to create comment and reply
    # using the same method
    def create(self, request, *args, **kwargs):
        data = self.request.data
        comment = data['comment']
        post = data['post']
        if 'parent' in data:
            parent = data['parent']
        else:
            parent = None

        submit_date = datetime.now()
        content = ContentType.objects.get(model='post').pk
        comment = FluentComment.objects.create(object_pk=post, comment=comment, submit_date=submit_date,
                                               content_type_id=content, user_id=self.request.user.id, site_id=settings.SITE_ID, parent_id=parent)

        serializer = CommentSerializer(
            comment, context={'request': request})
        return Response(serializer.data)
        # return JsonResponse({'comment_data': serializer.data})

    # overriding update method so that only user can update 
    # only their comment
    def update(self, request, *args, **kwargs):
        comment_id = self.request.data.get('id')

        try:
            comment = FluentComment.objects.filter(pk=comment_id).first()
        except FluentComment.DoesNotExist:
            return JsonResponse({'error': True, 'message': 'Comment does not exist'})

        if request.user != comment.user:
            return JsonResponse({
                'success': False,
                'error': True,
                'message': "You don't have permission to do that"
            })

        comment.comment = self.request.data.get('comment')
        comment.save()
        return JsonResponse({'success': True})

    # overriding list method to get username & user id in response
    def list(self, request, *args, **kwargs):
        # instead of sending just comment user id, modifying the list
        # method to send comment username and that user's id
        queryset = self.filter_queryset(self.get_queryset())
        send_queryset = []
        for query in queryset:
            send_queryset.append({
                'id': query.id,
                'comment': query.comment,
                'user_id': query.user.id,
                'username': query.user.username
            })
        # return super(CommentViewSet, self).list(request, *args, **kwargs)
        return Response(send_queryset)

    # handle permissions
    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except:
            return [permission() for permission in self.permission_classes]

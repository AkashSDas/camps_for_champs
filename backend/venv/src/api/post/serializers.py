from django.contrib.auth import get_user_model
from fluent_comments.models import FluentComment
from rest_framework import serializers

from .models import Post

User = get_user_model()


# For replies in a comment
class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(
            value,
            context=self.context)
        return serializer.data


# ==============================
# Comment Serializer
# ==============================
class CommentSerializer(serializers.ModelSerializer):
    # replies to comments
    children = RecursiveField(many=True)

    class Meta:
        model = FluentComment
        fields = (
            'id',
            'comment',
            'children',
            'user'
        )


# ==============================
# Post Serializer
# ==============================
class PostSerializer(serializers.HyperlinkedModelSerializer):
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            'id',
            'title',
            'description',
            'content',
            'date_posted',
            'last_modified',
            'author',
            'comments',
            'likes',
            'dislikes',
        )

    def get_comments(self, obj):
        post_comment = FluentComment.objects.filter(
            object_pk=obj.id, parent_id=None).order_by('-submit_date')
        serializer = CommentSerializer(post_comment, many=True)

        for comment in serializer.data:
            # since in CommentSerializer Meta class 'user' is last
            # therefore in serializer.data each OrderedDict's last element
            # will be ('user', `user's id`)
            comment['user_id'] = comment['user']
            comment['username'] = User.objects.filter(
                pk=comment['user']).first().username
            comment.pop('user')

            # doing the same thing for replies on a comment (for 1st level of
            # children only)
            if comment['children']:
                for reply in comment['children']:
                    reply['user_id'] = reply['user']
                    reply['username'] = User.objects.filter(
                        pk=reply['user']).first().username
                    reply.pop('user')

        return serializer.data

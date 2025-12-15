from rest_framework import serializers
from .models import ContactMessage


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'subject', 'message']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)


class ContactMessageSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True, allow_null=True)
    replied_by_name = serializers.CharField(source='replied_by.name', read_only=True, allow_null=True)

    class Meta:
        model = ContactMessage
        fields = [
            'id', 'user', 'user_name', 'name', 'email', 'subject', 'message',
            'status', 'admin_reply', 'replied_at', 'replied_by', 'replied_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class ContactMessageReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['admin_reply', 'status']

    def update(self, instance, validated_data):
        from django.utils import timezone
        request = self.context.get('request')

        if validated_data.get('admin_reply'):
            instance.replied_at = timezone.now()
            if request:
                instance.replied_by = request.user

        return super().update(instance, validated_data)

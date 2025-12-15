from django.contrib import admin
from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['subject', 'name', 'email', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['user', 'name', 'email', 'subject', 'message', 'created_at']

    fieldsets = (
        ('Message Details', {
            'fields': ('user', 'name', 'email', 'subject', 'message', 'created_at')
        }),
        ('Response', {
            'fields': ('status', 'admin_reply', 'replied_by', 'replied_at')
        }),
    )

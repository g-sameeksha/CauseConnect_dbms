from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    # Fields to display in the Django admin panel
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_staff', 'is_superuser')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('email', 'first_name', 'last_name', 'role')

    # Fields for the admin edit page (Grouped sections)
    fieldsets = (
        ("Personal Info", {"fields": ("email", "first_name", "last_name", "phone_number", "role")}),
        ("Permissions", {"fields": ("is_staff", "is_superuser", "is_active", "groups", "user_permissions")}),
        ("Important Dates", {"fields": ("last_login", "date_joined")}),
    )

    # Fields when creating a new user from the admin panel
    add_fieldsets = (
        ("Create New User", {
            "classes": ("wide",),
            "fields": ("email", "first_name", "last_name", "role", "password1", "password2"),
        }),
    )

    ordering = ('email',)  # Order users by email
    filter_horizontal = ("groups", "user_permissions")  # Enable group selection in admin

# Register the CustomUser model with the CustomUserAdmin settings
admin.site.register(CustomUser, CustomUserAdmin)

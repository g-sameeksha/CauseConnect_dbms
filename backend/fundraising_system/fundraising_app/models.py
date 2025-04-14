from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from django.contrib.auth.models import BaseUserManager
from django.core.validators import RegexValidator
import random
import string

class CustomUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, role='donor', password=None, **extra_fields):
        """Creates and saves a regular user with the given details."""
        if not email:
            raise ValueError("The Email field must be set")
        if not first_name:
            raise ValueError("First name is required")
        if not last_name:
            raise ValueError("Last name is required")
        if role not in ["donor", "representative", "admin"]:
            raise ValueError("Role is required")

        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        first_name = extra_fields.pop("first_name", "Super")
        last_name = extra_fields.pop("last_name", "User")
        role = extra_fields.pop("role", "admin")

        return self.create_user(email, first_name, last_name, role, password, **extra_fields)


class CustomUser(AbstractUser):
    USER_ROLES = (
        ('donor', 'Donor'),
        ('organization_admin', 'Organization Admin'),
        ('admin', 'Admin'),
    )

    email = models.EmailField(unique=True)  
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True, default="")
    role = models.CharField(max_length=20, choices=USER_ROLES, default='donor')
    username = None  

    first_name = models.CharField(max_length=150, blank=False, null=False)
    last_name = models.CharField(max_length=150, blank=False, null=False)

    USERNAME_FIELD = 'email'  
    REQUIRED_FIELDS = ['first_name', 'last_name', 'role']

    objects = CustomUserManager()  # Use custom manager

    def __str__(self):
        return f"{self.email} ({self.role})"
    role = models.CharField(max_length=20, choices=USER_ROLES, default='donor')


class Organization(models.Model):
    registration_number = models.CharField(max_length=50, primary_key=True)  # Govt. registration ID
    name = models.CharField(max_length=200)
    about = models.TextField(null=True, blank=True)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(
            max_length=15,
            validators=[RegexValidator(r'^\+?1?\d{9,15}$', message="Enter a valid phone number.")]
        )    
    address = models.TextField()
    image = models.ImageField(upload_to='organization_images/', null=True, blank=True)
    is_verified = models.BooleanField(default=False)  
    approval_status = models.CharField(
        max_length=10,
        choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')],
        default='pending'
    )

    def __str__(self):
        return self.name

class Donor(models.Model):
    donor_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="donor_profile")
    dob = models.DateField(null=True, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)

    def __str__(self):
        return f"Donor: {self.user.first_name} {self.user.last_name}"
    


class OrganizationAdmin(models.Model):
    admin_id = models.AutoField(primary_key=True)
    is_authorized = models.BooleanField(default=False)
    approval_status = models.CharField(
        max_length=10,
        choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')],
        default='pending'
    )
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="admin_profile")
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE,related_name="organization")  # Many admins → One organization

    def __str__(self):
        return f"Admin: {self.user.email} : {self.organization} ({self.approval_status})"


# def generate_unique_cause_number():
#     while True:
#         cause_number = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
#         if not Cause.objects.filter(cause_number=cause_number).exists():
#             return cause_number

class Cause(models.Model):
    cause_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    raised_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, default=0.00)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='cause_images/', null=True, blank=True)
    status = models.CharField(max_length=10, choices=[("active", "Active"), ("inactive", "Inactive"), ("stopped", "Stopped")], default="active")

    def __str__(self):
        return self.title



class Donation(models.Model):
    donation_id = models.CharField(max_length=50, unique=True, primary_key=True)  # Changed to CharField
    donor = models.ForeignKey(Donor, on_delete=models.CASCADE)
    cause = models.ForeignKey(Cause, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=50)
    payment_id = models.CharField(max_length=100,default="")

    def __str__(self):
        return f"{self.donor} donated {self.amount} to {self.cause}"

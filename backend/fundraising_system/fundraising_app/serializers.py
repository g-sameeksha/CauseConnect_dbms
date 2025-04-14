from rest_framework import serializers
from .models import Organization,Donation,Donor,OrganizationAdmin

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['organization_id', 'name', 'about', 'email', 'phone_number', 'address', 'image']



from rest_framework import serializers
from .models import CustomUser, Organization, Cause

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["first_name", "last_name", "email", "phone_number","role"]



   
class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ["registration_number","name", "about", "email", "phone_number", "address","image","is_verified","approval_status"]
 
class CauseSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer()  # Nested Organization Details
    class Meta:
        model = Cause
        fields = ["cause_id", "title", "description", "target_amount", "raised_amount","organization","image","status"]


class DonorSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()  # Nested User Details

    class Meta:
        model = Donor
        fields = ['donor_id', 'user', 'dob', 'city', 'state', 'country']

class OrganizationAdminSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()  # Nested User Details
    organization = OrganizationSerializer()  # Nested Organization Details

    class Meta:
        model = OrganizationAdmin
        fields = ['admin_id', 'user', 'organization', 'is_authorized', 'approval_status']


class DonationSerializer(serializers.ModelSerializer):
    donor = DonorSerializer()
    cause = CauseSerializer()
    organization = OrganizationSerializer()
    
    class Meta:
        model = Donation
        fields = ['donation_id', 'donor', 'cause', 'organization', 'amount', 'date','payment_method', 'payment_id']
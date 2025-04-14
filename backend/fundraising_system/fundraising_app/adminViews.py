from django.utils.timezone import now
from datetime import timedelta
from django.db.models import Count, Sum
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import  Donor, Organization, OrganizationAdmin, Donation, Cause
from .serializers import DonationSerializer,OrganizationSerializer,OrganizationAdminSerializer,DonorSerializer
from rest_framework.permissions import IsAdminUser
from rest_framework import status
from django.db.models.functions import TruncMonth
from django.db.models import Count
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model, authenticate
from django.utils.timezone import now  

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAdminUser])  # Restrict access to admin users
def admin_dashboard(request):
    """Fetch Detailed Data for Admin Dashboard"""
    donations_per_day = Donation.objects.extra({'day': "date(date)"}).values('day').annotate(count=Count('donation_id'))
    raised_amount_per_cause = Cause.objects.annotate(raised=Sum('raised_amount')).values('title', 'raised_amount')
    org_causes = Cause.objects.values('organization').annotate(count=Count('cause_id'))


   
    one_year_ago = now() - timedelta(days=365)
    new_donors_per_month = (
        Donor.objects
        .filter(user__date_joined__gte=one_year_ago)
        .annotate(month=TruncMonth('user__date_joined'))
        .values('month')
        .annotate(count=Count('donor_id'))
        .order_by('month')
    )
    new_donors_per_month = [{"month": entry["month"].strftime("%b %Y"), "count": entry["count"]} for entry in new_donors_per_month]



    data = {

        "total_donors": Donor.objects.count(),
        "total_organizations": Organization.objects.count(),
        "total_org_admins": OrganizationAdmin.objects.count(),
        "total_donations": Donation.objects.count(),
        "total_causes": Cause.objects.count(),
        "donations_per_day": donations_per_day,
        "raised_amount_per_cause":raised_amount_per_cause,
        "org_causes":org_causes,
        "new_donors_per_month":new_donors_per_month
    }    

    return Response(data, status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([IsAdminUser])  # Restrict access to admin users
def admin_get_lists(request):
    """Fetch Detailed Data for Admin Dashboard"""

    organizations = Organization.objects.all()
    admins = OrganizationAdmin.objects.all()
    donors = Donor.objects.all()

    data = {
        "organizations": OrganizationSerializer(organizations, many=True).data,
        "admins": OrganizationAdminSerializer(admins, many=True).data,
        "donors": DonorSerializer(donors, many=True).data,
    }

    return Response(data, status=status.HTTP_200_OK)

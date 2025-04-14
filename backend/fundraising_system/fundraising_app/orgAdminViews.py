from django.contrib.auth import get_user_model, authenticate
from django.http import JsonResponse
from django.shortcuts import get_list_or_404,get_object_or_404
from django.contrib.auth.hashers import make_password
from django.db.models import Sum, Count
from django.core.mail import send_mail
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.db.models import F


from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny

from .serializers import OrganizationSerializer
from .models import OrganizationAdmin,Organization ,Donor,Donation,Cause,CustomUser
from .serializers import CustomUserSerializer, OrganizationSerializer, CauseSerializer,OrganizationAdminSerializer,DonorSerializer,DonationSerializer
from rest_framework.permissions import IsAdminUser
from decimal import Decimal
import uuid
from django.db.models.functions import TruncDate
from django.http import JsonResponse
from rest_framework.pagination import PageNumberPagination

User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def org_admin_dashboard(request):
 

    if request.user.role not in ['admin', 'organization_admin']:
        return Response({"error": "Only admins or organization admins can access this dashboard"}, status=403)
    
    admin_org = request.user.admin_profile.organization 
   

    total_donations = Donation.objects.filter(organization=admin_org).aggregate(total=Sum('amount'))['total'] or 0
    total_donors = Donor.objects.filter(user__role='donor').count()
    active_causes = Cause.objects.filter(organization=admin_org,status="active").count()
    recent_donations = Donation.objects.filter(organization=admin_org).order_by('-date')[:7]


    # **3. Donations Per Cause**
    donations_per_cause = (
        Cause.objects.filter(organization=admin_org)
        .annotate(donation_count=Count("donation"), total_raised=Sum("donation__amount"))
        .values("title", "donation_count", "total_raised")
    )

    # **4. Cause Funding (Target vs Raised)**
    cause_funding = (
        Cause.objects.filter(organization=admin_org)
        .annotate(total_raised=Sum("donation__amount"))
        .values("title", "target_amount", "raised_amount")
    )

    donations_per_day = (
    Donation.objects.filter(organization=admin_org)
    .annotate(day=TruncDate("date"))  # Extract only the date (ignores time)
    .values("day")  # Group by the extracted date
    .annotate(
        donation_count=Count("donation_id"), 
        total_raised=Sum("amount")
    )
    .order_by("day")
    )

    # **6. Date Filter for Donations Per Day (Optional)**
    start_date = request.GET.get("start_date")
    end_date = request.GET.get("end_date")
    if start_date and end_date:
        donations_per_day = donations_per_day.filter(day__range=[start_date, end_date])

    # ✅ Convert date object to string before sending it to frontend
    formatted_donations_per_day = [
        {
            "day": data["day"].isoformat(),  # Converts date object to ISO format (YYYY-MM-DD)
            "donation_count": data["donation_count"],
            "total_raised": data["total_raised"],
        }
        for data in donations_per_day
    ]

    print(formatted_donations_per_day)



    return JsonResponse({
        "total_donations": total_donations,
        "total_donors": total_donors,
        "active_causes": active_causes,
        "recent_donations": [
            {"donor": donation.donor.user.first_name, "amount": donation.amount, "date": donation.date}
            for donation in recent_donations
        ],
         "donations_per_cause": list(donations_per_cause),
        "cause_funding": list(cause_funding),
        "donations_per_day": formatted_donations_per_day,

    })






@api_view(['GET'])
@permission_classes([IsAuthenticated])
def organization_donations(request):
    if request.user.role not in ['admin', 'organization_admin']:
        return Response({"error": "Only admins or organization admins can access this dashboard"}, status=403)
    
    organization = request.user.admin_profile.organization 
    cause_id = request.GET.get('cause', None)  # Get cause ID from query parameters

    donations = Donation.objects.filter(cause__organization=organization)

    if cause_id:
        donations = donations.filter(cause__cause_id=cause_id) 
    # Pagination
    paginator = PageNumberPagination()
    paginator.page_size = 10 # Set the number of donations per page
    result_page = paginator.paginate_queryset(donations, request)

    serializer = DonationSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def organization_get_causes(request):
    """
    Get all causes related to the organization for filtering.
    """
    if request.user.role not in ['admin', 'organization_admin']:
        return Response({"error": "Only admins or organization admins can access this dashboard"}, status=403)
    
    organization = request.user.admin_profile.organization 
    causes = Cause.objects.filter(organization=organization)
    serializer = CauseSerializer(causes, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_cause_status(request, cause_id):
    if request.user.role not in ['admin', 'organization_admin']:
        return Response({"error": "Only admins or organization admins can access this dashboard"}, status=403)
    

    try:
        cause = Cause.objects.get(cause_id=cause_id, organization=request.user.admin_profile.organization )
        new_status = request.data.get("status")
        if new_status in ["active", "inactive", "stopped"]:
            cause.status = new_status
            cause.save()
            return Response({"message": "Cause status updated successfully"}, status=200)
        return Response({"error": "Invalid status"}, status=400)
    except Cause.DoesNotExist:
        return Response({"error": "Cause not found"}, status=404)

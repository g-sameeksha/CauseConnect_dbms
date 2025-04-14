from django.db.models import Sum, Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Donation, Donor
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from django.db.models.functions import TruncMonth

User = get_user_model()

@api_view(['POST'])  # Change to POST to receive email in request body
@permission_classes([IsAuthenticated]) 
def donor_donation_stats(request):
    """Retrieve donation statistics for a donor based on email."""
    donor_email = request.data.get("email")  # Extract email from request body
    
    if not donor_email:
        return Response({"error": "Email is required"}, status=400)

    try:
        user = User.objects.get(email=donor_email)
        donor = Donor.objects.get(user=user)
    except (User.DoesNotExist, Donor.DoesNotExist):
        return Response({"error": "Donor not found"}, status=404)

    # Total amount donated & total donations count
    total_donated = Donation.objects.filter(donor=donor).aggregate(total_amount=Sum("amount"))["total_amount"] or 0
    total_donations = Donation.objects.filter(donor=donor).count()

    # Number of Causes Supported
    causes_supported = Donation.objects.filter(donor=donor).values("cause").distinct().count()

    # Monthly Donation Trends (Fix: Extract MONTH instead of DAY)

    monthly_donations = (
    Donation.objects.filter(donor=donor)
    .annotate(month=TruncMonth("date"))  # Extract Year & Month
    .values("month")
    .annotate(total_amount=Sum("amount") , donation_count=Count("donation_id"))
    .order_by("month")
    )

    # Convert to desired format: "Mon YYYY" (e.g., "Mar 2024")
    formatted_monthly_donations = [
        {
            "month": donation["month"].strftime("%b %Y"),  # Convert to "Mon YYYY"
            "total_amount": donation["total_amount"],
            "donation_count": donation["donation_count"]
        }
        for donation in monthly_donations
    ]

    # Donations per Cause
    donations_per_cause = (
        Donation.objects.filter(donor=donor)
        .values("cause__title")
        .annotate(total_amount=Sum("amount"))
        .order_by("-total_amount")
    )

    # Last 5 Donations
    last_5_donations = (
        Donation.objects.filter(donor=donor)
        .values("date", "cause__title", "amount")
        .order_by("-date")[:5]
    )



    return Response({
        "total_donated": total_donated,
        "total_donations": total_donations,
        "causes_supported": causes_supported,
        "monthly_donations": list(formatted_monthly_donations),
        "donations_per_cause": list(donations_per_cause),
        "last_5_donations": list(last_5_donations),
    })



@api_view(['GET'])  # Change to POST to receive email in request body
@permission_classes([IsAuthenticated]) 
def get_donor_donations(request):
    email = request.GET.get('email')  # Get email from request
    if not email:
        return Response({'error': 'Email is required'}, status=400)
    
    donations = Donation.objects.filter(donor__user__email=email).values(
        "donation_id", "cause__title", "organization__name", "amount",
        "date", "payment_method", "payment_id"
    ).order_by("-date")
    
    return Response({"donations": list(donations)})
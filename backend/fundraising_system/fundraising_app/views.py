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
from .serializers import CustomUserSerializer, OrganizationSerializer, CauseSerializer,OrganizationAdminSerializer,DonorSerializer
from rest_framework.permissions import IsAdminUser
from decimal import Decimal
import uuid

User = get_user_model()

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def get_causes(request):
#     try:
#         causes = Cause.objects.all()
#         if not causes.exists():
#             return Response({"message": "No causes found."}, status=status.HTTP_204_NO_CONTENT)  # No content response  
#         data = {
#             "causes":CauseSerializer(causes, many=True).data
#         }
#         return Response(data, status=status.HTTP_200_OK) 
#     except Exception as e :
#         print(e)

@api_view(["GET"])   
@permission_classes([AllowAny])  # 🔹 Allows public access
def get_home_details(request):
    organizations = Organization.objects.filter(is_verified=True).count()
    donors = Donor.objects.all().count()
    causes = Cause.objects.all()        
    total_raised_amount = Cause.objects.aggregate(total=Sum('raised_amount'))['total']

    donations_by_location = (
        Donation.objects
        .values('donor__state')
        .annotate(total_donated=Sum('amount'))
        .order_by('-total_donated')
    )
    donations_by_location = [{"country": entry["donor__state"], "total_donated": entry["total_donated"]} for entry in donations_by_location]
 


    data = {
        "organizations": organizations,
        "donors": donors,
        "causes": CauseSerializer(causes, many=True).data,
        "cause_count": causes.count(),
        "total_raised_amount" : total_raised_amount or 0 ,
        "donations_by_location" :donations_by_location

    }
    
    return Response(data, status=status.HTTP_200_OK)

@api_view(["GET"])   
@permission_classes([AllowAny])
def get_organizations(request):
    organizations = Organization.objects.filter(is_verified =True)
    data = {
        "organizations": OrganizationSerializer(organizations, many=True).data,   
    }
    return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email, password, role, org_reg_num = (
        request.data.get("email"),
        request.data.get("password"),
        request.data.get("role"),
        request.data.get("organization"),
    )

    if not all([email, password, role]):
        return Response({"detail": "Email, password, and role are required."}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, email=email, password=password)
    print(user.role.lower())
    print(role.lower())
    if not user or user.role.lower() != role.lower():
        return Response({"detail": "Invalid credentials or role mismatch."}, status=status.HTTP_400_BAD_REQUEST)

    if role == "Organization_admin":
        try:
            admin = OrganizationAdmin.objects.get(user=user)
            if not admin.organization or str(admin.organization.registration_number) != str(org_reg_num):
                return Response({"detail": "Invalid organization details."}, status=status.HTTP_400_BAD_REQUEST)
            if not admin.is_authorized:
                return Response({"detail": "Admin is not authorized."}, status=status.HTTP_403_FORBIDDEN)
        except OrganizationAdmin.DoesNotExist:
            return Response({"detail": "Admin profile not found."}, status=status.HTTP_400_BAD_REQUEST)

    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": role,
            "email": user.email,
            "name": user.get_full_name(),
            "organization": admin.organization.name if role == "Organization_admin" else None,
            "organization_reg_num": admin.organization.registration_number if role == "Organization_admin" else None,
        },
        status=status.HTTP_200_OK,
    )



# @api_view(["GET"])   
# @permission_classes([AllowAny])
# def get_organizations(request):
#     organizations = Organization.objects.filter(is_verified =True)
  
#     data = {
#         "organizations": OrganizationSerializer(organizations, many=True).data,   
#     }

#     return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_organization(request):
    reg_num = request.data.get("registration_number")
    if Organization.objects.filter(registration_number=reg_num).exists():
        return Response({"error": "Organization with this registration_number already exists."}, status=status.HTTP_400_BAD_REQUEST)

    try : 
        serializer = OrganizationSerializer(data= request.data)
        if serializer.is_valid():
            organization = serializer.save()
            return Response(OrganizationSerializer(organization).data, status=status.HTTP_201_CREATED)
    except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


   
        
    # # Extract request data
    # about = request.data.get("about")
    # email = request.data.get("email")
    # phone_number = request.data.get("phone_number")
    # address = request.data.get("address")
    # image = request.FILES.get("image")  # Handle image upload

    # # Check if the organization already exists
    

    # # Create a new organization
    # organization = Organization.objects.create(
    #     name=name,
    #     about=about,
    #     email=email,
    #     phone_number=phone_number,
    #     address=address,
    #     image=image
    # )

    # # Serialize and return the response
    # serializer = OrganizationSerializer(organization)
    # return Response(serializer.data, status=status.HTTP_201_CREATED)


from django.db import transaction

@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    role = data.get("role", "").lower()
    print(role)

    if User.objects.filter(email=data.get("email")).exists():
        return Response({"message": "User with this email already exists!"}, status=status.HTTP_400_BAD_REQUEST)

    if role not in ["donor", "admin","organization_admin"]:
        return Response({"message": "Invalid role!"}, status=status.HTTP_400_BAD_REQUEST)

    user_data = {
        "first_name": data.get("first_name"),
        "last_name": data.get("last_name"),
        "email": data.get("email"),
        "password": make_password(data.get("password")),
        "phone_number": data.get("phone_number"),
        "role": role,
    }

    donor_data = {}
    if role == "donor":
        donor_data = {
            "dob": data.get("dob"),
        #     "extra_info": data.get("donorData", {}).get("extra_info"),  # Handling donor-specific fields
        # }
            "city": data.get("city"),  
            "state": data.get("state"), 
            "country": data.get("country"), 
        }
        user_data["is_active"] = True  

    try:
        with transaction.atomic():  # Ensures rollback if any step fails
            user = User.objects.create(**user_data)

            if role == "donor":
                Donor.objects.create(user=user, **donor_data)

            elif role == "organization_admin":
                org_reg_num = data.get("organization")
                if not Organization.objects.filter(registration_number = org_reg_num).exists():
                    raise ValueError("Invalid organization!")  # ❌ Will trigger rollback

                OrganizationAdmin.objects.create(user=user, organization_id=org_reg_num)

        return Response(
            {"message": "User registered successfully!"},
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)




@api_view(["POST"])
@permission_classes([IsAdminUser])  # Restrict to Admins only
def update_organization_status(request):
    """Update organization verification status using registration_number and send email notification"""
    registration_number = request.data.get("registration_number")
    status_value = request.data.get("status")  # 1 for Approve, 0 for Reject

    try:
        # Fetch organization by registration_number
        organization = Organization.objects.get(registration_number=registration_number)
        organization.is_verified = True if status_value == 1 else False
        organization.approval_status = "Approved" if status_value == 1 else "Rejected"
        organization.save()

        # Prepare email details
        subject = "CauseConnect Organization Verification Update"
        if organization.is_verified:
            message = f"""
            Dear {organization.name},

            Congratulations! Your organization (Reg. No: {organization.registration_number}) has been successfully approved and verified. 
            You can now access all features on our platform.

            Best Regards,
            CauseConnect
            """
        else:
            message = f"""
            Dear {organization.name},

            We regret to inform you that your organization (Reg. No: {organization.registration_number}) verification request has been rejected. 
            For further details, please contact support.

            Best Regards,
            CauseConnect
            """

        # Send email notification
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,  # Ensure this is set in settings.py
            [organization.email],  # Recipient's email
            fail_silently=False,  # Raise an error if email fails
        )

        return Response({"message": "Status updated and email sent successfully"}, status=status.HTTP_200_OK)

    except Organization.DoesNotExist:
        return Response({"error": "Organization not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": f"Something went wrong: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_admin_status(request):
    """
    API to approve or reject an admin and send an email notification.
    """
    try:
        admin_id = request.data.get("admin_id")
        status = request.data.get("status")  # 1 for approve, 0 for reject

        if admin_id is None or status is None:
            return Response({"error": "Invalid data"}, status=400)

        admin = get_object_or_404(OrganizationAdmin, admin_id=admin_id)
        user = admin.user  # Get the associated User instance

        if status == 1:  # Approve the admin
            admin.approval_status = "Approved"
            admin.is_authorized = True
            admin.save()

            subject = "Admin Approval Status Update"
            message = f"Dear {user.first_name} {user.last_name},\n\nYour admin account has been APPROVED. You can now access the system.\n\nBest regards,\nAdmin Team"
        else:  # Reject the admin
            subject = "Admin Approval Status Update"
            message = f"Dear {user.first_name} {user.last_name},\n\nUnfortunately, your admin account has been REJECTED. Please contact support for further details.\n\nBest regards,\nAdmin Team"

            # Delete the admin record and the user record
            admin.delete()
            user.delete()

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

        return Response({"message": "Admin status updated successfully and email sent."})

    except Exception as e:
        return Response({"error": str(e)}, status=500)




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_profile(request):
    """Fetch Admin Profile Data (Admin + Organization + Causes)"""
    
    if not hasattr(request.user, "admin_profile"):
        return Response({"error": "Only admins can access this profile."}, status=403)

    admin = request.user.admin_profile
    organization = admin.organization
    causes = Cause.objects.filter(organization_id=organization)

    print(admin)
    print(organization)
    print(causes)
    print(f'admin {CustomUserSerializer(request.user).data} organization {OrganizationSerializer(organization).data} {CauseSerializer(causes, many=True).data}')

    return Response({
        "admin": CustomUserSerializer(request.user).data,
        "organization": OrganizationSerializer(organization).data,
        "causes": CauseSerializer(causes, many=True).data,
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_cause(request):
    user = request.user

    # Check if user is an admin
    try:
        admin_profile = user.admin_profile  # Get Admin profile
    except OrganizationAdmin.DoesNotExist:
        return Response({'error': 'User is not an admin'}, status=status.HTTP_403_FORBIDDEN)

    serializer = None  # Initialize serializer to avoid UnboundLocalError

    try:
        organization = admin_profile.organization  # Get Admin's organization

        data = request.data.copy()
        data['organization'] = organization.organization_id  # Assign organization ID

        serializer = CauseSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_cause(request):
    user = request.user

    # Check if user is an admin
    try:
        admin_profile = user.admin_profile  # Get Admin profile
    except OrganizationAdmin.DoesNotExist:
        return Response({'error': 'User is not an admin'}, status=status.HTTP_403_FORBIDDEN)

    serializer = None  # Initialize serializer to avoid UnboundLocalError

    try:
        organization = admin_profile.organization  # Get Admin's organization

        data = request.data.copy()
        data['organization'] = organization.registration_number  # Assign organization ID

        serializer = CauseSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_home_causes(request):
    active_causes = Cause.objects.filter(status="active")
    print(active_causes)


    causes_list = active_causes.values("cause_id", "title", "description", "target_amount", "raised_amount","image")
    return Response({"causes": list(causes_list)})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cause_detail(request, cause_id):
    cause = get_object_or_404(Cause, cause_id=cause_id)
    serialiser = CauseSerializer(cause)
    # return Response({
    #     "title": cause.title,
    #     "description": cause.description,
    #     "target_amount": float(cause.target_amount),
    #     "raised_amount": float(cause.raised_amount or 0),
    #     "organization": cause.organization.name,
    #     "image" : cause.image
    # })
    return Response(serialiser.data)






import paypalrestsdk
from django.conf import settings
from django.http import JsonResponse
from rest_framework.decorators import api_view

# Configure PayPal SDK
paypalrestsdk.configure({
    "mode": settings.PAYPAL_MODE,
    "client_id": settings.PAYPAL_CLIENT_ID,
    "client_secret": settings.PAYPAL_CLIENT_SECRET
})

# API to create a PayPal payment order
@api_view(['POST'])
def create_paypal_order(request):
    data = request.data
    amount = data.get("amount")

    if not amount:
        return JsonResponse({"error": "Invalid amount"}, status=400)

    payment = paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {"payment_method": "paypal"},
        "redirect_urls": {
            "return_url": "http://localhost:3000/payment-approve",
            "cancel_url": "http://localhost:3000/payment-cancel"
        },
        "transactions": [{
            "amount": {"total": f"{float(amount):.2f}", "currency": "USD"},
            "description": "Donation Payment"
        }]
    })

    if payment.create():
        approval_url = next(link.href for link in payment.links if link.rel == "approval_url")
        return JsonResponse({
            "approval_url": approval_url,
            "payment_id": payment.id  # ✅ Include Payment ID in response
        })
    else:
        return JsonResponse({"error": payment.error}, status=400)


@api_view(['POST'])
def capture_paypal_payment(request):
    data = request.data
    payment_id = data.get("paymentID")
    payer_id = data.get("payerID")

    # Fetch additional donation details from the frontend
    donor_email = data.get("donor_email")
    cause_id = data.get("cause_id")
    organization_id = data.get("organization_id")
    amount = data.get("amount")
    
    if Donation.objects.filter(payment_id=payment_id).exists():
        return JsonResponse({"message": "Payment already processed"}, status=200)
    
    try:
        amount = Decimal(data.get("amount", "0.00"))

        payment = paypalrestsdk.Payment.find(payment_id)

        if payment.execute({"payer_id": payer_id}):
            # Find related objects
            user_acc = User.objects.get(email = donor_email)
            donor = Donor.objects.get(user = user_acc)

            cause = get_object_or_404(Cause, cause_id=cause_id)
            cause.raised_amount = cause.raised_amount + amount  # Ensure addition works correctly with Decimal
            cause.save()

            organization = Organization.objects.get(registration_number=organization_id)

            # Create a unique donation ID
            donation_id = f"DON_{uuid.uuid4().hex[:12]}"

            # Save donation details in the database
            donation = Donation.objects.create(
                donation_id=donation_id,
                donor=donor,
                cause=cause,
                organization=organization,
                amount=amount,
                payment_method="PayPal",
                payment_id=payment_id
            )

            return JsonResponse({"message": "Payment successful!", "donation_id": donation.donation_id})
        else:
            return JsonResponse({"error": payment.error}, status=400)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



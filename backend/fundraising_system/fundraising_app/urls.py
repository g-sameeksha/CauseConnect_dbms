from django.urls import path
from . import views
from . import donorViews
from . import adminViews
from . import orgAdminViews
urlpatterns =[
    path('login/',views.login,name="login_user"),
    path('register_organization/', views.register_organization, name='register_organization'),
    path('register_user/', views.register_user, name='register_user'),

    path('get_organizations',views.get_organizations,name='get_organizations'),
    path('get_causes', views.get_home_causes, name="get_causes"),
    path('get_home_details',views.get_home_details,name="get_home_details"),
    path('admin_dashboard', adminViews.admin_dashboard, name='admin-dashboard'),
    path("admin_get_lists",adminViews.admin_get_lists ,name="admin_get_lists"),
    path('update_organization_status/',views.update_organization_status,name='update_organization_status'),
    path("update_admin_status/", views.update_admin_status, name="update_admin_status"),


    path('org_admin_dashboard', orgAdminViews.org_admin_dashboard, name='org-admin-dashboard'),
    path('organization_get_donations',orgAdminViews.organization_donations,name='organization_donations'),
    path('organization_get_causes/', orgAdminViews.organization_get_causes, name='organization_get_causes'),
    path("update_cause_status/<int:cause_id>/", orgAdminViews.update_cause_status, name="update_cause_status"),


    path('admin_profile', views.admin_profile, name='admin-profile'),
    path('create_cause/', views.create_cause, name='create_cause'),
    path('get_causes', views.get_home_details, name="get_causes"),
    path('get_cause/<int:cause_id>/', views.cause_detail, name="cause_detail"),
    
    path('api/paypal/create-order/', views.create_paypal_order, name="create-paypal-order"),
    path('api/paypal/capture-payment/', views.capture_paypal_payment, name="capture-paypal-payment"),

    path("donor-stats/", donorViews.donor_donation_stats, name="donor-stats"),
    path("donor_get_donations",donorViews.get_donor_donations,name="get_donor_donations"),



]
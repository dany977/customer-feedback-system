from django.db import models

class EmployeeSatisfaction(models.Model):
    # ሁሉም ፊልዶች አማራጭ (optional)
    full_name = models.CharField(max_length=200, blank=True, null=True)
    employee_id = models.CharField(max_length=50, blank=True, null=True)
    department = models.CharField(max_length=200, blank=True, null=True)
    position = models.CharField(max_length=200, blank=True, null=True)
    years_of_service = models.IntegerField(blank=True, null=True)
    
    # Asset Management
    asset_liked = models.TextField(blank=True, null=True)
    asset_suggestions = models.TextField(blank=True, null=True)
    
    # Facility
    cleanliness_aesthetics = models.IntegerField(blank=True, null=True)
    external_appearance = models.IntegerField(blank=True, null=True)
    internal_cleanliness = models.IntegerField(blank=True, null=True)
    facility_condition = models.IntegerField(blank=True, null=True)
    space_utilization = models.IntegerField(blank=True, null=True)
    security_service = models.IntegerField(blank=True, null=True)
    light_air_quality = models.IntegerField(blank=True, null=True)
    maintenance_care = models.IntegerField(blank=True, null=True)
    facility_suggestions = models.TextField(blank=True, null=True)
    
    # Logistics
    logistics_service_speed = models.IntegerField(blank=True, null=True)
    vehicle_readiness = models.IntegerField(blank=True, null=True)
    travel_time = models.IntegerField(blank=True, null=True)
    driver_conduct = models.IntegerField(blank=True, null=True)
    travel_safety = models.IntegerField(blank=True, null=True)
    logistics_suggestions = models.TextField(blank=True, null=True)
    
    # Vehicle Maintenance
    vehicle_registration = models.CharField(max_length=50, blank=True, null=True)
    vehicle_type = models.CharField(max_length=100, blank=True, null=True)
    maintenance_quality = models.IntegerField(blank=True, null=True)
    service_speed = models.IntegerField(blank=True, null=True)
    staff_behavior = models.IntegerField(blank=True, null=True)
    liked_service = models.TextField(blank=True, null=True)
    improvement_needs = models.TextField(blank=True, null=True)
    
    # Overall
    overall_satisfaction = models.IntegerField(blank=True, null=True)
    general_comments = models.TextField(blank=True, null=True)
    contact = models.CharField(max_length=200, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Feedback {self.id}"
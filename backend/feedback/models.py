from django.db import models

class Feedback(models.Model):
    # Section 1
    service_date = models.DateField()
    gender = models.CharField(max_length=10, blank=True)
    stakeholder_type = models.CharField(max_length=200, blank=True)
    stakeholder_other = models.CharField(max_length=200, blank=True)
    sector = models.CharField(max_length=200, blank=True)
    minister_office = models.CharField(max_length=200, blank=True)
    executive_director = models.CharField(max_length=200, blank=True)
    crop_development = models.CharField(max_length=200, blank=True)
    natural_resource = models.CharField(max_length=200, blank=True)
    livestock = models.CharField(max_length=200, blank=True)
    investment = models.CharField(max_length=200, blank=True)
    provider_name = models.CharField(max_length=200, blank=True)
    service_duration = models.IntegerField(default=0)
    
    # Section 2
    service_types = models.TextField(blank=True)
    other_service = models.CharField(max_length=200, blank=True)
    
    # Section 3
    ease_of_access = models.IntegerField(blank=True, null=True)
    staff_respect = models.IntegerField(blank=True, null=True)
    staff_clarity = models.IntegerField(blank=True, null=True)
    fast_response = models.IntegerField(blank=True, null=True)
    accurate_service = models.IntegerField(blank=True, null=True)
    clear_info = models.IntegerField(blank=True, null=True)
    timely_service = models.IntegerField(blank=True, null=True)
    met_expectations = models.IntegerField(blank=True, null=True)
    overall_satisfaction = models.IntegerField(blank=True, null=True)
    
    # Section 4
    improvement = models.TextField(blank=True)
    comments = models.TextField(blank=True)
    contact = models.CharField(max_length=200, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.id} - {self.service_date}"
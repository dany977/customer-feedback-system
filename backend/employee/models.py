from django.db import models

class EmployeeSatisfaction(models.Model):
    # Section 1: Personal Information
    full_name = models.CharField(max_length=200, blank=True)
    employee_id = models.CharField(max_length=50)
    department = models.CharField(max_length=200)
    position = models.CharField(max_length=200, blank=True)
    years_of_service = models.IntegerField(default=0)
    
    # Section 2: Job Satisfaction (1-5)
    job_clarity = models.IntegerField(blank=True, null=True)
    skill_utilization = models.IntegerField(blank=True, null=True)
    career_growth = models.IntegerField(blank=True, null=True)
    training_support = models.IntegerField(blank=True, null=True)
    
    # Section 3: Management & Communication
    supervisor_support = models.IntegerField(blank=True, null=True)
    communication = models.IntegerField(blank=True, null=True)
    recognition = models.IntegerField(blank=True, null=True)
    feedback_received = models.IntegerField(blank=True, null=True)
    
    # Section 4: Work Environment
    work_balance = models.IntegerField(blank=True, null=True)
    workplace_safety = models.IntegerField(blank=True, null=True)
    facilities = models.IntegerField(blank=True, null=True)
    team_collaboration = models.IntegerField(blank=True, null=True)
    
    # Section 5: Compensation
    salary_satisfaction = models.IntegerField(blank=True, null=True)
    benefits = models.IntegerField(blank=True, null=True)
    on_time_payment = models.IntegerField(blank=True, null=True)
    
    # Section 6: Overall
    overall_satisfaction = models.IntegerField(blank=True, null=True)
    
    # Comments
    improvements = models.TextField(blank=True)
    comments = models.TextField(blank=True)
    contact = models.CharField(max_length=200, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.employee_id} - {self.department}"
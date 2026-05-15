from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.db.models import Avg, Count
from .models import EmployeeSatisfaction
from .serializers import EmployeeSatisfactionSerializer

class EmployeeFeedbackCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = EmployeeSatisfaction.objects.all()
    serializer_class = EmployeeSatisfactionSerializer

class EmployeeFeedbackListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = EmployeeSatisfaction.objects.all().order_by('-created_at')
    serializer_class = EmployeeSatisfactionSerializer

class EmployeeDashboardStatsView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        total = EmployeeSatisfaction.objects.count()
        avg_satisfaction = EmployeeSatisfaction.objects.aggregate(Avg('overall_satisfaction'))
        
        # Satisfaction distribution
        satisfaction_dist = {
            'very_satisfied': EmployeeSatisfaction.objects.filter(overall_satisfaction=5).count(),
            'satisfied': EmployeeSatisfaction.objects.filter(overall_satisfaction=4).count(),
            'neutral': EmployeeSatisfaction.objects.filter(overall_satisfaction=3).count(),
            'dissatisfied': EmployeeSatisfaction.objects.filter(overall_satisfaction=2).count(),
            'very_dissatisfied': EmployeeSatisfaction.objects.filter(overall_satisfaction=1).count(),
        }
        
        # Department wise stats
        dept_stats = list(EmployeeSatisfaction.objects.values('department').annotate(
            avg_rating=Avg('overall_satisfaction'),
            count=Count('id')
        ))
        
        # Rating averages
        rating_averages = {
            'job_clarity': EmployeeSatisfaction.objects.aggregate(Avg('job_clarity'))['job_clarity__avg'] or 0,
            'skill_utilization': EmployeeSatisfaction.objects.aggregate(Avg('skill_utilization'))['skill_utilization__avg'] or 0,
            'career_growth': EmployeeSatisfaction.objects.aggregate(Avg('career_growth'))['career_growth__avg'] or 0,
            'supervisor_support': EmployeeSatisfaction.objects.aggregate(Avg('supervisor_support'))['supervisor_support__avg'] or 0,
            'salary_satisfaction': EmployeeSatisfaction.objects.aggregate(Avg('salary_satisfaction'))['salary_satisfaction__avg'] or 0,
        }
        
        return Response({
            'total_feedback': total,
            'average_satisfaction': round(avg_satisfaction['overall_satisfaction__avg'] or 0, 2),
            'satisfaction_distribution': satisfaction_dist,
            'department_stats': dept_stats,
            'rating_averages': rating_averages,
        })
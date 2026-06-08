from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Avg, Count
from .models import EmployeeSatisfaction
from .serializers import EmployeeSatisfactionSerializer

class EmployeeFeedbackCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = EmployeeSatisfaction.objects.all()
    serializer_class = EmployeeSatisfactionSerializer
    
    def create(self, request, *args, **kwargs):
        print("=" * 50)
        print("Received data:", request.data)
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({
                'success': True,
                'message': 'Feedback submitted successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmployeeFeedbackListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = EmployeeSatisfaction.objects.all().order_by('-created_at')
    serializer_class = EmployeeSatisfactionSerializer

class EmployeeDashboardStatsView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            total = EmployeeSatisfaction.objects.count()
            avg_satisfaction = EmployeeSatisfaction.objects.aggregate(Avg('overall_satisfaction'))
            
            satisfaction_dist = {
                'very_satisfied': EmployeeSatisfaction.objects.filter(overall_satisfaction=5).count(),
                'satisfied': EmployeeSatisfaction.objects.filter(overall_satisfaction=4).count(),
                'neutral': EmployeeSatisfaction.objects.filter(overall_satisfaction=3).count(),
                'dissatisfied': EmployeeSatisfaction.objects.filter(overall_satisfaction=2).count(),
                'very_dissatisfied': EmployeeSatisfaction.objects.filter(overall_satisfaction=1).count(),
            }
            
            department_stats = list(EmployeeSatisfaction.objects.values('department').annotate(
                avg_rating=Avg('overall_satisfaction'),
                count=Count('id')
            ))
            
            return Response({
                'total_feedback': total,
                'average_satisfaction': round(avg_satisfaction['overall_satisfaction__avg'] or 0, 2),
                'satisfaction_distribution': satisfaction_dist,
                'department_stats': department_stats,
            })
        except Exception as e:
            print("Error in stats:", e)
            return Response({
                'total_feedback': 0,
                'average_satisfaction': 0,
                'satisfaction_distribution': {
                    'very_satisfied': 0,
                    'satisfied': 0,
                    'neutral': 0,
                    'dissatisfied': 0,
                    'very_dissatisfied': 0
                },
                'department_stats': []
            })
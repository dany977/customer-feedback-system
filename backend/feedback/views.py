from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login
from django.db.models import Avg, Count
from .models import Feedback
from .serializers import FeedbackSerializer
import pandas as pd
from django.http import HttpResponse
from io import BytesIO
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        print("=" * 50)
        print("Login attempt received")
        username = request.data.get('username')
        password = request.data.get('password')
        print(f"Username: {username}")
        
        user = authenticate(username=username, password=password)
        
        if user:
            login(request, user)
            print("Login successful!")
            return Response({
                'success': True,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            })
        else:
            print("Login failed - invalid credentials")
            return Response({
                'success': False,
                'error': 'Invalid username or password'
            }, status=status.HTTP_401_UNAUTHORIZED)

class FeedbackCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

class FeedbackListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Feedback.objects.all().order_by('-created_at')
    serializer_class = FeedbackSerializer

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        print("=" * 50)
        print("Login attempt received")
        username = request.data.get('username')
        password = request.data.get('password')
        print(f"Username: {username}")
        
        user = authenticate(username=username, password=password)
        
        if user:
            login(request, user)
            print("Login successful!")
            return Response({
                'success': True,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            })
        else:
            print("Login failed - invalid credentials")
            return Response({
                'success': False,
                'error': 'Invalid username or password'
            }, status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_exempt, name='dispatch')
class UserView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email
            })
        return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        from django.contrib.auth import logout
        logout(request)
        return Response({'success': True})

class DashboardStatsView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        total = Feedback.objects.count()
        avg_satisfaction = Feedback.objects.aggregate(Avg('overall_satisfaction'))
        
        satisfaction_dist = {
            'very_satisfied': Feedback.objects.filter(overall_satisfaction=5).count(),
            'satisfied': Feedback.objects.filter(overall_satisfaction=4).count(),
            'neutral': Feedback.objects.filter(overall_satisfaction=3).count(),
            'dissatisfied': Feedback.objects.filter(overall_satisfaction=2).count(),
            'very_dissatisfied': Feedback.objects.filter(overall_satisfaction=1).count(),
        }
        
        sector_stats = list(Feedback.objects.values('sector').annotate(
            avg_rating=Avg('overall_satisfaction'),
            count=Count('id')
        ))
        
        rating_averages = {
            'ease_of_access': Feedback.objects.aggregate(Avg('ease_of_access'))['ease_of_access__avg'] or 0,
            'staff_respect': Feedback.objects.aggregate(Avg('staff_respect'))['staff_respect__avg'] or 0,
            'staff_clarity': Feedback.objects.aggregate(Avg('staff_clarity'))['staff_clarity__avg'] or 0,
            'fast_response': Feedback.objects.aggregate(Avg('fast_response'))['fast_response__avg'] or 0,
            'accurate_service': Feedback.objects.aggregate(Avg('accurate_service'))['accurate_service__avg'] or 0,
            'clear_info': Feedback.objects.aggregate(Avg('clear_info'))['clear_info__avg'] or 0,
            'timely_service': Feedback.objects.aggregate(Avg('timely_service'))['timely_service__avg'] or 0,
            'met_expectations': Feedback.objects.aggregate(Avg('met_expectations'))['met_expectations__avg'] or 0,
        }
        
        return Response({
            'total_feedback': total,
            'average_satisfaction': round(avg_satisfaction['overall_satisfaction__avg'] or 0, 2),
            'satisfaction_distribution': satisfaction_dist,
            'sector_stats': sector_stats,
            'rating_averages': rating_averages,
        })

class ExportExcelView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        feedbacks = list(Feedback.objects.all().values())
        
        if not feedbacks:
            return Response({'error': 'No data available'}, status=404)
        
        df = pd.DataFrame(feedbacks)
        output = BytesIO()
        
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Feedback', index=False)
        
        output.seek(0)
        response = HttpResponse(output, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=feedback_report.xlsx'
        return response
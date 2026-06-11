from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Avg, Count
from django.http import HttpResponse
import pandas as pd
from io import BytesIO
from .models import EmployeeSatisfaction
from .serializers import EmployeeSatisfactionSerializer

# Create feedback entry
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

# List all feedback
class EmployeeFeedbackListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = EmployeeSatisfaction.objects.all().order_by('-created_at')
    serializer_class = EmployeeSatisfactionSerializer

# Dashboard statistics
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
                    'very_satisfied': 0, 'satisfied': 0, 'neutral': 0,
                    'dissatisfied': 0, 'very_dissatisfied': 0
                },
                'department_stats': []
            })

# Export to Excel
class ExportEmployeeFeedbackView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        feedbacks = EmployeeSatisfaction.objects.all().values()
        if not feedbacks:
            return Response({'error': 'No data available'}, status=404)

        df = pd.DataFrame(list(feedbacks))

        # Remove timezone from datetime columns
        for col in df.select_dtypes(include=['datetime64[ns, UTC]', 'datetime64[ns]']).columns:
            df[col] = df[col].dt.tz_localize(None)
        for col in df.select_dtypes(include=['datetime64[ns]']).columns:
            df[col] = df[col].dt.strftime('%Y-%m-%d %H:%M:%S')

        # Rename columns to Amharic
        column_mapping = {
            'id': 'መታወቂያ',
            'full_name': 'ሙሉ ስም',
            'employee_id': 'የሰራተኛ መታወቂያ',
            'department': 'ዲፓርትመንት',
            'position': 'ሹመት',
            'years_of_service': 'የስራ ዘመን',
            'overall_satisfaction': 'አጠቃላይ እርካታ',
            'general_comments': 'አጠቃላይ አስተያየት',
            'created_at': 'የተላከበት ቀን'
        }
        existing_cols = [col for col in column_mapping.keys() if col in df.columns]
        df = df[existing_cols]
        df = df.rename(columns={k: v for k, v in column_mapping.items() if k in existing_cols})

        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Internal Feedback', index=False)

        output.seek(0)
        response = HttpResponse(
            output,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=internal_feedback.xlsx'
        return response
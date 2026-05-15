from django.urls import path
from . import views

urlpatterns = [
    path('employee/', views.EmployeeFeedbackCreateView.as_view(), name='employee-feedback'),
    path('employee/list/', views.EmployeeFeedbackListView.as_view(), name='employee-list'),
    path('employee/stats/', views.EmployeeDashboardStatsView.as_view(), name='employee-stats'),
]
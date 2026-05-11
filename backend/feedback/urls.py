from django.urls import path
from . import views

urlpatterns = [
    path('feedback/', views.FeedbackCreateView.as_view(), name='feedback-create'),
    path('feedback/list/', views.FeedbackListView.as_view(), name='feedback-list'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('user/', views.UserView.as_view(), name='user'),
    path('dashboard/stats/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
    path('export/excel/', views.ExportExcelView.as_view(), name='export-excel'),
]
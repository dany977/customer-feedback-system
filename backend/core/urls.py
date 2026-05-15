from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('api/', include('feedback.urls')),
     path('api/', include('employee.urls')),
]
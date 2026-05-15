from rest_framework import serializers
from .models import EmployeeSatisfaction

class EmployeeSatisfactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeSatisfaction
        fields = '__all__'
from rest_framework import serializers
from .models import EmployeeSatisfaction

class EmployeeSatisfactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeSatisfaction
        fields = '__all__'
        # ማንኛውም ፊልድ ግዴታ እንዳይሆን
        extra_kwargs = {
            'employee_id': {'required': False, 'allow_null': True, 'allow_blank': True},
            'department': {'required': False, 'allow_null': True, 'allow_blank': True},
            'full_name': {'required': False, 'allow_null': True, 'allow_blank': True},
            'position': {'required': False, 'allow_null': True, 'allow_blank': True},
            'years_of_service': {'required': False, 'allow_null': True},
        }
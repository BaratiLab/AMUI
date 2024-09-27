from rest_framework import serializers
from part.models import Part

class PartSerializer(serializers.ModelSerializer):

    class Meta:
        model = Part
        fields = "__all__"
        extra_kwargs = {'created_by': {'required': False}}

from rest_framework import serializers

from build_profile.models import BuildProfile
from part.models import Part
from print_plan.models import PrintPlan

from build_profile.serializers import BuildProfileSerializer
from part.serializers import PartSerializer

class PrintPlanSerializer(serializers.ModelSerializer):
    part = PartSerializer(read_only=True)
    build_profile = BuildProfileSerializer(read_only=True)

    part_id = serializers.PrimaryKeyRelatedField(queryset=Part.objects.all(), source='part', write_only=True, allow_null=True)
    build_profile_id = serializers.PrimaryKeyRelatedField(queryset=BuildProfile.objects.all(), source='build_profile', write_only=True, allow_null=True)

    class Meta:
        model = PrintPlan
        fields = "__all__"
        extra_kwargs = {'created_by': {'required': False}}

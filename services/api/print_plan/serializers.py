from rest_framework import serializers
from print_plan.models import PrintPlan

class PrintPlanSerializer(serializers.ModelSerializer):
    material_name = serializers.SerializerMethodField()
    part_name = serializers.SerializerMethodField()
    build_profile_title = serializers.SerializerMethodField()

    class Meta:
        model = PrintPlan
        fields = "__all__"
        extra_kwargs = {'created_by': {'required': False}}

    def get_part_name(self, obj):
        return obj.part.name if obj.part else None

    def get_build_profile_title(self, obj):
        return obj.build_profile.title if obj.build_profile else None

from rest_framework import serializers
from build_profile.models import BuildProfile

class BuildProfileSerializer(serializers.ModelSerializer):
    material_name = serializers.SerializerMethodField()

    class Meta:
        model = BuildProfile
        fields = "__all__"
        extra_kwargs = {'created_by': {'required': False}}

    def get_material_name(self, obj):
        return obj.material.name if obj.material else None

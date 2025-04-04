from rest_framework import serializers

from build_profile.models import BuildProfile
from part.models import Part
from print_plan.models import PrintPlan

from build_profile.serializers import BuildProfileDetailSerializer
from part.serializers import PartDetailSerializer, PartListSerializer


class PrintPlanListSerializer(serializers.ModelSerializer):
    part = PartListSerializer(read_only=True)
    # part_name = serializers.CharField(source="part.name", read_only=True)
    # part_file_thumbnail = serializers.FileField(source="part.part_file.thumbnail", read_only=True)
    build_profile_title = serializers.CharField(
        source="build_profile.title", read_only=True
    )
    build_profile_material_name = serializers.CharField(
        source="build_profile.material.name", read_only=True
    )

    part_id = serializers.PrimaryKeyRelatedField(
        queryset=Part.objects.all(), source="part", write_only=True, allow_null=True
    )
    build_profile_id = serializers.PrimaryKeyRelatedField(
        queryset=BuildProfile.objects.all(),
        source="build_profile",
        write_only=True,
        allow_null=True,
    )

    class Meta:
        model = PrintPlan
        fields = "__all__"
        extra_kwargs = {"created_by": {"required": False}}


class PrintPlanDetailSerializer(serializers.ModelSerializer):
    part = PartDetailSerializer(read_only=True)
    build_profile = BuildProfileDetailSerializer(read_only=True)

    part_id = serializers.PrimaryKeyRelatedField(
        queryset=Part.objects.all(), source="part", write_only=True, allow_null=True
    )
    build_profile_id = serializers.PrimaryKeyRelatedField(
        queryset=BuildProfile.objects.all(),
        source="build_profile",
        write_only=True,
        allow_null=True,
    )

    class Meta:
        model = PrintPlan
        fields = "__all__"
        extra_kwargs = {"created_by": {"required": False}}

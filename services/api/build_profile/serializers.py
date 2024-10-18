from rest_framework import serializers

from build_profile.models import BuildProfile
from machine.models import Machine
from material.models import Material

from machine.serializers import MachineSerializer
from material.serializers import MaterialSerializer


class BuildProfileListSerializer(serializers.ModelSerializer):
    machine_name = serializers.SerializerMethodField()
    material_name = serializers.SerializerMethodField()

    machine_id = serializers.PrimaryKeyRelatedField(
        queryset=Machine.objects.all(),
        source="machine",
        write_only=True,
        allow_null=True,
    )
    material_id = serializers.PrimaryKeyRelatedField(
        queryset=Material.objects.all(),
        source="material",
        write_only=True,
        allow_null=True,
    )

    class Meta:
        model = BuildProfile
        fields = "__all__"
        extra_kwargs = {"created_by": {"required": False}}

    def get_material_name(self, obj):
        return obj.material.name if obj.material else None

    def get_machine_name(self, obj):
        return obj.machine.name if obj.machine else None


class BuildProfileDetailSerializer(serializers.ModelSerializer):
    machine = MachineSerializer(read_only=True)
    material = MaterialSerializer(read_only=True)

    machine_id = serializers.PrimaryKeyRelatedField(
        queryset=Machine.objects.all(),
        source="machine",
        write_only=True,
        allow_null=True,
    )
    material_id = serializers.PrimaryKeyRelatedField(
        queryset=Material.objects.all(),
        source="material",
        write_only=True,
        allow_null=True,
    )

    class Meta:
        model = BuildProfile
        fields = "__all__"
        extra_kwargs = {"created_by": {"required": False}}

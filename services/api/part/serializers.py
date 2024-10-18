from rest_framework import serializers
from part.models import Part, PartFile

# Part File
class PartFileListSerializer(serializers.ModelSerializer):
    """Serializer for listing part files with all fields except the file."""
    class Meta:
        model = PartFile
        fields = "__all__"
        extra_kwargs = {'created_by': {'required': False}}
    
    def to_representation(self, instance):
        """Modify representation to exclude 'file' field on read."""
        data = super().to_representation(instance)
        # Remove 'file' field from the serialized response
        data.pop('file', None)
        return data

class PartFileDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed view of part files with all fields."""
    class Meta:
        model = PartFile
        fields = "__all__"
        extra_kwargs = {'created_by': {'required': False}}

# Part
class PartListSerializer(serializers.ModelSerializer):
    part_file = PartFileListSerializer(read_only=True)  # Active part file (nested)
    
    part_file_id = serializers.PrimaryKeyRelatedField(
        queryset=PartFile.objects.all(), source="part_file", write_only=True, allow_null=True
    )
    
    part_files = PartFileListSerializer(many=True, read_only=True)  # Nested for all part files

    part_file_ids = serializers.PrimaryKeyRelatedField(
        queryset=PartFile.objects.all(), many=True, source="part_files", write_only=True
    )

    class Meta:
        model = Part
        fields = "__all__"
        extra_kwargs = {
            "created_by": {"required": False},
            "created_on": {"read_only": True},
            "updated_on": {"read_only": True},
        }

    def create(self, validated_data):
        part_files = validated_data.pop("part_files", [])
        part_file = validated_data.pop("part_file", None)

        part = Part.objects.create(**validated_data)

        if part_file:
            part.part_file = part_file  # Set active part file
        part.part_files.set(part_files)  # Set many-to-many relationship

        part.save()
        return part

    def update(self, instance, validated_data):
        part_files = validated_data.pop("part_files", None)
        part_file = validated_data.pop("part_file", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if part_file is not None:
            instance.part_file = part_file  # Update active part file

        if part_files is not None:
            instance.part_files.set(part_files)  # Update many-to-many relationship

        instance.save()
        return instance

class PartDetailSerializer(serializers.ModelSerializer):
    part_file = PartFileDetailSerializer(read_only=True)
    part_files = PartFileListSerializer(many=True, read_only=True)  # Nested representation

    part_file_id = serializers.PrimaryKeyRelatedField(
        queryset=PartFile.objects.all(), source="part_file", write_only=True, required=False
    )

    part_file_ids = serializers.PrimaryKeyRelatedField(
        queryset=PartFile.objects.all(), many=True, source="part_files", write_only=True, required=False
    )

    class Meta:
        model = Part
        fields = "__all__"
        extra_kwargs = {
            "created_by": {"required": False},
            "created_on": {"read_only": True},
            "updated_on": {"read_only": True},
        }

    def update(self, instance, validated_data):
        part_files = validated_data.pop("part_files", None)
        part_file = validated_data.pop("part_file", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if part_file is not None:
            instance.part_file = part_file  # Update active part file

        if part_files is not None:
            instance.part_files.set(part_files)  # Update many-to-many relationship

        instance.save()
        return instance


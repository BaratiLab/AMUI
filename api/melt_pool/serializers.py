from rest_framework import serializers
from melt_pool.models import ClassificationRecord, GeometryRecord


class ClassificationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassificationRecord
        fields = "__all__"
        # extra_kwargs = {'created_by': {'required': False}}


class GeometryRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeometryRecord
        fields = "__all__"

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response

from melt_pool.models import ClassificationRecord, GeometryRecord
from melt_pool.serializers import (
    ClassificationRecordSerializer,
    GeometryRecordSerializer,
)

filterset_fields = [
    "material",
    "process",
    "power",
    "velocity",
    "hatch_spacing",
]


class ClassificationRecordsList(generics.ListAPIView):
    """
    List melt pool classification records.
    """

    queryset = ClassificationRecord.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = filterset_fields
    serializer_class = ClassificationRecordSerializer
    permission_classes = (AllowAny,)


class GeometryRecordsList(generics.ListAPIView):
    """
    List melt pool geometry records.
    """

    queryset = GeometryRecord.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = filterset_fields
    serializer_class = GeometryRecordSerializer
    permission_classes = (AllowAny,)

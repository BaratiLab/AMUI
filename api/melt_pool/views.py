from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response

from melt_pool.models import Record
from melt_pool.serializers import RecordSerializer

filterset_fields = [
    "material",
    "process",
    "power",
    "velocity",
    "hatch_spacing",
]


class RecordsList(generics.ListAPIView):
    """
    List melt pool classification records.
    """

    queryset = Record.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = filterset_fields
    serializer_class = RecordSerializer
    permission_classes = (AllowAny,)


class ProcessParametersDict(APIView):
    """
    Dictionary of melt pool process parameters
    """

    permission_classes = (AllowAny,)

    def get(self, request):
        unique_values = {}
        queryset = Record.objects.all()
        serializer = RecordSerializer(queryset, many=True)
        data = serializer.data

        for field_name in Record._meta.get_fields():
            values = queryset.values_list(field_name.name, flat=True).distinct()
            unique_values[field_name.name] = list(values)

        return Response(unique_values)

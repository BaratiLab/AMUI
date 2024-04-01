from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
import pickle
import numpy as np

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

        for field_name in filterset_fields:
            values = queryset.values_list(field_name, flat=True).distinct()

            unique_values[field_name] = sorted([x for x in values if x is not None])

        return Response(unique_values)

class Inference(APIView):
    """
    Load classfication model and run inference
    """

    permission_classes = (AllowAny,)

    def get(self, request):
        with open('./melt_pool/rf.pt', 'rb') as f:
            model = pickle.load(f)
        with open('./melt_pool/material_mapping.pkl', 'rb') as f:
            material_mapping = pickle.load(f)

        material = request.query_params.get('mat')
        power = float(request.query_params.get('p'))
        velocity = float(request.query_params.get('v'))

        features = np.array([power, velocity, *material_mapping[material]]).reshape(1, -1)
        prediction = model.predict(features)

        return Response({'prediction': prediction[0]})

class EagarTsai(APIView):
    """
    Performs Eagar Tsai calculations given a range of power and velocity
    """

    permission_classes = (AllowAny,)

    def get(self, request):
        print("called a")

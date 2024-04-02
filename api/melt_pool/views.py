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

        material = material_mapping[request.query_params.get('mat')]
        min_p = int(request.query_params.get('minp'))
        power = int(request.query_params.get('maxp'))
        velocity = int(request.query_params.get('minv'))
        max_v = int(request.query_params.get('maxv'))

        p_step, v_step = 10, 0.1
        preds = []
        while power >= min_p:
            temp = []
            v = velocity
            while v <= max_v:
                features = np.array([[power, v, *material]])
                temp.append(model.predict(features)[0])
                v += v_step
            preds.append(temp)
            power -= p_step

        return Response({'prediction': preds})

# class EagarTsai(APIView):
#     """
#     Performs Eagar Tsai calculations given a range of power and velocity
#     """

#     permission_classes = (AllowAny,)

#     def get(self, request):

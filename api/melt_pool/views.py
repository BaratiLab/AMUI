from django_filters.rest_framework import DjangoFilterBackend, FilterSet, NumberFilter
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from datasets import load_dataset
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

class RecordFilter(FilterSet):
    power_min = NumberFilter(field_name="power", lookup_expr='gte')
    power_max = NumberFilter(field_name="power", lookup_expr='lte')
    velocity_min = NumberFilter(field_name="velocity", lookup_expr='gte')
    velocity_max = NumberFilter(field_name="velocity", lookup_expr='lte')
    hatch_spacing_min = NumberFilter(field_name="hatch_spacing", lookup_expr='gte')
    hatch_spacing_max = NumberFilter(field_name="hatch_spacing", lookup_expr='lte')

    class Meta:
        model = Record
        fields = filterset_fields + ['power_min', 'power_max', 'velocity_min', 'velocity_max', 'hatch_spacing_min', 'hatch_spacing_max']


class RecordsList(generics.ListAPIView):
    """
    List melt pool classification records.
    """

    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    permission_classes = (AllowAny,)
    filter_backends = [DjangoFilterBackend]
    filterset_class = RecordFilter

# class ProcessParametersDict(APIView):
#     """
#     Dictionary of melt pool process parameters
#     """

#     permission_classes = (AllowAny,)

#     def get(self, request):
#         unique_values = {}
#         queryset = Record.objects.all()
#         serializer = RecordSerializer(queryset, many=True)
#         data = serializer.data

#         for field_name in filterset_fields:
#             values = queryset.values_list(field_name, flat=True).distinct()

#             unique_values[field_name] = sorted([x for x in values if x is not None])

#         return Response(unique_values)

class ProcessParametersDict(APIView):
    """
    Provides a dictionary of process parameters by material
    """

    permission_classes = (AllowAny,)

    def get(self, request):

        material = request.GET.get("material", None)
        # print(material)
        unique_values = {}
        if material is not None:
            queryset = Record.objects.filter(material=material)
        else: 
            queryset = Record.objects.all()
        serializer = RecordSerializer(queryset, many=True)
        data = serializer.data

        for field_name in filterset_fields:
            values = queryset.values_list(field_name, flat=True).distinct()

            unique_values[field_name] = sorted([x for x in values if x is not None])

        power_marks = [{"value": x, "label": f"{x:.0f}"} for x in unique_values["power"]]
        hatch_spacing_marks = [{"value": x, "label": f"{x} µm"} for x in unique_values["hatch_spacing"]]
        velocity_marks = [{"value": x, "label": f"{x} m/s"} for x in unique_values["velocity"]]

        marks = {
            "power_marks": power_marks,
            "hatch_spacing_marks": hatch_spacing_marks,
            "velocity_marks": velocity_marks,
        }

        return Response(marks)

class MetalsDict(APIView):
    """
    Retreives materials from records
    TODO: Move this to material app.
    """

    permission_classes = (AllowAny,)

    def get(self, request):
        unique_values = {}
        queryset = Record.objects.all()
        serializer = RecordSerializer(queryset, many=True)
        data = serializer.data

        # for field_name in filterset_fields:
        values = queryset.values_list('material', flat=True).distinct()

        metals = sorted([x for x in values if x is not None])

        return Response(metals)

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

class EagarTsai(APIView):
    """
    Performs Eagar Tsai calculations given a range of power and velocity
    """

    permission_classes = (AllowAny,)

    def get(self, request):
        print("called a")
        ds = load_dataset("baratilab/Eagar-Tsai", streaming="true", split="Ti64")
        dimensions = {}
        for data in ds:
            dimensions = data
            
        print(f"ds, {dimensions}")
        return Response(dimensions)

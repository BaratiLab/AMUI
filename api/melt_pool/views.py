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

    def calc_abs_coeff1(self, min_abs, P, T1, rho, Cp, Vs, r0):
        T0 = 293
        numerator = min_abs * P
        denominator = (T1 - T0) * np.pi * rho * Cp * Vs * (r0**2)
        return 0.7 * (1 - np.exp(-0.6 * numerator / denominator))

    def calc_abs_coeff2(self, k, T1, W, rho, Cp, V, P):
        T0 = 293
        numerator = (np.pi * k * (T1 - T0) * W) + (np.e * np.pi * rho * Cp * (T1 - T0) * V * (W**2) / 8)
        denominator = P
        return numerator / denominator

    def get(self, request):
        with open('./melt_pool/rf.pt', 'rb') as f:
            model = pickle.load(f)
        with open('./melt_pool/material_mapping.pkl', 'rb') as f:
            material_mapping = pickle.load(f)

        material = request.query_params.get('mat')
        min_p = int(request.query_params.get('minp'))
        max_p = int(request.query_params.get('maxp'))
        min_v = int(request.query_params.get('minv'))
        max_v = int(request.query_params.get('maxv'))
        r0 = int(request.query_params.get('r0'))  # TODO: r0 is beam radius
        W = int(request.query_params.get('W'))  # TODO: W is meltpool width

        p_step = int(request.query_params.get('pstep')) if request.query_params.get('pstep') else 10
        v_step = float(request.query_params.get('vstep')) if request.query_params.get('vstep') else 0.1

        composition = material_mapping[material]['composition']
        min_abs = material_mapping[material]['min_absorptivity']
        T1 = material_mapping[material]['melting_point']
        rho = material_mapping[material]['density']
        Cp = material_mapping[material]['specific_heat']
        k = material_mapping[material]['thermal_conductivity']

        preds = []
        p = max_p
        while p >= min_p:
            temp = []
            v = min_v
            while v <= max_v:
                abs_coeff1 = self.calc_abs_coeff1(min_abs, p, T1, rho, Cp, v, r0)
                abs_coeff2 = self.calc_abs_coeff2(k, T1, W, rho, Cp, v, p)
                features = np.array([[p, v, abs_coeff1, abs_coeff2, *composition]])
                temp.append(model.predict(features)[0])
                v += v_step
            preds.append(temp)
            p -= p_step

        return Response({'prediction': preds})

# class EagarTsai(APIView):
#     """
#     Performs Eagar Tsai calculations given a range of power and velocity
#     """

#     permission_classes = (AllowAny,)

#     def get(self, request):

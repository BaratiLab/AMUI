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

    def calc_abs_coeff1(self, min_abs, P, T1, rho, Cp, Vs, r0):
        T0 = 293
        numerator = min_abs * P
        denominator = (T1 - T0) * np.pi * rho * Cp * Vs * (r0**2) + 1e-16
        return 0.7 * (1 - np.exp(-0.6 * numerator / denominator))

    def calc_abs_coeff2(self, k, T1, W, rho, Cp, V, P):
        T0 = 293
        numerator = (np.pi * k * (T1 - T0) * W) + (np.e * np.pi * rho * Cp * (T1 - T0) * V * (W**2) / 8)
        denominator = P + 1e-16
        return numerator / denominator

    def convert_to_dict(self, Ws):
        Ps = [
            0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 
            260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480
        ]
        Vs = [
            0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 
            1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 
            2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9
        ]
        W_dict = {}
        for i in range(25):
            p = Ps[i]
            W_dict[p] = {}
            for j in range(30):
                v = Vs[j]
                W_dict[p][v] = Ws[i][j]

        return W_dict        
    
    def replace_special_characters(self, text):
        """
        Replace special characters "-", ".", " ", and "/" with an empty string.

        Args:
        text (str): The input text.

        Returns:
        str: The text with special characters replaced.
        """

        if (text is not None):
            special_characters = ["-", ".", " ", "/"]
            for char in special_characters:
                text = text.replace(char, "")
        return text
    
    def get(self, request):
        with open('./melt_pool/rf.pt', 'rb') as f:
            model = pickle.load(f)
        with open('./melt_pool/material_mapping.pkl', 'rb') as f:
            material_mapping = pickle.load(f)

        material = request.query_params.get('material')
        min_p = float(request.query_params.get('power_min'))
        max_p = float(request.query_params.get('power_max'))
        min_v = float(request.query_params.get('velocity_min'))
        max_v = float(request.query_params.get('velocity_max'))
        # r0 = int(request.query_params.get('r0'))  # TODO: r0 is beam radius
        r0 = 50e-6
        # W = int(request.query_params.get('W'))  # TODO: W is meltpool width
        Ws = self.convert_to_dict(
            next(iter(load_dataset(
                "baratilab/Eagar-Tsai",
                "process_maps",
                split=f"m_{self.replace_special_characters(material)}_p_0_480_20_v_0.0_2.9_0.1"
            )))['widths']
        )

        p_step = float(request.query_params.get('power_step')) if request.query_params.get('power_step') else 10
        v_step = float(request.query_params.get('velocity_step')) if request.query_params.get('velocity_step') else 0.1

        composition = material_mapping[material]['composition']
        min_abs = material_mapping[material]['min_absorptivity']
        T1 = material_mapping[material]['melting_point']
        rho = material_mapping[material]['density']
        Cp = material_mapping[material]['specific_heat']
        k = material_mapping[material]['thermal_conductivity']

        preds = []
        p = min_p
        while p <= max_p:
            temp = []
            v = min_v
            while v - max_v < 1e-8:
                W = Ws.get(p, {}).get(v, 0.0001)
                abs_coeff1 = self.calc_abs_coeff1(min_abs, p, T1, rho, Cp, v, r0)
                abs_coeff2 = self.calc_abs_coeff2(k, T1, W, rho, Cp, v, p)
                features = np.array([[p, v, abs_coeff1, abs_coeff2, *composition]])
                temp.append(model.predict(features)[0])
                v += v_step
            preds.append(temp)
            p += p_step

        # {0: 'LOF', 1: 'balling', 2: 'desirable', 3: 'keyhole'}
        return Response({'prediction': preds})

class EagarTsai(APIView):
    """
    Performs Eagar Tsai calculations given a range of power and velocity
    """

    permission_classes = (AllowAny,)

    def replace_special_characters(self, text):
        """
        Replace special characters "-", ".", " ", and "/" with an empty string.

        Args:
        text (str): The input text.

        Returns:
        str: The text with special characters replaced.
        """

        if (text is not None):
            special_characters = ["-", ".", " ", "/"]
            for char in special_characters:
                text = text.replace(char, "")
        return text

    def get(self, request):
        material = request.query_params.get('material')
        material_name = self.replace_special_characters(material)

        ds = load_dataset(
            "baratilab/Eagar-Tsai",
            "process_maps",
            # split="m_Ti64_p_0_480_20_v_0.0_2.9_0.1",
            # split="m_IN625_p_0_480_20_v_0.0_2.9_0.1",
            # split="m_AlSi10Mg_p_0_480_20_v_0.0_2.9_0.1",
            # split="m_CMSX4_p_0_480_20_v_0.0_2.9_0.1",
            # split="m_HastelloyX_p_0_480_20_v_0.0_2.9_0.1",
            # split="m_IN625_p_0_480_20_v_0.0_2.9_0.1",
            # split="m_IN718_p_0_480_20_v_0.0_2.9_0.1",
            # split="m_Invar36_p_0_480_20_v_0.0_2.9_0.1",
            # split="m_K403superalloy_p_0_480_20_v_0.0_2.9_0.1",
            # split="m_SS174PH_p_0_480_20_v_0.0_2.9_0.1",
            # split="m_SS304_p_0_480_20_v_0.0_2.9_0.1",
            # split="m_SS304L_p_0_480_20_v_0.0_2.9_0.1",
            # split="m_SS316L_p_0_480_20_v_0.0_2.9_0.1",
            # split="m_Ti49Al2Cr2Nb_p_0_480_20_v_0.0_2.9_0.1",
            # split="m_Ti6Al4V_p_0_480_20_v_0.0_2.9_0.1",
            # split="m_TiCInconel718_p_0_480_20_v_0.0_2.9_0.1",

            split=f"m_{material_name}_p_0_480_20_v_0.0_2.9_0.1",
            streaming="true",
        )

        dimensions = {}
        for data in ds:
            dimensions = data
            # if material == "Ti-6Al-4V":
            #     with open("./melt_pool/ti64_surrogate.pkl", "rb") as f:
            #         surrogate = pickle.load(f)              
            #         dimensions = {
            #             **dimensions,
            #             **surrogate,
            #         }
            
        return Response(dimensions)

class Flow3d(APIView):

    permission_classes = (AllowAny, )

    def get(self, request):
        with open('./melt_pool/dimensions.pkl', 'rb') as f:
            dimensions = pickle.load(f)

        return Response(dimensions)
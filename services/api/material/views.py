# from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.permissions import AllowAny
# from rest_framework.response import Response

from material.models import Material
from material.serializers import MaterialSerializer

class MaterialList(generics.ListAPIView):
    """
    List available material specifications.
    """

    queryset = Material.objects.all()
    # filter_backends = [DjangoFilterBackend]
    serializer_class = MaterialSerializer
    permission_classes = (AllowAny,)

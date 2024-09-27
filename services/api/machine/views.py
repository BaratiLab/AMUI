# from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
# from rest_framework.response import Response

from machine.models import Machine 
from machine.serializers import MachineSerializer

class MachineList(generics.ListAPIView):
    """
    List available machine specifications.
    """

    queryset = Machine.objects.all()
    # filter_backends = [DjangoFilterBackend]
    serializer_class = MachineSerializer
    permission_classes = (AllowAny,)

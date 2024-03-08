# from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
# from rest_framework.response import Response

from machine.models import Specification 
from machine.serializers import SpecificationSerializer

class SpecificationsList(generics.ListAPIView):
    """
    List available machine specifications.
    """

    queryset = Specification.objects.all()
    # filter_backends = [DjangoFilterBackend]
    serializer_class = SpecificationSerializer
    permission_classes = (AllowAny,)

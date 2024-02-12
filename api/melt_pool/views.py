from rest_framework import generics, mixins
from rest_framework.permissions import AllowAny 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status, mixins

from melt_pool.models import ClassificationRecord, GeometryRecord
from melt_pool.serializers import ClassificationRecordSerializer, GeometryRecordSerializer

class ClassificationRecordsList(mixins.ListModelMixin, generics.GenericAPIView):
  """
  List melt pool classification records.
  """
  queryset = ClassificationRecord.objects.all()
  serializer_class = ClassificationRecordSerializer 
  permission_classes = (AllowAny, )

  def get(self, request, *args, **kwargs):
    return self.list(request, *args, **kwargs)

class GeometryRecordsList(mixins.ListModelMixin, generics.GenericAPIView):
  """
  List melt pool geometry records.
  """
  queryset = GeometryRecord.objects.all()
  serializer_class = GeometryRecordSerializer 
  permission_classes = (AllowAny, )

  def get(self, request, *args, **kwargs):
    return self.list(request, *args, **kwargs)

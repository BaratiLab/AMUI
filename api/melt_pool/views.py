from rest_framework import generics, mixins

from melt_pool.models import Classification, Geometry 

class GeometryList(mixins.ListModelMixin, generics.GenericAPIView):
  """
  List melt pool entries.
  """
  queryset = Geometry.objects.all()
  # serializer_class = ProjectSerializer
  # permission_classes = (IsAuthenticated, )

  def get(self, request, *args, **kwargs):
    # print(request.user)
    return self.list(request, *args, **kwargs)

class ClassificationList(mixins.ListModelMixin, generics.GenericAPIView):
  """
  List melt pool entries.
  """
  queryset = Classification.objects.all()
  # serializer_class = ProjectSerializer
  # permission_classes = (IsAuthenticated, )

  def get(self, request, *args, **kwargs):
    # print(request.user)
    return self.list(request, *args, **kwargs)

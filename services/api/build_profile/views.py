from django.http import Http404
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status, mixins

from build_profile.models import BuildProfile
from build_profile.serializers import BuildProfileSerializer

class BuildProfileList(mixins.ListModelMixin, generics.GenericAPIView):
  """
  List all build profiles or create a new build profile.
  """
  queryset = BuildProfile.objects.all()
  serializer_class = BuildProfileSerializer
  permission_classes = (IsAuthenticated, )

  def get(self, request, *args, **kwargs):
    return self.list(request, *args, **kwargs)

  def post(self, request, *args, **kwargs):
    serializer = BuildProfileSerializer(data = request.data)
    if serializer.is_valid():
      serializer.save(created_by=self.request.user)
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BuildProfileDetail(APIView):
  """
  Retrieve, update or delete a build_profile instance.
  """

  def get_object(self, pk):
    try:
      return BuildProfile.objects.get(pk=pk)
    except BuildProfile.DoesNotExist:
      raise Http404

  def get(self, request, pk, format=None):
    build_profile = self.get_object(pk)
    serializer = BuildProfileSerializer(build_profile)
    return Response(serializer.data)

  def put(self, request, pk, format=None):
    build_profile = self.get_object(pk)
    serializer = BuildProfileSerializer(build_profile, data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  def delete(self, request, pk, format=None):
    build_profile = self.get_object(pk)
    build_profile.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
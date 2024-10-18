from django.http import Http404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics, status, mixins

from part.models import Part, PartFile
from part.serializers import (
    PartListSerializer,
    PartDetailSerializer,
    PartFileListSerializer,
    PartFileDetailSerializer,
)


# Part
class PartList(mixins.ListModelMixin, generics.GenericAPIView):
    """
    List all parts or create a new part.
    """

    serializer_class = PartListSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """Filter parts based on the authenticated user."""
        return Part.objects.filter(created_by=self.request.user)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        serializer = PartListSerializer(data=request.data)
        if serializer.is_valid():
            # Handle the part_files field (if provided) using primary keys
            part = serializer.save(created_by=request.user)

            # Optional: Associate PartFiles if IDs are passed in the request
            part_file_ids = request.data.get("part_files", [])
            if part_file_ids:
                part_files = PartFile.objects.filter(id__in=part_file_ids)
                part.part_files.set(part_files)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PartDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a part instance.
    """

    serializer_class = PartDetailSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """Filter parts based on the authenticated user."""
        return Part.objects.filter(created_by=self.request.user)

    def perform_update(self, serializer):
        # Handle the part_files field during update if provided in the request
        part_file_ids = self.request.data.get("part_files", [])
        if part_file_ids:
            part_files = PartFile.objects.filter(id__in=part_file_ids)
            serializer.save(part_files=part_files)
        else:
            serializer.save()

# Part File
class PartFileList(mixins.ListModelMixin, generics.GenericAPIView):
    """
    List all part files or create a new part file.
    """

    serializer_class = PartFileListSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """Filter parts based on the authenticated user."""
        return PartFile.objects.filter(created_by=self.request.user)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        serializer = PartFileListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PartFileDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a PartFile instance.
    """

    serializer_class = PartFileDetailSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """Filter parts based on the authenticated user."""
        return PartFile.objects.filter(created_by=self.request.user)


# from django.http import Http404
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import generics, status, mixins

# from part.models import Part
# from part.serializers import PartSerializer

# class PartList(mixins.ListModelMixin, generics.GenericAPIView):
#   """
#   List all parts or create a new part.
#   """
#   queryset = Part.objects.all()
#   serializer_class = PartSerializer
#   permission_classes = (IsAuthenticated, )

#   def get(self, request, *args, **kwargs):
#     return self.list(request, *args, **kwargs)

#   def post(self, request, *args, **kwargs):
#     serializer = PartSerializer(data = request.data)
#     if serializer.is_valid():
#       serializer.save(created_by=self.request.user)
#       return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class PartDetail(APIView):
#   """
#   Retrieve, update or delete a part instance.
#   """

#   def get_object(self, pk):
#     try:
#       return Part.objects.get(pk=pk)
#     except Part.DoesNotExist:
#       raise Http404

#   def get(self, request, pk, format=None):
#     part = self.get_object(pk)
#     serializer = PartSerializer(part)
#     return Response(serializer.data)

#   def put(self, request, pk, format=None):
#     part = self.get_object(pk)
#     serializer = PartSerializer(part, data=request.data)
#     if serializer.is_valid():
#       serializer.save()
#       return Response(serializer.data)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#   def delete(self, request, pk, format=None):
#     part = self.get_object(pk)
#     part.delete()
#     return Response(status=status.HTTP_204_NO_CONTENT)

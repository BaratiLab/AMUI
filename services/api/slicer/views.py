import subprocess

from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from slicer.serializers import UploadedFileSerializer

class SlicerSTLToGCode(APIView):
    """
    Slices STL file to GCode
    """

    permission_classes = (AllowAny, )

    def post(self, request):
        response = subprocess.run(["prusa-slicer", "--gcode", "./static/stl/cube.stl"])
        print(response)
        return Response({'message': str(response)}, status=status.HTTP_201_CREATED)

# from django.shortcuts import render
# from rest_framework.response import Response
# from rest_framework.decorators import  api_view

# @api_view(['POST'])
# def stl_to_gcode(request):
#     if request.method == 'POST':
#         response = subprocess.run(["ls"])
#         return Response(response)

class UploadFile(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = (AllowAny, )

    def post(self, request, *args, **kwargs):
        file_serializer = UploadedFileSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

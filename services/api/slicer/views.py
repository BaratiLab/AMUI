import subprocess

from rest_framework.generics import ListAPIView
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
        print(request.data)
        file = request.data.get("file")
        subprocess.run(["prusa-slicer", "--gcode", f".{file}"])
        gcode_file = file[:-3] + "gcode"
        return Response({'file': str(gcode_file)}, status=status.HTTP_201_CREATED)

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

# class GCodeFilesList(ListAPIView):
class UploadAndSlice(APIView):
    """
    Route for Uploading 3D model and Slicing
    """

    permission_classes = (AllowAny, )

    def post(self, request):
        file_serializer = UploadedFileSerializer(data = request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            data = file_serializer.data
            file = data["file"]
            subprocess.run(["prusa-slicer", "--gcode", f".{file}"])
            gcode_file = file[:-3] + "gcode"
            return Response({'file': str(gcode_file)}, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


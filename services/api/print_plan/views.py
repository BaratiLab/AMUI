import os
import subprocess

from django.http import Http404
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status, mixins

from print_plan.models import PrintPlan
from print_plan.serializers import PrintPlanListSerializer, PrintPlanDetailSerializer


class PrintPlanList(mixins.ListModelMixin, generics.GenericAPIView):
    """
    List all print plans or create a new print plan.
    """

    queryset = PrintPlan.objects.all()
    serializer_class = PrintPlanListSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        serializer = PrintPlanListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PrintPlanDetail(APIView):
    """
    Retrieve, update or delete a print plan instance.
    """

    def get_object(self, pk):
        try:
            return PrintPlan.objects.get(pk=pk)
        except PrintPlan.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        print_plan = self.get_object(pk)
        serializer = PrintPlanDetailSerializer(print_plan)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        print_plan = self.get_object(pk)
        serializer = PrintPlanDetailSerializer(print_plan, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        print_plan = self.get_object(pk)
        print_plan.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class PrintPlanDetailGenerateGCode(APIView):
    """
    Slices STL file to GCode
    """

    permission_classes = (IsAuthenticated,)

    def post(self, request, pk, format=None):
        try:
            print_plan = PrintPlan.objects.get(pk=pk)
        except PrintPlan.DoesNotExist:
            return Response({"error": "Print plan not found."}, status=status.HTTP_404_NOT_FOUND)

        stl_file = print_plan.part.part_file.file
        stl_file_path = stl_file.path
        if not os.path.isfile(stl_file_path):
            return Response({"error": "STL file not found."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate the G-code file name by replacing the `.stl` extension
        gcode_file_path = stl_file_path.replace(".stl", ".gcode")

        # Prevent "/media/home/api/media/uploads" prefix
        gcode_file_path = gcode_file_path.replace("/home/api/media", "")

        print(stl_file_path)
        print(gcode_file_path)

        try:
            # Run the slicer command (ensure prusa-slicer is installed and in PATH)
            subprocess.run(["prusa-slicer", "--gcode", stl_file_path])
        except subprocess.CalledProcessError as e:
            return Response(
                {"error": f"G-code generation failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
        # Update the PrintPlan instance with the generated G-code file
        print_plan.gcode_file.name = gcode_file_path  # Save the relative path
        print_plan.save()

        serializer = PrintPlanDetailSerializer(print_plan)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

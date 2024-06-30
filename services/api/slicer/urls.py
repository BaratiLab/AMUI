from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from slicer import views

urlpatterns = [
    path("slicer/stl_to_gcode/", views.SlicerSTLToGCode.as_view()),
    path("slicer/upload_and_slice/", views.UploadAndSlice.as_view()),
    path("slicer/upload_file/", views.UploadFile.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)

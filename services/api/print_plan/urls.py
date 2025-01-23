from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from print_plan import views

urlpatterns = [
    path("print_plan/", views.PrintPlanList.as_view()),
    path("print_plan/<int:pk>/", views.PrintPlanDetail.as_view()),
    path("print_plan/<int:pk>/generate_gcode", views.PrintPlanDetailGenerateGCode.as_view()),
]

# Handles url requests such as `http://localhost:8000/projects/1.json`.
urlpatterns = format_suffix_patterns(urlpatterns)

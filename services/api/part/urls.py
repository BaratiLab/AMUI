from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from part import views

urlpatterns = [
    path("part/", views.PartList.as_view()),
    path("part/<int:pk>/", views.PartDetail.as_view()),
]

# Handles url requests such as `http://localhost:8000/projects/1.json`.
urlpatterns = format_suffix_patterns(urlpatterns)

from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from build_profile import views

urlpatterns = [
  path("build_profile/", views.BuildProfileList.as_view()),
  path("build_profile/<int:pk>/", views.BuildProfileDetail.as_view()),
]

# Handles url requests such as `http://localhost:8000/projects/1.json`.
urlpatterns = format_suffix_patterns(urlpatterns)

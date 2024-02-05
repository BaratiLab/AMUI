from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from melt_pool import views

urlpatterns = [
  path("classification/", views.ClassificationList.as_view()),
  path("geometry/", views.GeometryList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)

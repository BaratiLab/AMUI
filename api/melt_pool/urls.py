from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from melt_pool import views

urlpatterns = [
  path("melt_pool/classification_records/", views.ClassificationRecordsList.as_view()),
  path("melt_pool/geometry_records/", views.GeometryRecordsList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)

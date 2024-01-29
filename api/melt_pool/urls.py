from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from melt_pool import views

urlpatterns = [
  path("meltpoolclassification/", views.MeltPoolClassificationList.as_view()),
  path("meltpoolgeometry/", views.MeltPoolGeometryList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)

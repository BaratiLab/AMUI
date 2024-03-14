from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from melt_pool import views

urlpatterns = [
    path("melt_pool/records/", views.RecordsList.as_view()),
    path("melt_pool/process_parameters/", views.ProcessParametersDict.as_view()),
    path("melt_pool/infer/", views.Inference.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)

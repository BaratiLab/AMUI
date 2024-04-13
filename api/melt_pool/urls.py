from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from melt_pool import views

urlpatterns = [
    path("melt_pool/records/", views.RecordsList.as_view()),
    path("melt_pool/process_parameters/", views.ProcessParametersDict.as_view()),

    # TODO: Move route to materials app
    path("melt_pool/metals/", views.MetalsDict.as_view()),

    path("melt_pool/inference/", views.Inference.as_view()),
    path("melt_pool/eagar_tsai/", views.EagarTsai.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)

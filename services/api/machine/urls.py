from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from machine import views

urlpatterns = [
    path("machine/", views.MachineList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)

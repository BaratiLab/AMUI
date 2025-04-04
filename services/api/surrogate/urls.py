from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from surrogate import views

urlpatterns = [
    path("surrogate/simulation/", views.Simulation.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)

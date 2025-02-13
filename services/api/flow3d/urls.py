from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from flow3d import views

urlpatterns = [
    path("flow3d/test_task/", views.Flow3DTestTask.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)

from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from material import views

urlpatterns = [
    path("material/list/", views.MaterialList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)

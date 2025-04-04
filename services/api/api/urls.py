"""
URL configuration for api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from django.views.generic import TemplateView

from api import views

urlpatterns = [
    path("", include("build_profile.urls")),
    path("", include("flow3d.urls")),
    path("", include("melt_pool.urls")),
    path("", include("machine.urls")),
    path("", include("material.urls")),
    path("", include("part.urls")),
    path("", include("print_plan.urls")),
    path("", include("surrogate.urls")),
    path("", include("slicer.urls")),
    path("api/csrf-token/", views.get_csrf_token),
    static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)[0],
    path("", TemplateView.as_view(template_name="index.html"), {"resource": ""}),
    path("<path:resource>", TemplateView.as_view(template_name="index.html")),
    # path('admin/', admin.site.urls),
]

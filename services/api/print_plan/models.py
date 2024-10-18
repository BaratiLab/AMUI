from django.db import models
from auth0.models import Auth0User
from build_profile.models import BuildProfile
from part.models import Part


class PrintPlan(models.Model):
    created_by = models.ForeignKey(Auth0User, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100, blank=True, default="")
    build_profile = models.ForeignKey(
        BuildProfile, on_delete=models.CASCADE, null=True, blank=True
    )
    part = models.ForeignKey(Part, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        ordering = ["created_on", "updated_on"]

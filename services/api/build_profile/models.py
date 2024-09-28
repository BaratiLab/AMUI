from django.db import models

from auth0.models import Auth0User
from material.models import Material
from machine.models import Machine 

class BuildProfile(models.Model):
    created_by = models.ForeignKey(Auth0User, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=100, blank=True, default="")
    description = models.CharField(max_length=512, blank=True, default="")
    material = models.ForeignKey(Material, on_delete=models.CASCADE, null=True, blank=True)
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        ordering = ["title", "description", "created_on", "updated_on"]
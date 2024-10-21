from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from auth0.models import Auth0User
from material.models import Material
from machine.models import Machine


class BuildProfile(models.Model):
    created_by = models.ForeignKey(Auth0User, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100, blank=True, default="")
    material = models.ForeignKey(
        Material, on_delete=models.CASCADE, null=True, blank=True
    )
    machine = models.ForeignKey(
        Machine, on_delete=models.CASCADE, null=True, blank=True
    )
    hatch_spacing = models.DecimalField(
        max_digits=8, decimal_places=6, default = 0.000050
    )
    layer_thickness = models.DecimalField(
        max_digits=8, decimal_places=6, default = 0.000030
    )
    power = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(10_000)],
        help_text="Enter a power value (Watts) between 0 and 10,000",
        default=100
    )
    velocity = models.DecimalField(
        max_digits=8, decimal_places=6, default = 0.5
    )

    class Meta:
        ordering = ["name", "created_on", "updated_on"]

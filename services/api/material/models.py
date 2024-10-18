from django.db import models


# Create your models here.
class Material(models.Model):
    name = models.CharField(max_length=100)
    flow_3d_name = models.CharField(max_length=100, default="Unknown")
    uns_id = models.CharField(max_length=16, default="Unknown")
    density_g_cm_3 = models.FloatField(blank=True, null=True)  # g/cm^3
    specific_heat_erg_g_K = models.FloatField(blank=True, null=True)  # erg/g/K
    thermal_conductivity_erg_cm_s_K = models.FloatField(
        blank=True, null=True
    )  # erg/cm/s/K
    # surface_tension_erg_cm_2 = models.FloatField(blank=True, null=True)             # erg/cm^2 (Units assumed)
    viscosity_g_cm_s = models.FloatField(blank=True, null=True)  # g/cm/s
    # latent_heat_of_vaporization_J_kg
    solidus_temperature_K = models.FloatField(blank=True, null=True)  # K
    liquidus_temperature_K = models.FloatField(blank=True, null=True)  # K

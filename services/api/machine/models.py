from django.db import models

class Machine(models.Model):
    name = models.CharField(max_length=100)
    company = models.CharField(max_length=100, default="Unknown")
    power_max_w = models.IntegerField(blank=True, null=True)
    power_min_w = models.IntegerField(blank=True, null=True)
    velocity_max_m_per_s = models.IntegerField(blank=True, null=True)
    velocity_min_m_per_s = models.IntegerField(blank=True, null=True)
    spot_size_min_microns = models.IntegerField(blank=True, null=True)
    spot_size_max_microns = models.IntegerField(blank=True, null=True)
    laser_type = models.CharField(blank=True, null=True, max_length=100)
    layer_thickness_min_microns = models.IntegerField(blank=True, null=True)
    layer_thickness_max_microns = models.IntegerField(blank=True, null=True)
    tds_link = models.URLField(blank=True, null=True)
    image_link = models.URLField(blank=True, null=True) 
    company_logo_link = models.URLField(blank=True, null=True) 

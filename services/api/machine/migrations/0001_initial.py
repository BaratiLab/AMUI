# Generated by Django 5.0.1 on 2024-09-27 14:41

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Machine",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("company", models.CharField(default="Unknown", max_length=100)),
                ("power_max_w", models.IntegerField(blank=True, null=True)),
                ("power_min_w", models.IntegerField(blank=True, null=True)),
                ("velocity_max_m_per_s", models.IntegerField(blank=True, null=True)),
                ("velocity_min_m_per_s", models.IntegerField(blank=True, null=True)),
                ("spot_size_min_microns", models.IntegerField(blank=True, null=True)),
                ("spot_size_max_microns", models.IntegerField(blank=True, null=True)),
                ("laser_type", models.CharField(blank=True, max_length=100, null=True)),
                (
                    "layer_thickness_min_microns",
                    models.IntegerField(blank=True, null=True),
                ),
                (
                    "layer_thickness_max_microns",
                    models.IntegerField(blank=True, null=True),
                ),
                ("tds_link", models.URLField(blank=True, null=True)),
                ("image_link", models.URLField(blank=True, null=True)),
                ("company_logo_link", models.URLField(blank=True, null=True)),
            ],
        ),
    ]

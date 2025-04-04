# Generated by Django 5.0.1 on 2024-10-20 21:06

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("build_profile", "0005_buildprofile_hatch_spacing_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="buildprofile",
            name="hatch_spacing",
            field=models.DecimalField(
                blank=True, decimal_places=6, default=5e-05, max_digits=8, null=True
            ),
        ),
        migrations.AlterField(
            model_name="buildprofile",
            name="layer_thickness",
            field=models.DecimalField(
                blank=True, decimal_places=6, default=3e-05, max_digits=8, null=True
            ),
        ),
    ]

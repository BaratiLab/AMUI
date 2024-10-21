# Generated by Django 5.0.1 on 2024-10-20 22:39

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        (
            "build_profile",
            "0007_buildprofile_power_alter_buildprofile_hatch_spacing_and_more",
        ),
    ]

    operations = [
        migrations.AddField(
            model_name="buildprofile",
            name="velocity",
            field=models.DecimalField(decimal_places=6, default=0.5, max_digits=8),
        ),
        migrations.AlterField(
            model_name="buildprofile",
            name="layer_thickness",
            field=models.DecimalField(decimal_places=6, default=3e-05, max_digits=8),
        ),
    ]

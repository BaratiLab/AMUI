# Generated by Django 5.0.1 on 2024-10-17 20:31

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("part", "0005_part_part_file"),
    ]

    operations = [
        migrations.AlterField(
            model_name="part",
            name="part_file",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="active_parts",
                to="part.partfile",
            ),
        ),
    ]

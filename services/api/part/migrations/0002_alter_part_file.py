# Generated by Django 5.0.1 on 2024-09-27 15:33

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("part", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="part",
            name="file",
            field=models.FileField(blank=True, null=True, upload_to="uploads/"),
        ),
    ]

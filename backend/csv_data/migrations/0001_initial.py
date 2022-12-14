# Generated by Django 4.1.1 on 2022-09-15 00:53

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("battery_cells", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="CsvCycleData",
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
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("cycle_index", models.IntegerField(default=0)),
                ("start_time", models.FloatField(default=0, max_length=255)),
                ("end_time", models.FloatField(default=0, max_length=255)),
                ("test_time_seconds", models.FloatField(default=0, max_length=255)),
                ("min_current_a", models.FloatField(default=0, max_length=255)),
                ("max_current_a", models.FloatField(default=0, max_length=255)),
                ("min_voltage_v", models.FloatField(default=0, max_length=255)),
                ("max_voltage_v", models.FloatField(default=0, max_length=255)),
                ("charge_capacity_ah", models.FloatField(default=0, max_length=255)),
                ("discharge_capacity_ah", models.FloatField(default=0, max_length=255)),
                ("charge_energy_wh", models.FloatField(default=0, max_length=255)),
                ("discharge_energy_wh", models.FloatField(default=0, max_length=255)),
                (
                    "battery_cell",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="battery_cells.batterycell",
                    ),
                ),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]

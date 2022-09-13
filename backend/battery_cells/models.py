from django.db import models
from users.models import User
from battery_cells.enum import BatteryCellEnum


class BatteryCell(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    cell_name_id = models.CharField(max_length=255)
    cycles = models.FloatField(max_length=255, default=0)
    capacity_ah = models.FloatField(max_length=255, default=0)

    cathode = models.CharField(
        max_length=7,
        choices=BatteryCellEnum.Cathode.choices,
        default=BatteryCellEnum.Cathode.LCO,
    )

    anode = models.CharField(
        max_length=8,
        choices=BatteryCellEnum.Anode.choices,
        default=BatteryCellEnum.Anode.GRAPHITE,
    )

    type = models.CharField(
        max_length=9,
        choices=BatteryCellEnum.Type.choices,
        default=BatteryCellEnum.Type.TYPE_18650,
    )

    source = models.CharField(
        max_length=6,
        choices=BatteryCellEnum.Source.choices,
        default=BatteryCellEnum.Source.HNEI,
    )

    temperature_c = models.FloatField(max_length=255, default=0)
    max_state_of_charge = models.FloatField(max_length=255, default=0)
    min_state_of_charge = models.FloatField(max_length=255, default=0)
    depth_of_discharge = models.FloatField(max_length=255, default=0)
    charge_capacity_rate = models.FloatField(max_length=255, default=0)
    discharge_capacity_rate = models.FloatField(max_length=255, default=0)

    REQUIRED_FIELDS = []

from battery_cells.models import BatteryCell
from django.db import models
from users.models import User


class CsvCycleData(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    battery_cell = models.ForeignKey(BatteryCell, on_delete=models.CASCADE)
    cycle_index = models.IntegerField(default=0)
    start_time = models.FloatField(max_length=255, default=0)
    end_time = models.FloatField(max_length=255, default=0)
    test_time_seconds = models.FloatField(max_length=255, default=0)
    min_current_a = models.FloatField(max_length=255, default=0)
    max_current_a = models.FloatField(max_length=255, default=0)
    min_voltage_v = models.FloatField(max_length=255, default=0)
    max_voltage_v = models.FloatField(max_length=255, default=0)
    charge_capacity_ah = models.FloatField(max_length=255, default=0)
    discharge_capacity_ah = models.FloatField(max_length=255, default=0)
    charge_energy_wh = models.FloatField(max_length=255, default=0)
    discharge_energy_wh = models.FloatField(max_length=255, default=0)


class CsvTimeSeriesData(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    battery_cell = models.ForeignKey(BatteryCell, on_delete=models.CASCADE)
    date_time = models.CharField(max_length=255, default=0)
    test_time_seconds = models.FloatField(max_length=255, default=0)
    cycle_index = models.IntegerField(default=0)
    current_a = models.FloatField(max_length=255, default=0)
    voltage_v = models.FloatField(max_length=255, default=0)
    charge_capacity_ah = models.FloatField(max_length=255, default=0)
    discharge_capacity_ah = models.FloatField(max_length=255, default=0)
    charge_energy_wh = models.FloatField(max_length=255, default=0)
    discharge_energy_wh = models.FloatField(max_length=255, default=0)
    environment_temp_celsius = models.FloatField(max_length=255, default=0)
    cell_temp_celsius = models.FloatField(max_length=255, default=0)

from django.db import models


class CycleDataEnum(models.TextChoices):
    CYCLE_INDEX = "Cycle_Index"
    START_TIME = "Start_Time"
    END_TIME = "End_Time"
    TEST_TIME_SECONDS = "Test_Time (s)"
    MIN_CURRENT_A = "Min_Current (A)"
    MAX_CURRENT_A = "Max_Current (A)"
    MIN_VOLTAGE_V = "Min_Voltage (V)"
    MAX_VOLTAGE_V = "Max_Voltage (V)"
    CHARGE_CAPACITY_AH = "Charge_Capacity (Ah)"
    DISCHARGE_CAPACITY_AH = "Discharge_Capacity (Ah)"
    CHARGE_ENERGY_WH = "Charge_Energy (Wh)"
    DISCHARGE_ENERGY_WH = "Discharge_Energy (Wh)"


class TimeSeriesDataEnum(models.TextChoices):
    DATE_TIME = "Date_Time"
    TEST_TIME_SECONDS = "Test_Time (s)"
    CYCLE_INDEX = "Cycle_Index"
    CURRENT_A = "Current (A)"
    VOLTAGE_V = "Voltage (V)"
    CHARGE_CAPACITY_AH = "Charge_Capacity (Ah)"
    DISCHARGE_CAPACITY_AH = "Discharge_Capacity (Ah)"
    CHARGE_ENERGY_WH = "Charge_Energy (Wh)"
    DISCHARGE_ENERGY_WH = "Discharge_Energy (Wh)"
    ENVIRONMENT_TEMP_CELSIUS = "Environment_Temperature (C)"
    CELL_TEMP_CELSIUS = "Cell_Temperature (C)"

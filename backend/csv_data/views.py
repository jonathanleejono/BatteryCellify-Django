from battery_cells.utils import authorize_battery_cell
from django.db.models import Case, ExpressionWrapper, F, FloatField, When
from pandas import DataFrame
from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from users.utils import get_auth_user_id

from csv_data.constants import valid_cycle_data_headers, valid_time_series_data_headers
from csv_data.enum import CycleDataEnum, TimeSeriesDataEnum
from csv_data.models import CsvCycleData, CsvTimeSeriesData
from csv_data.utils import (
    get_cycle_data,
    get_time_series_data,
    preprocess_dataframe,
    validate_csv,
)


class CsvCycleDataView(APIView):
    def post(self, request, battery_cell_pk):
        user_id = get_auth_user_id(request)

        authorize_battery_cell(battery_cell_pk, user_id)

        csv_file = validate_csv(request)

        cycle_data = CsvCycleData.objects.filter(
            battery_cell_id=battery_cell_pk, owner_id=user_id
        ).first()

        if cycle_data:
            raise ValidationError("Cycle data exists, please remove data to re-upload")

        df: DataFrame = preprocess_dataframe(csv_file, valid_cycle_data_headers)

        # converts to a list with each row as a dict
        list_of_df = df.to_dict("records")

        objs = [
            CsvCycleData(
                cycle_index=row[CycleDataEnum.CYCLE_INDEX],
                start_time=row[CycleDataEnum.START_TIME],
                end_time=row[CycleDataEnum.END_TIME],
                test_time_seconds=row[CycleDataEnum.TEST_TIME_SECONDS],
                min_current_a=row[CycleDataEnum.MIN_CURRENT_A],
                max_current_a=row[CycleDataEnum.MAX_CURRENT_A],
                min_voltage_v=row[CycleDataEnum.MIN_VOLTAGE_V],
                max_voltage_v=row[CycleDataEnum.MAX_VOLTAGE_V],
                charge_capacity_ah=row[CycleDataEnum.CHARGE_CAPACITY_AH],
                discharge_capacity_ah=row[CycleDataEnum.DISCHARGE_CAPACITY_AH],
                charge_energy_wh=row[CycleDataEnum.CHARGE_ENERGY_WH],
                discharge_energy_wh=row[CycleDataEnum.DISCHARGE_ENERGY_WH],
                battery_cell_id=battery_cell_pk,
                owner_id=user_id,
            )
            for row in list_of_df
        ]

        CsvCycleData.objects.bulk_create(objs)

        return Response(
            {"message": "Cycle data upload success"}, status=status.HTTP_201_CREATED
        )

    def get(self, request, battery_cell_pk):
        queryset = get_cycle_data(request, battery_cell_pk)

        all_cycle_numbers = list(queryset.values_list("cycle_index", flat=True))

        discharge_capacity_ah_list = list(
            queryset.values_list("discharge_capacity_ah", flat=True)
        )
        discharge_energy_wh_list = list(
            queryset.values_list("discharge_energy_wh", flat=True)
        )

        # __gt means greater than
        energy_filtered_data = queryset.filter(
            discharge_energy_wh__gt=1.0, charge_energy_wh__gt=1.0
        )

        energy_efficiency = list(
            energy_filtered_data.annotate(
                energy_efficiency=ExpressionWrapper(
                    F("discharge_energy_wh") * 1.0 / F("charge_energy_wh") * 1.0,
                    output_field=FloatField(),
                ),
            ).values_list("energy_efficiency", flat=True)
        )

        # get all cycle index numbers for energy if energy greater than 0.1
        cycle_numbers_energy = list(
            energy_filtered_data.values_list("cycle_index", flat=True)
        )

        # __gt means greater than
        capacity_filtered_data = queryset.filter(
            discharge_capacity_ah__gt=0.1, charge_capacity_ah__gt=0.1
        )

        coulombic_efficiency = list(
            capacity_filtered_data.annotate(
                coulombic_efficiency=ExpressionWrapper(
                    F("discharge_capacity_ah") * 1.0 / F("charge_capacity_ah") * 1.0,
                    output_field=FloatField(),
                ),
            ).values_list("coulombic_efficiency", flat=True)
        )

        # get all cycle index numbers for capacity if capacity greater than 0.1
        cycle_numbers_capacity = list(
            capacity_filtered_data.values_list("cycle_index", flat=True)
        )

        return Response(
            {
                "all_cycle_numbers": all_cycle_numbers,
                "cycle_discharge_capacity_ah_list": discharge_capacity_ah_list,
                "cycle_discharge_energy_wh_list": discharge_energy_wh_list,
                "energy_efficiency": energy_efficiency,
                "coulombic_efficiency": coulombic_efficiency,
                "cycle_numbers_capacity": cycle_numbers_capacity,
                "cycle_numbers_energy": cycle_numbers_energy,
            }
        )

    def delete(self, request, battery_cell_pk):
        csv_cycle_data = get_cycle_data(request, battery_cell_pk)

        if len(csv_cycle_data) < 1:
            raise NotFound("No cycle data found")

        csv_cycle_data.delete()

        return Response({"message": "Cycle data deleted"})


class CsvTimeSeriesDataView(APIView):
    def post(self, request, battery_cell_pk):
        user_id = get_auth_user_id(request)

        authorize_battery_cell(battery_cell_pk, user_id)

        csv_file = validate_csv(request)

        time_series_data = CsvTimeSeriesData.objects.filter(
            battery_cell_id=battery_cell_pk, owner_id=user_id
        ).first()

        if time_series_data:
            raise ValidationError(
                "Time series data exists, please remove data to re-upload"
            )

        df: DataFrame = preprocess_dataframe(csv_file, valid_time_series_data_headers)

        if TimeSeriesDataEnum.DATE_TIME in list(df.columns):
            df = df.drop(TimeSeriesDataEnum.DATE_TIME, 1)

        step = len(df) // 1100

        df = df.groupby(df.index // step).mean()

        # converts to a list with each row as a dict
        list_of_df = df.to_dict("records")

        objs = [
            CsvTimeSeriesData(
                test_time_seconds=row[TimeSeriesDataEnum.TEST_TIME_SECONDS],
                cycle_index=row[TimeSeriesDataEnum.CYCLE_INDEX],
                current_a=row[TimeSeriesDataEnum.CURRENT_A],
                voltage_v=row[TimeSeriesDataEnum.VOLTAGE_V],
                charge_capacity_ah=row[TimeSeriesDataEnum.CHARGE_CAPACITY_AH],
                discharge_capacity_ah=row[TimeSeriesDataEnum.DISCHARGE_CAPACITY_AH],
                charge_energy_wh=row[TimeSeriesDataEnum.CHARGE_ENERGY_WH],
                discharge_energy_wh=row[TimeSeriesDataEnum.DISCHARGE_ENERGY_WH],
                environment_temp_celsius=row[
                    TimeSeriesDataEnum.ENVIRONMENT_TEMP_CELSIUS
                ],
                cell_temp_celsius=row[TimeSeriesDataEnum.CELL_TEMP_CELSIUS],
                battery_cell_id=battery_cell_pk,
                owner_id=user_id,
            )
            for row in list_of_df
        ]

        CsvTimeSeriesData.objects.bulk_create(objs)

        return Response(
            {"message": "Time series data upload success"},
            status=status.HTTP_201_CREATED,
        )

    def get(self, request, battery_cell_pk):
        queryset = get_time_series_data(request, battery_cell_pk)

        test_time_data_list = list(queryset.values_list("test_time_seconds", flat=True))

        discharge_capacity_ah_data = list(
            queryset.values_list("discharge_capacity_ah", flat=True)
        )

        discharge_energy_wh_data = list(
            queryset.values_list("discharge_energy_wh", flat=True)
        )

        if not (
            len(test_time_data_list)
            == len(discharge_capacity_ah_data)
            == len(discharge_energy_wh_data)
        ):
            raise ValidationError("Uneven data, please remove data and re-upload")

        voltage_cycle_steps_data = {}
        charge_capacity_cycles_data = {}
        discharge_capacity_cycles_data = {}

        for every_100_rows in range(0, 1001, 100):

            cycle_filter_queryset = queryset.filter(
                cycle_index__gte=every_100_rows - 99, cycle_index__lte=every_100_rows
            )

            steps_key = f"steps_{every_100_rows + 100}"

            voltage_cycle_steps_data[f"{steps_key}"] = list(
                cycle_filter_queryset.values_list("voltage_v", flat=True)
            )

            charge_capacity_cycles_data[f"{steps_key}"] = list(
                cycle_filter_queryset.values_list("charge_capacity_ah", flat=True)
            )

            discharge_capacity_cycles_data[f"{steps_key}"] = list(
                cycle_filter_queryset.values_list("discharge_capacity_ah", flat=True)
            )

        if not (
            len(voltage_cycle_steps_data)
            == len(charge_capacity_cycles_data)
            == len(discharge_capacity_cycles_data)
        ):
            raise ValidationError("Uneven data, please remove data and re-upload")

        return Response(
            {
                "test_time_seconds_list": test_time_data_list,
                "time_series_discharge_capacity_ah_list": discharge_capacity_ah_data,
                "time_series_discharge_energy_wh_list": discharge_energy_wh_data,
                "voltage_cycle_steps": voltage_cycle_steps_data,
                "charge_capacity_cycles_steps": charge_capacity_cycles_data,
                "discharge_capacity_cycles_steps": discharge_capacity_cycles_data,
            }
        )

    def delete(self, request, battery_cell_pk):
        time_series_data = get_time_series_data(request, battery_cell_pk)

        if len(time_series_data) < 1:
            raise NotFound("No time series data found")

        time_series_data.delete()

        return Response({"message": "Time series data deleted"})

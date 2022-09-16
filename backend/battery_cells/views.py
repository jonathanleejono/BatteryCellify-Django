from django.db.models import Avg, Count
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from users.utils import get_auth_user_id

from battery_cells.constants import (
    valid_filters,
    valid_query_params,
    valid_sort_directions,
)
from battery_cells.models import BatteryCell
from battery_cells.serializers import BatteryCellSerializer
from battery_cells.utils import (
    authorize_battery_cell,
    handle_battery_options,
    validate_battery_cell_fields,
)
from utils.validate import validate_fields, validate_value


class BatteryCellList(APIView):
    def get(self, request):
        user_id = get_auth_user_id(request)

        query_params = self.request.query_params

        input_query_params = list(query_params.keys())

        validate_fields(input_query_params, valid_query_params)

        filters = {
            k: v
            for (k, v) in query_params.items()
            if handle_battery_options(key=k, value=v)
        }

        sort = "id"

        sort_by = query_params.get("sort_by")

        if sort_by:
            validate_value("sort_by", sort_by, valid_filters)
            sort = sort_by

        sort_direction = query_params.get("sort_direction")

        if sort_direction:
            validate_value("sort_direction", sort_direction, valid_sort_directions)

            if sort_direction == valid_sort_directions[1]:  # desc
                sort = f"-{sort}"

        cell_name_id = query_params.get("cell_name_id")

        if cell_name_id is None:
            cell_name_id = ""

        offset_skip = query_params.get("offset_skip")

        if offset_skip is not None:
            offset_skip = int(offset_skip)

        limit = query_params.get("limit")

        if limit is not None:
            limit = int(limit)

        queryset = BatteryCell.objects.filter(
            owner=user_id, cell_name_id__icontains=cell_name_id, **filters
        ).order_by(f"{sort}")[offset_skip:limit]

        serializer = BatteryCellSerializer(queryset, many=True)

        return Response(serializer.data)


class BatteryCellCreate(APIView):
    def post(self, request):
        user_id = get_auth_user_id(request)

        validate_battery_cell_fields(request)

        request.data["owner"] = user_id

        serializer = BatteryCellSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        response = Response(serializer.data, status=status.HTTP_201_CREATED)

        return response


class BatteryCellId(APIView):
    def get(self, request, pk):
        user_id = get_auth_user_id(request)

        battery_cell = authorize_battery_cell(pk, user_id)

        serializer = BatteryCellSerializer(battery_cell)

        return Response(serializer.data)

    def patch(self, request, pk):
        user_id = get_auth_user_id(request)

        validate_battery_cell_fields(request)

        battery_cell = authorize_battery_cell(pk, user_id)

        # make sure partial=True
        serializer = BatteryCellSerializer(
            battery_cell, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.update(battery_cell, request.data)

        return Response(serializer.data)

    def delete(self, request, pk):
        user_id = get_auth_user_id(request)

        battery_cell = authorize_battery_cell(pk, user_id)

        battery_cell.delete()

        return Response({"message": "Battery cell deleted"})


class BatteryCellStats(APIView):
    def get(self, request):
        user_id = get_auth_user_id(request)

        queryset = BatteryCell.objects.filter(owner=user_id)

        # if no values are found use float 0.0, and then round to 2 decimal places
        avg_capacity_ah = round(
            float(queryset.aggregate(Avg("capacity_ah"))["capacity_ah__avg"]) or 0, 2
        )

        avg_depth_of_discharge = round(
            float(
                queryset.aggregate(Avg("depth_of_discharge"))["depth_of_discharge__avg"]
                or 0
            ),
            2,
        )

        avg_temperature_c = round(
            float(queryset.aggregate(Avg("temperature_c"))["temperature_c__avg"] or 0),
            2,
        )

        # add list type to ensure proper casting
        total_cathode_cells = list(
            queryset.values("cathode").annotate(total=Count("id")).order_by("total")
        )

        avg_cycles_by_cathode = list(
            queryset.values("cathode").annotate(avg=Avg("cycles")).order_by("avg")
        )

        return Response(
            {
                "avg_capacity_ah": avg_capacity_ah,
                "avg_depth_of_discharge": avg_depth_of_discharge,
                "avg_temperature_c": avg_temperature_c,
                "total_cathode_cells": total_cathode_cells,
                "avg_cycles_by_cathode": avg_cycles_by_cathode,
            }
        )

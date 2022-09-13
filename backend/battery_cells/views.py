from django.db.models import Avg, Count
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from users.utils import authenticate_user_get_id

from battery_cells.enum import Cathode
from battery_cells.models import BatteryCell
from battery_cells.serializers import BatteryCellSerializer
from battery_cells.utils import handle_filter
from utils.validate import validate_fields, validate_value

valid_battery_cell_fields = [
    key
    for key in BatteryCellSerializer().fields
    if key != "id" or key != "created_at" or key != "updated_at"
]

valid_filters = [
    "cathode",
    "anode",
    "type",
    "source",
]

valid_query_params = [
    "cell_name_id",
    "sort_by",
    "sort_direction",
    "offset_skip",
    "limit",
] + valid_filters

valid_sort_directions = ["asc", "desc"]


class BatteryCellList(APIView):
    def get(self, request):
        user_id = authenticate_user_get_id(request)

        query_params = self.request.query_params

        input_query_params = list(query_params.keys())

        validate_fields(input_query_params, valid_query_params)

        filters = {
            k: v for (k, v) in query_params.items() if handle_filter(key=k, value=v)
        }

        sort = "id"

        sort_by = query_params.get("sort_by")

        if sort_by:
            validate_value("sort_by", sort_by, valid_filters)
            sort = sort_by

        sort_direction = query_params.get("sort_direction")

        if sort_direction:
            validate_value("sort_direction", sort_direction,
                           valid_sort_directions)

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
        user_id = authenticate_user_get_id(request)

        validate_fields(request.data.keys(), valid_battery_cell_fields)

        request.data["owner"] = user_id

        serializer = BatteryCellSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        response = Response(serializer.data, status=status.HTTP_201_CREATED)

        return response


class BatteryCellId(APIView):
    def get_battery_cell_by_pk(self, pk, owner_id):
        try:
            return BatteryCell.objects.filter(pk=pk, owner=owner_id)
        except:
            return Response(
                {"error": "Battery cell does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def get(self, request, pk):
        user_id = authenticate_user_get_id(request)

        battery_cell = self.get_battery_cell_by_pk(pk, user_id)
        serializer = BatteryCellSerializer(battery_cell)

        return Response(serializer.data)

    def patch(self, request, pk):
        user_id = authenticate_user_get_id(request)

        validate_fields(request.data.keys(), valid_battery_cell_fields)

        battery_cell = self.get_battery_cell_by_pk(pk, user_id)

        # make sure partial=True
        serializer = BatteryCellSerializer(
            battery_cell, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.update(battery_cell, request.data)

        return Response(serializer.data)

    def delete(self, request, pk):
        user_id = authenticate_user_get_id(request)

        battery_cell = self.get_battery_cell_by_pk(pk, user_id)
        battery_cell.delete()

        return Response({"message": "Battery cell deleted"})


class BatteryCellStats(APIView):
    def get(self, request):
        user_id = authenticate_user_get_id(request)

        queryset = BatteryCell.objects.filter(owner=user_id)

        # if no values are found use float 0.0, and round to 2 decimal places
        avg_capacity_ah = round(
            float(queryset.aggregate(Avg("capacity_ah"))
                  ["capacity_ah__avg"]) or 0, 2
        )

        avg_depth_of_discharge = round(
            float(
                queryset.aggregate(Avg("depth_of_discharge"))[
                    "depth_of_discharge__avg"]
                or 0
            ),
            2,
        )

        avg_temperature_c = round(
            float(queryset.aggregate(Avg("temperature_c"))
                  ["temperature_c__avg"] or 0),
            2,
        )

        total_cathode_cells = {
            Cathode.LCO: queryset.filter(cathode=Cathode.LCO).aggregate(Count("id"))[
                "id__count"
            ],
            Cathode.LFP: queryset.filter(cathode=Cathode.LFP).aggregate(Count("id"))[
                "id__count"
            ],
            Cathode.NCA: queryset.filter(cathode=Cathode.NCA).aggregate(Count("id"))[
                "id__count"
            ],
            Cathode.NMC: queryset.filter(cathode=Cathode.NMC).aggregate(Count("id"))[
                "id__count"
            ],
            Cathode.NMC_LCO: queryset.filter(cathode=Cathode.NMC_LCO).aggregate(
                Count("id")
            )["id__count"],
        }

        avg_cycles_by_cathode = {
            Cathode.LCO: round(
                float(
                    queryset.filter(cathode=Cathode.LCO).aggregate(Avg("cycles"))[
                        "cycles__avg"
                    ]
                    or 0
                ),
                2,
            ),
            Cathode.LFP: round(
                float(
                    queryset.filter(cathode=Cathode.LFP).aggregate(Avg("cycles"))[
                        "cycles__avg"
                    ]
                    or 0
                ),
                2,
            ),
            Cathode.NCA: round(
                float(
                    queryset.filter(cathode=Cathode.NCA).aggregate(Avg("cycles"))[
                        "cycles__avg"
                    ]
                    or 0
                ),
                2,
            ),
            Cathode.NMC: round(
                float(
                    queryset.filter(cathode=Cathode.NMC).aggregate(Avg("cycles"))[
                        "cycles__avg"
                    ]
                    or 0
                ),
                2,
            ),
            Cathode.NMC_LCO: round(
                float(
                    queryset.filter(cathode=Cathode.NMC_LCO).aggregate(Avg("cycles"))[
                        "cycles__avg"
                    ]
                    or 0
                ),
                2,
            ),
        }

        return Response(
            {
                "avg_capacity_ah": avg_capacity_ah,
                "avg_depth_of_discharge": avg_depth_of_discharge,
                "avg_temperature_c": avg_temperature_c,
                "total_cathode_cells": total_cathode_cells,
                "avg_cycles_by_cathode": avg_cycles_by_cathode,
            }
        )

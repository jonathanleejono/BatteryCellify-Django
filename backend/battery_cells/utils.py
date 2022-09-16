from rest_framework.exceptions import NotFound, PermissionDenied

from battery_cells.constants import (
    valid_anode_options,
    valid_battery_cell_fields,
    valid_cathode_options,
    valid_source_options,
    valid_type_options,
)
from battery_cells.models import BatteryCell
from utils.validate import validate_fields, validate_value


def handle_battery_options(key: str, value: str) -> str:
    if key == "cathode" and value:
        validate_value(key, value, valid_cathode_options)
        return key
    if key == "anode" and value:
        validate_value(key, value, valid_anode_options)
        return key
    if key == "type" and value:
        validate_value(key, value, valid_type_options)
        return key
    if key == "source" and value:
        validate_value(key, value, valid_source_options)
        return key


def authorize_battery_cell(pk, owner_id):

    try:
        battery_cell = BatteryCell.objects.get(pk=pk)
    except:
        raise NotFound("Battery cell does not exist")

    if battery_cell.owner_id != owner_id:
        raise PermissionDenied()

    return battery_cell


def validate_battery_cell_fields(request):
    validate_fields(request.data.keys(), valid_battery_cell_fields)
    validate_value("cathode", request.data["cathode"], valid_cathode_options)
    validate_value("anode", request.data["anode"], valid_anode_options)
    validate_value("type", request.data["type"], valid_type_options)
    validate_value("source", request.data["source"], valid_source_options)

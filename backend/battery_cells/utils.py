from battery_cells.constants import (valid_anode_options,
                                     valid_cathode_options,
                                     valid_source_options, valid_type_options)
from utils.validate import validate_value


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

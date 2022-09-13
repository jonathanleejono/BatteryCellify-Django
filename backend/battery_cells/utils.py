from battery_cells.enum import Anode, Cathode, Source, Type
from utils.validate import validate_value

valid_cathode_options = Cathode.values
valid_anode_options = Anode.values
valid_type_options = Type.values
valid_source_options = Source.values


def handle_filter(key: str, value: str) -> str:
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

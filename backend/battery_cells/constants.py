from battery_cells.enum import Anode, Cathode, Source, Type
from battery_cells.serializers import BatteryCellSerializer

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

valid_cathode_options = Cathode.values
valid_anode_options = Anode.values
valid_type_options = Type.values
valid_source_options = Source.values

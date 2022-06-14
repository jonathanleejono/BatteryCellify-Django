import pytest
from app import models, schemas, utils
from collections import namedtuple

from munch import DefaultMunch

test_cells = [{
    "cell_name_id": "HNEI_18650_NMC_LCO_25C_0-100_0.5/1.5C_b",
    "cycles": 1113.00,
    "cathode": "NMC-LCO",
    "anode": "graphite",
    "capacity_ah": 2.80,
    "type": "18650",
    "source": "HNEI",
    "temperature_c": 25.00,
    "max_state_of_charge": 100.00,
    "min_state_of_charge": 0.0,
    "depth_of_discharge": 100.00,
    "charge_capacity_rate": 0.50,
    "discharge_capacity_rate": 1.50,

}, {
    "cell_name_id": "UL-PUR_N10-EX9_18650_NCA_23C_0-100_0.5/0.5C_i",
    "cycles": 205.00,
    "cathode": "NCA",
    "anode": "graphite",
    "capacity_ah": 3.40,
    "type": "18650",
    "source": "UL-PUR",
    "temperature_c": 23.00,
    "max_state_of_charge": 100.00,
    "min_state_of_charge": 0.00,
    "depth_of_discharge": 100.00,
    "charge_capacity_rate": 0.50,
    "discharge_capacity_rate": 0.50,
},
    {
    "cell_name_id": "CALCE_CX2-16_prism_LCO_25C_0-100_0.5/0.5C_a",
    "cycles": 2016.00,
    "cathode": "LCO",
    "anode": "graphite",
    "capacity_ah": 1.35,
    "type": "prismatic",
    "source": "calce",
    "temperature_c": 25.00,
    "max_state_of_charge": 100.00,
    "min_state_of_charge": 0.00,
    "depth_of_discharge": 100.00,
    "charge_capacity_rate": 0.50,
    "discharge_capacity_rate": 0.50,

},
    {
    "cell_name_id": "OX_1-1_pouch_LCO_40C_0-100_2/1.84C_a",
    "cycles": 8200.00,
    "cathode": "LCO",
    "anode": "graphite",
    "capacity_ah": 0.74,
    "type": "pouch",
    "source": "oxford",
    "temperature_c": 40.00,
    "max_state_of_charge": 100.00,
    "min_state_of_charge": 0.00,
    "depth_of_discharge": 100.00,
    "charge_capacity_rate": 2.00,
    "discharge_capacity_rate": 1.84,

},
]

# converting dict to obj because the util functions are written to take in attributes, not keys
# attributes are used because the fetch methods for db (eg. db.scalars().all()) returns objects
dict_to_obj = DefaultMunch.fromDict(test_cells)


@ pytest.mark.parametrize(
    "attribute, list, expected",
    [("capacity_ah",
      dict_to_obj,
     2.07),
     ("depth_of_discharge",
     dict_to_obj,
     100,
      )
     ])
def test_calc_float_avg(attribute, list, expected):
    print("Calculate float average")
    assert utils.calc_float_avg(attribute, list) == expected


@ pytest.mark.parametrize(
    "attribute, value, list, expected",
    [("cathode",
      "LCO",
      dict_to_obj,
     2),
     ("cathode",
      "NMC",
      dict_to_obj,
     0),
     ])
def test_get_total_cells_by_value(attribute, value, list, expected):
    print("Calculate total cells by value")
    assert utils.get_total_cells_by_value(attribute, value, list) == expected


@ pytest.mark.parametrize(
    "attribute, attribute_two, value, list, expected",
    [("cycles",
      "cathode",
      "LCO",
      dict_to_obj,
     5108),
     ("cycles",
     "cathode",
      "NMC",
      dict_to_obj,
      0),
     ])
def test_get_avg_attr_by_another_attr_value(attribute, attribute_two, value, list, expected):
    print("Calculate avg attr by another attr value")
    assert utils.get_avg_attr_by_another_attr_value(
        attribute, attribute_two, value, list) == expected

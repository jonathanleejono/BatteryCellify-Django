mock_battery_cell_payload = {
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
}

# based on battery cells bulk created in conftest
mock_battery_cell_stats = {
    "avg_capacity_ah": 3.1,
    "avg_depth_of_discharge": 100.0,
    "avg_temperature_c": 24.0,
    "cell_stats_by_cathode": [
        {"cathode": "NCA", "total": 1, "avg": 205.0},
        {"cathode": "NMC-LCO", "total": 1, "avg": 1113.0},
    ],
}

mock_battery_cell_stats_empty = {
    "avg_capacity_ah": 0.0,
    "avg_depth_of_discharge": 0.0,
    "avg_temperature_c": 0.0,
    "cell_stats_by_cathode": [],
}

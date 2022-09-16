import pytest
from app import models, schemas, utils
from app.utils import (
    get_list_total_cells_by_attr,
    get_cell_efficency,
    get_cycles_by_multiple_attr,
    get_attr_by_cycles_step
)


async def test_get_cell_csv_cycle_data(authorized_client, test_battery_cells, test_csv_cycle_data):
    print("Get Cell Csv Cycle Data")

    res = await authorized_client.get(f"/csv/cycle-data/{test_battery_cells[0].id}")

    csv_cycle_data_res = schemas.CsvCycleDataOut(**res.json())

    cycle_numbers = get_list_total_cells_by_attr(
        "cycle_index", test_csv_cycle_data)
    cycle_discharge_capacity_ah = get_list_total_cells_by_attr(
        "discharge_capacity_ah", test_csv_cycle_data)
    cycle_discharge_energy_wh = get_list_total_cells_by_attr(
        "discharge_energy_wh", test_csv_cycle_data)
    cycle_charge_capacity_ah = get_list_total_cells_by_attr(
        "charge_capacity_ah", test_csv_cycle_data)
    cycle_charge_energy_wh = get_list_total_cells_by_attr(
        "charge_energy_wh", test_csv_cycle_data)

    coulombic_efficiency = get_cell_efficency(
        cycle_discharge_capacity_ah, cycle_charge_capacity_ah, 0.1)

    energy_efficiency = get_cell_efficency(
        cycle_discharge_energy_wh, cycle_charge_energy_wh, 1.0)

    cycle_numbers_capacity = get_cycles_by_multiple_attr(
        "cycle_index", test_csv_cycle_data, "discharge_capacity_ah", "charge_capacity_ah", 0.1)
    cycle_numbers_energy = get_cycles_by_multiple_attr(
        "cycle_index", test_csv_cycle_data, "discharge_energy_wh", "charge_energy_wh", 0.1)

    assert res.status_code == 200
    assert cycle_numbers == csv_cycle_data_res.cycle_numbers
    assert cycle_discharge_capacity_ah == csv_cycle_data_res.cycle_discharge_capacity_ah
    assert cycle_discharge_energy_wh == csv_cycle_data_res.cycle_discharge_energy_wh
    assert coulombic_efficiency == csv_cycle_data_res.coulombic_efficiency
    assert energy_efficiency == csv_cycle_data_res.energy_efficiency
    assert cycle_numbers_capacity == csv_cycle_data_res.cycle_numbers_capacity
    assert cycle_numbers_energy == csv_cycle_data_res.cycle_numbers_energy


async def test_unauthorized_user_get_csv_data(client, test_battery_cells):
    print("Unauthorized User Get Cell Csv Cycle Data")
    res = await client.get(f"/csv/cycle-data/{test_battery_cells[0].id}")
    assert res.status_code == 401


async def test_upload_csv_cycle_data(authorized_client, test_battery_cells):
    print("Upload csv cycle data")

    # don't forget to add file extension after file name
    files = {
        'upload_file': open('tests/HNEI_18650_NMC_LCO_25C_0-100_0.5-1.5C_b_cycle_data.csv', 'rb')}

    res = await authorized_client.post(
        f"/csv/cycle-data/{test_battery_cells[0].id}", files=files)

    #  very important to add the forward slash "/" after the /cycle-data/ for JSONDecodeError

    assert res.status_code == 201


async def test_delete_csv_cycle_data_success(authorized_client, test_battery_cells, test_csv_cycle_data):
    print("Delete CSV cycle data")

    # important note: you have to include the "test_csv_cycle_data" in the function parametres,
    # by including the fixture in the params, the fixture gets activated, even if it's not used
    # explicitly within this current function block (it's like a callback function)

    # also note: this is the delete test, so no csv data will be visible in the DB when refreshing

    res = await authorized_client.delete(
        f"/csv/cycle-data/{test_battery_cells[0].id}")

    assert res.status_code == 200

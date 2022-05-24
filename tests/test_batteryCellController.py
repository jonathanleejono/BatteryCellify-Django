import pytest
from app import models, schemas, utils


async def test_get_all_battery_cells(authorized_client, test_battery_cells):
    print("Get All Battery Cells")
    res = await authorized_client.get("/battery-cells/")

    battery_cells_res = schemas.BatteryCellsManyOut(**res.json())

    test_user1_battery_cells = [test_battery_cells[0], test_battery_cells[1]]

    avg_capacity = utils.calc_float_avg(
        "capacity_ah", test_user1_battery_cells)
    avg_depth_of_discharge = utils.calc_float_avg(
        "depth_of_discharge", test_user1_battery_cells)
    avg_temperature_c = utils.calc_float_avg(
        "temperature_c", test_user1_battery_cells)

    total_cathode_lco_cells = utils.get_total_cells_by_value(
        'cathode', 'LCO', test_user1_battery_cells)
    total_cathode_lfp_cells = utils.get_total_cells_by_value(
        'cathode', 'LFP', test_user1_battery_cells)
    total_cathode_nca_cells = utils.get_total_cells_by_value(
        'cathode', 'NCA', test_user1_battery_cells)
    total_cathode_nmc_cells = utils.get_total_cells_by_value(
        'cathode', 'NMC', test_user1_battery_cells)
    total_cathode_nmclco_cells = utils.get_total_cells_by_value(
        'cathode', 'NMC-LCO', test_user1_battery_cells)

    avg_cycles_lco_cells = utils.get_avg_attr_by_another_attr_value(
        "cycles", "cathode", "LCO", test_user1_battery_cells)
    avg_cycles_lfp_cells = utils.get_avg_attr_by_another_attr_value(
        "cycles", "cathode", "LFP", test_user1_battery_cells)
    avg_cycles_nca_cells = utils.get_avg_attr_by_another_attr_value(
        "cycles", "cathode", "NCA", test_user1_battery_cells)
    avg_cycles_nmc_cells = utils.get_avg_attr_by_another_attr_value(
        "cycles", "cathode", "NMC", test_user1_battery_cells)
    avg_cycles_nmclco_cells = utils.get_avg_attr_by_another_attr_value(
        "cycles", "cathode", "NMC-LCO", test_user1_battery_cells)

    # the -1 for len(test_battery_cells) is because one of the 3 test battery cells
    # was made by test user 2
    assert len(battery_cells_res.battery_cells) == len(test_battery_cells) - 1
    assert avg_capacity == battery_cells_res.avg_capacity
    assert avg_depth_of_discharge == battery_cells_res.avg_depth_of_discharge
    assert avg_temperature_c == battery_cells_res.avg_temperature_c
    assert total_cathode_lco_cells == battery_cells_res.total_cathode_lco_cells
    assert total_cathode_lfp_cells == battery_cells_res.total_cathode_lfp_cells
    assert total_cathode_nca_cells == battery_cells_res.total_cathode_nca_cells
    assert total_cathode_nmc_cells == battery_cells_res.total_cathode_nmc_cells
    assert total_cathode_nmclco_cells == battery_cells_res.total_cathode_nmclco_cells
    assert avg_cycles_lco_cells == battery_cells_res.avg_cycles_lco_cells
    assert avg_cycles_lfp_cells == battery_cells_res.avg_cycles_lfp_cells
    assert avg_cycles_nca_cells == battery_cells_res.avg_cycles_nca_cells
    assert avg_cycles_nmc_cells == battery_cells_res.avg_cycles_nmc_cells
    assert avg_cycles_nmclco_cells == battery_cells_res.avg_cycles_nmclco_cells
    assert res.status_code == 200


async def test_unauthorized_user_get_all_battery_cells(client):
    print("Unauthorized User Get All Battery Cells")
    res = await client.get("/battery-cells/")
    assert res.status_code == 401


@pytest.mark.parametrize("cell_name_id, cycles, cathode, anode, capacity_ah, type, source, temperature_c, max_state_of_charge, min_state_of_charge, depth_of_discharge, charge_capacity_rate, discharge_capacity_rate", [
    (
        "HNEI_18650_NMC_LCO_25C_0-100_0.5/1.5C_b",
        1113.00,
        "NMC-LCO",
        "graphite",
        2.80,
        "18650",
        "HNEI",
        25.00,
        100.00,
        0.00,
        100.00,
        0.50,
        1.50,

    ),
    (
        "UL-PUR_N10-EX9_18650_NCA_23C_0-100_0.5/0.5C_i",
        205.00,
        "NCA",
        "graphite",
        3.40,
        "18650",
        "UL-PUR",
        23.00,
        100.00,
        0.00,
        100.00,
        0.50,
        0.50,
    ),
    (
        "CALCE_CX2-16_prism_LCO_25C_0-100_0.5/0.5C_a",
        2016.00,
        "LCO",
        "graphite",
        1.35,
        "prismatic",
        "calce",
        25.00,
        100.00,
        0.00,
        100.00,
        0.50,
        0.50,
    ),
    (
        "OX_1-1_pouch_LCO_40C_0-100_2/1.84C_a",
        8200.00,
        "LCO",
        "graphite",
        0.74,
        "pouch",
        "oxford",
        40.00,
        100.00,
        0.00,
        100.00,
        2.00,
        1.84,
    ),
])
async def test_create_battery_cell(authorized_client, test_user, cell_name_id, cycles, cathode, anode, capacity_ah, type, source, temperature_c, max_state_of_charge, min_state_of_charge, depth_of_discharge, charge_capacity_rate, discharge_capacity_rate):
    print("Create battery cells")

    res = await authorized_client.post(
        "/battery-cells/", json={"cell_name_id": cell_name_id,
                                 "cycles": cycles,
                                 "cathode": cathode,
                                 "anode": anode,
                                 "capacity_ah": capacity_ah,
                                 "type": type,
                                 "source": source,
                                 "temperature_c": temperature_c,
                                 "max_state_of_charge": max_state_of_charge,
                                 "min_state_of_charge": min_state_of_charge,
                                 "depth_of_discharge": depth_of_discharge,
                                 "charge_capacity_rate": charge_capacity_rate,
                                 "discharge_capacity_rate": discharge_capacity_rate,
                                 })

    #  very important to add the forward slash "/" after the /battery-cells/ for JSONDecodeError

    created_battery_cell = models.Battery_Cells(**res.json())

    assert res.status_code == 201
    assert created_battery_cell.cell_name_id == cell_name_id
    assert created_battery_cell.cycles == cycles
    assert created_battery_cell.cathode == cathode
    assert created_battery_cell.anode == anode
    assert created_battery_cell.capacity_ah == capacity_ah
    assert created_battery_cell.type == type
    assert created_battery_cell.source == source
    assert created_battery_cell.temperature_c == temperature_c
    assert created_battery_cell.max_state_of_charge == max_state_of_charge
    assert created_battery_cell.min_state_of_charge == min_state_of_charge
    assert created_battery_cell.depth_of_discharge == depth_of_discharge
    assert created_battery_cell.charge_capacity_rate == charge_capacity_rate
    assert created_battery_cell.discharge_capacity_rate == discharge_capacity_rate
    assert created_battery_cell.owner_id == test_user['id']


async def test_update_battery_cell(authorized_client, test_user, test_battery_cells):
    print("Update battery cell")
    data = {
        "cell_name_id": "HNEI_18650_LCO_25C_0-100_0.5/1.5C_b",
        "cycles": 1113.00,
        "cathode": "LCO",
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
        "id": test_battery_cells[0].id,
    }
    res = await authorized_client.patch(
        f"/battery-cells/{test_battery_cells[0].id}", json=data)

    updated_battery_cell = schemas.BatteryCellOut(**res.json())

    assert res.status_code == 200
    assert updated_battery_cell.cell_name_id == data['cell_name_id']
    assert updated_battery_cell.cycles == data['cycles']
    assert updated_battery_cell.cathode == data['cathode']
    assert updated_battery_cell.anode == data['anode']
    assert updated_battery_cell.capacity_ah == data['capacity_ah']
    assert updated_battery_cell.type == data['type']
    assert updated_battery_cell.source == data['source']
    assert updated_battery_cell.temperature_c == data['temperature_c']
    assert updated_battery_cell.max_state_of_charge == data['max_state_of_charge']
    assert updated_battery_cell.min_state_of_charge == data['min_state_of_charge']
    assert updated_battery_cell.depth_of_discharge == data['depth_of_discharge']
    assert updated_battery_cell.charge_capacity_rate == data['charge_capacity_rate']
    assert updated_battery_cell.discharge_capacity_rate == data['discharge_capacity_rate']
    assert updated_battery_cell.owner_id == test_user['id']


async def test_delete_battery_cell_success(authorized_client, test_battery_cells):
    print("Delete battery cell")

    res = await authorized_client.delete(
        f"/battery-cells/{test_battery_cells[0].id}")

    assert res.status_code == 200


async def test_unauthorized_user_create_cell(client):
    print("Unauthorized user create cell")

    # make sure to include "await" for coroutine error
    res = await client.post(
        "/battery-cells/", json={
            "cell_name_id": "HNEI_18650_NMC_LCO_25C_0-100_0.5/1.5C_b",
            "cycles": 1014.00,
            "cathode": "LCO",
            "anode": "graphite",
            "capacity_ah": 2.35,
            "type": "prismatic",
            "source": "HNEI",
            "temperature_c": 25.00,
            "max_state_of_charge": 4,
            "min_state_of_charge": 2.0,
            "depth_of_discharge": 100.00,
            "charge_capacity_rate": 1.80,
            "discharge_capacity_rate": 0.60
        })
    assert res.status_code == 401


async def test_unauthorized_user_update_battery_cell(client, test_battery_cells):
    print("Unauthorized user update battery cell")

    data = {
        "cell_name_id": "HNEI_18650_LCO_25C_0-100_0.5/1.5C_b",
        "cycles": 1113.00,
        "cathode": "LCO",
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
        "id": test_battery_cells[0].id,
    }
    res = await client.patch(
        f"/battery-cells/{test_battery_cells[0].id}", json=data)

    assert res.status_code == 401


async def test_unauthorized_user_delete_battery_cell(client, test_battery_cells):
    print("Unauthorized user delete cell")

    res = await client.delete(
        f"/battery-cells/{test_battery_cells[0].id}")
    assert res.status_code == 401


async def test_delete_battery_cell_non_exist(authorized_client, test_battery_cells):
    print("Delete non existent battery cell")

    res = await authorized_client.delete(
        f"/battery-cells/8000000")

    assert res.status_code == 404


async def test_update_other_user_battery_cell(authorized_client, test_battery_cells):
    print("User update other user's battery cell forbidden")
    data = {
        "cell_name_id": "HNEI_18650_LCO_25C_0-100_0.5/1.5C_b",
        "cycles": 1113.00,
        "cathode": "LCO",
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
        "id": test_battery_cells[2].id,
    }

    # the 2 index (third battery cell) was created by test user 2, but test user 1 is logged in
    # so test user 1 is 403 forbidden from accessing another user's battery cell
    res = await authorized_client.patch(
        f"/battery-cells/{test_battery_cells[2].id}", json=data)

    assert res.status_code == 403


async def test_delete_other_user_battery_cell(authorized_client, test_battery_cells):
    print("User delete other user's battery cell forbidden")

    res = await authorized_client.delete(
        f"/battery-cells/{test_battery_cells[2].id}")
    assert res.status_code == 403

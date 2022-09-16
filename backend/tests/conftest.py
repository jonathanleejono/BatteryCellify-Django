import pytest
from battery_cells.enum import Anode, Cathode, Source, Type
from battery_cells.models import BatteryCell
from battery_cells.serializers import BatteryCellSerializer
from django.core.files import File
from django.core.files.uploadedfile import SimpleUploadedFile
from mocks.mock_users import mock_user, mock_user2
from rest_framework.test import APIClient


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def user(client):
    # this is the primary user used in tests
    response = client.post("/api/auth/register", mock_user)
    return response.data


@pytest.fixture
def user2(client):
    response = client.post("/api/auth/register", mock_user2)
    return response.data


@pytest.fixture
def login_user(client, user):
    # including 'user' in params creates the user

    login_payload = {"email": user["email"], "password": mock_user["password"]}

    response = client.post("/api/auth/login", login_payload)
    return response.data


@pytest.fixture
def mock_battery_cells_list(user, user2):
    # user2 and user should be included in params
    created_mock_battery_cells = BatteryCell.objects.bulk_create(
        # explicitly set primary key id to make testing easier
        [
            BatteryCell(
                id=1,
                cell_name_id="HNEI_18650_NMC_LCO_25C_0-100_0.5/1.5C_b",
                cycles=1113.00,
                cathode=Cathode.NMC_LCO,
                anode=Anode.GRAPHITE,
                capacity_ah=2.80,
                type=Type.TYPE_18650,
                source=Source.HNEI,
                temperature_c=25.00,
                max_state_of_charge=100.00,
                min_state_of_charge=0.0,
                depth_of_discharge=100.00,
                charge_capacity_rate=0.50,
                discharge_capacity_rate=1.50,
                owner_id=user[
                    "id"
                ],  # call this owner_id and not owner to avoid type errors
            ),
            BatteryCell(
                id=2,
                cell_name_id="UL-PUR_N10-EX9_18650_NCA_23C_0-100_0.5/0.5C_i",
                cycles=205.00,
                cathode=Cathode.NCA,
                anode=Anode.GRAPHITE,
                capacity_ah=3.40,
                type=Type.TYPE_18650,
                source=Source.UL_PUR,
                temperature_c=23.00,
                max_state_of_charge=100.00,
                min_state_of_charge=0.00,
                depth_of_discharge=100.00,
                charge_capacity_rate=0.50,
                discharge_capacity_rate=0.50,
                owner_id=user["id"],
            ),
            BatteryCell(
                id=3,
                cell_name_id="CALCE_CX2-16_prism_LCO_25C_0-100_0.5/0.5C_a",
                cycles=2016.00,
                cathode=Cathode.LCO,
                anode=Anode.GRAPHITE,
                capacity_ah=1.35,
                type=Type.PRISMATIC,
                source=Source.CALCE,
                temperature_c=25.00,
                max_state_of_charge=100.00,
                min_state_of_charge=0.00,
                depth_of_discharge=100.00,
                charge_capacity_rate=0.50,
                discharge_capacity_rate=0.50,
                owner_id=user2["id"],
            ),
        ]
    )

    serializer = BatteryCellSerializer(created_mock_battery_cells, many=True)

    return serializer.data


@pytest.fixture
def upload_mock_cycle_data(client, mock_battery_cells_list, login_user):
    # make sure login_user and mock_battery_cells_list are included in params
    # and that login_user comes after mock_battery_cells_list (for cookie auth)

    filename = "HNEI_18650_NMC_LCO_25C_0-100_0.5-1.5C_b_cycle_data.csv"

    csv_file = File(open(f"mocks/{filename}", "rb"))

    uploaded_file = SimpleUploadedFile(
        filename, csv_file.read(), content_type="multipart/form-data"
    )

    response = client.post(
        "/api/battery-cells/csv/cycle-data/1",
        {"file": uploaded_file},
        format="multipart",
    )

    return response


@pytest.fixture
def upload_mock_time_series_data(client, mock_battery_cells_list, login_user):
    # make sure login_user and mock_battery_cells_list are included in params
    # and that login_user comes after mock_battery_cells_list (for cookie auth)

    filename = "HNEI_18650_NMC_LCO_25C_0-100_0.5-1.5C_a_timeseries.csv"

    csv_file = File(open(f"mocks/{filename}", "rb"))

    uploaded_file = SimpleUploadedFile(
        filename, csv_file.read(), content_type="multipart/form-data"
    )

    response = client.post(
        "/api/battery-cells/csv/time-series-data/1",
        {"file": uploaded_file},
        format="multipart",
    )

    return response

import pytest
from django.core.files import File
from django.core.files.uploadedfile import SimpleUploadedFile
from mocks.mock_csv_cycle_data import mock_cycle_data_output
from mocks.mock_csv_time_series_data import mock_time_series_data_output


@pytest.mark.django_db
def test_upload_cycle_data(upload_mock_cycle_data):
    print("Should upload cycle data")

    # inside conftest, the cycle data is posted with APIClient,
    # and this data is used in the post and get tests
    response = upload_mock_cycle_data

    assert response.status_code == 201
    assert response.data["message"] == "Cycle data upload success"


@pytest.mark.django_db
def test_upload_cycle_data_invalid(client, mock_battery_cells_list, login_user):
    print("Should not upload cycle data with wrong data")

    filename = "HNEI_18650_NMC_LCO_25C_0-100_0.5-1.5C_a_timeseries.csv"

    csv_file = File(open(f"mocks/{filename}", "rb"))

    uploaded_file = SimpleUploadedFile(
        filename, csv_file.read(), content_type="multipart/form-data"
    )

    response = client.post(
        "/api/battery-cells/csv/cycle-data/1",
        {"file": uploaded_file},
        format="multipart",
    )

    assert response.status_code == 400


@pytest.mark.django_db
def test_get_cycle_data(client, upload_mock_cycle_data):
    print("Should get cycle data")

    response = client.get(
        "/api/battery-cells/csv/cycle-data/1",
    )

    assert response.status_code == 200
    assert response.data == mock_cycle_data_output


@pytest.mark.django_db
def test_delete_cycle_data(client, upload_mock_cycle_data):
    print("Should delete cycle data")

    response = client.delete(
        "/api/battery-cells/csv/cycle-data/1",
    )

    assert response.status_code == 200
    assert response.data["message"] == "Cycle data deleted"


@pytest.mark.django_db
def test_upload_time_series_data(upload_mock_time_series_data):
    print("Should upload time series data")

    # inside conftest, the time series data is posted with APIClient,
    # and this data is used in the post and get tests
    response = upload_mock_time_series_data

    assert response.status_code == 201
    assert response.data["message"] == "Time series data upload success"


@pytest.mark.django_db
def test_upload_time_series_data_invalid(client, mock_battery_cells_list, login_user):
    print("Should not upload time series data with wrong data")

    filename = "HNEI_18650_NMC_LCO_25C_0-100_0.5-1.5C_b_cycle_data.csv"

    csv_file = File(open(f"mocks/{filename}", "rb"))

    uploaded_file = SimpleUploadedFile(
        filename, csv_file.read(), content_type="multipart/form-data"
    )

    response = client.post(
        "/api/battery-cells/csv/time-series-data/1",
        {"file": uploaded_file},
        format="multipart",
    )

    assert response.status_code == 400


@pytest.mark.django_db
def test_get_time_series_data(client, upload_mock_time_series_data, login_user):
    print("Should get time series data")

    response = client.get(
        "/api/battery-cells/csv/time-series-data/1",
    )

    assert response.status_code == 200
    assert response.data == mock_time_series_data_output


@pytest.mark.django_db
def test_delete_time_series_data(client, upload_mock_time_series_data):
    print("Should delete time series data")

    response = client.delete(
        "/api/battery-cells/csv/time-series-data/1",
    )

    assert response.status_code == 200
    assert response.data["message"] == "Time series data deleted"

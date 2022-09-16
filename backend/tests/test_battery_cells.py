import pytest

from mocks.mock_battery_cells import mock_battery_cell_payload, mock_battery_cell_stats


@pytest.mark.django_db
def test_get_battery_cells(client, mock_battery_cells_list, login_user):
    # make sure login_user and mock_battery_cells_list are included in params
    # and that login_user comes after mock_battery_cells_list (for cookie auth)
    print("Should get all battery cells")

    response = client.get("/api/battery-cells/list")

    # make sure [0] is included as list is returned
    data = response.data[0]

    assert response.status_code == 200
    assert len(response.data) == 2
    assert data.items() == mock_battery_cells_list[0].items()


@pytest.mark.django_db
def test_get_battery_cells_query(client, mock_battery_cells_list, login_user):
    print("Should get all battery cells with query params")

    response = client.get("/api/battery-cells/list?source=HNEI")

    data = response.data[0]

    assert response.status_code == 200
    assert len(response.data) == 1
    assert data.items() == mock_battery_cells_list[0].items()


@pytest.mark.django_db
def test_get_battery_cells_stats(client, mock_battery_cells_list, login_user):
    print("Should get all battery cells stats")

    response = client.get("/api/battery-cells/stats")

    assert response.status_code == 200
    assert response.data.items() == mock_battery_cell_stats.items()


@pytest.mark.django_db
def test_create_battery_cell(client, login_user):
    print("Should create battery cell")

    response = client.post(
        "/api/battery-cells/create", mock_battery_cell_payload, format="json"
    )

    assert response.status_code == 201
    assert mock_battery_cell_payload.items() <= response.data.items()


@pytest.mark.django_db
def test_update_battery_cell(client, mock_battery_cells_list, login_user):
    print("Should update battery cell")

    mock_battery_cell_payload["temperature_c"] = 45.00

    response = client.patch(
        "/api/battery-cells/1", mock_battery_cell_payload, format="json"
    )

    assert response.status_code == 200
    assert mock_battery_cell_payload.items() <= response.data.items()
    assert response.data["temperature_c"] == 45.00


@pytest.mark.django_db
def test_update_battery_cell_invalid(client, mock_battery_cells_list, login_user):
    print("Should not update other user's battery cell")

    mock_battery_cell_payload["temperature_c"] = 45.00

    response = client.patch(
        "/api/battery-cells/3", mock_battery_cell_payload, format="json"
    )

    assert response.status_code == 403


@pytest.mark.django_db
def test_delete_battery_cell(client, mock_battery_cells_list, login_user):
    print("Should delete battery cell")

    response = client.delete("/api/battery-cells/1")

    message = response.data["message"]

    assert response.status_code == 200
    assert message == "Battery cell deleted"


@pytest.mark.django_db
def test_delete_battery_cell_invalid(client, mock_battery_cells_list, login_user):
    print("Should not delete other user's battery cell")

    response = client.delete("/api/battery-cells/3")

    assert response.status_code == 403


@pytest.mark.django_db
def test_delete_battery_cell_not_found(client, mock_battery_cells_list, login_user):
    print("Should not delete non-existent battery cell")

    response = client.delete("/api/battery-cells/100")

    assert response.status_code == 404

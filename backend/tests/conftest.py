import pytest
from rest_framework.test import APIClient

from .mock_users import mock_user2, mock_user3


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def register_db_user(client):
    # make sure this fixture is here first
    response = client.post("/api/auth/register", mock_user3)
    return response.data


@pytest.fixture
def user(client):
    response = client.post("/api/auth/register", mock_user2)
    return response.data


@pytest.fixture
def login_user(client, user):
    login_payload = {"email": user["email"],
                     "password": mock_user2["password"]}

    response = client.post("/api/auth/login", login_payload)
    return response.data

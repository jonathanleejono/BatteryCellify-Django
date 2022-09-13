import pytest
from users.constants import COOKIE_TOKEN

from .mock_users import mock_user, mock_user2, mock_user3


@pytest.mark.django_db
def test_register_user(client):
    print("Should register user")

    response = client.post("/api/auth/register", mock_user)

    data = response.data

    assert response.status_code == 201
    assert data["id"] == 1
    assert data["name"] == mock_user["name"]
    assert data["email"] == mock_user["email"]
    assert "password" not in data


@pytest.mark.django_db
def test_register_user_invalid(client):
    print("Should not register user with the same email")

    response = client.post("/api/auth/register", mock_user)

    assert response.status_code == 201

    response = client.post("/api/auth/register", mock_user)

    errors = response.data["errors"][0]

    assert response.status_code == 400
    assert errors["field"] == "email"
    assert errors["message"] == "Please use a different email"


@pytest.mark.django_db
def test_login_user(client, user):
    print("Should login user")

    login_payload = {"email": user["email"],
                     "password": mock_user2["password"]}

    response = client.post("/api/auth/login", login_payload)

    cookie = str(response.cookies)

    # make sure outer string quotes are single '', and inner are double ""
    assert f'Set-Cookie: {COOKIE_TOKEN}=ey' in cookie
    assert "HttpOnly" in cookie
    assert response.status_code == 200


@pytest.mark.django_db
def test_get_user(client, user):
    print("Should get authenticated user")

    response = client.get("/api/auth/user")

    assert response.status_code == 200
    assert response.data == user


@pytest.mark.django_db
def test_update_user(client, user):
    # make sure to include "user" in params to register mockuser2 in db
    print("Should update user")

    update_payload = {"email": "jane2@gmail.com"}

    response = client.patch("/api/auth/user", update_payload)

    data = response.data

    assert response.status_code == 200
    assert data["email"] == update_payload["email"]
    assert data["name"] == mock_user2["name"]


@pytest.mark.django_db
def test_update_user_2(client, user):
    print("Should update user, even with the same email")

    update_payload = {"email": "jane2@gmail.com", "name": "jane2"}

    response = client.patch("/api/auth/user", update_payload)

    data = response.data

    assert response.status_code == 200
    assert data["email"] == update_payload["email"]
    assert data["name"] == update_payload["name"]


@pytest.mark.django_db
def test_update_user_invalid(client, register_db_user, user):
    # make sure to include "register_db_user" and "user" in params to register users in db
    print("Should not update user using email that already exists")

    update_payload = {"email": mock_user3["email"]}

    response = client.patch("/api/auth/user", update_payload)

    assert response.status_code == 400


@pytest.mark.django_db
def test_logout_user(client):
    print("Should logout user")

    response = client.post("/api/auth/logout")

    message = response.data["message"]

    cookie = str(response.cookies)

    # make sure outer string quotes are single '', and inner are double ""
    assert f'Set-Cookie: {COOKIE_TOKEN}="";' in cookie
    assert response.status_code == 200
    assert message == "Logout success"


@pytest.mark.django_db
def test_login_user_invalid(client, user):
    print("Should not login user")

    login_payload = {"email": user["email"], "password": "wrongpassword"}

    response = client.post("/api/auth/login", login_payload)

    assert response.status_code == 401

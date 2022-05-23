import pytest
from jose import jwt
from app import entities


from app.config import settings


async def test_create_user(client):
    print("Register New User")

    res = await client.post(
        "/register", json={"first_name": "annie",
                           "last_name": "leonhartHEYHEYHEY",
                           "email": "annie23@gmail.com",
                           "password": "hello123"})

    new_user = entities.UserOut(**res.json())

    assert new_user.user["email"] == "annie23@gmail.com"
    assert res.status_code == 201


async def test_login_user(test_user, client):
    print("Login User")

    # note: the test user is from the conftest.py fixture, not from the new_user in the register test
    res = await client.post(
        "/login", json={
            "email": test_user["email"],
            "password": test_user["password"]})

    # this grabs out the returned value of login controller (ie. UserOut)
    login_res = entities.UserOut(**res.json())

    payload = jwt.decode(login_res.token,
                         settings.secret_key, algorithms=[settings.algorithm])

    id = payload.get("user_id")
    assert id == test_user['id']
    assert res.status_code == 200


async def test_update_user(authorized_client):
    print("Update User")

    # make sure to use authorized client to be able to get current user
    res = await authorized_client.patch(
        "/updateUser", json={
            "first_name": "annie",
            "email": "annieZZZ@gmail.com",
        })

    update_user_res = entities.UserOut(**res.json())

    assert update_user_res.user["email"] == "annieZZZ@gmail.com"
    assert res.status_code == 200

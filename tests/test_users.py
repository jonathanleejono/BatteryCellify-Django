import pytest
from app.config import settings
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from app.main import app
from app.models import metadata, users
import databases
from app import schemas


SQLALCHEMY_DATABASE_URL = f'postgresql+asyncpg://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}_test'

database = databases.Database(SQLALCHEMY_DATABASE_URL)

engine = create_engine(SQLALCHEMY_DATABASE_URL)

# metadata.create_all(engine)


# @pytest.fixture
# async def database_connection():
#     print("my database connected")
#     try:
#         await database.connect()
#     finally:
#         await database.disconnect()


# @pytest.fixture()
# async def client():
#     try:
#         await database.connect()
#         yield TestClient(app)
#     finally:
#         await database.disconnect()

# yield TestClient(app)


# @pytest.fixture


@pytest.mark.asyncio
async def test_user():
    print("creating user")
    user_data = {"firstName": "annie",
                 "lastName": "leonhart",
                 "email": "annieN@gmail.com",
                 "password": "hello123"}

    query = users.insert(values={**user_data})

    await database.connect()

    metadata.drop_all(engine)

    metadata.create_all(engine)

    res = await database.execute(query)

    await database.disconnect()

    # assert res.status_code == 201

    new_user = schemas.UserCreate(**user_data)

    # new_user = res.json()
    assert new_user.email == "annieN@gmail.com"
    # new_user['password'] = user_data['password']
    return new_user

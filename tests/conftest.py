import pytest
from app.config import settings
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_db
from app import schemas, entities
from httpx import AsyncClient
import asyncio
from typing import Generator
from app.oauth2 import create_access_token
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlmodel import SQLModel


DATABASE_URL = f'postgresql+asyncpg://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}_test'


engine = create_async_engine(DATABASE_URL, future=True)

AsyncDatabaseSession = sessionmaker(
    engine, expire_on_commit=False, class_=AsyncSession)


@pytest.fixture()
@pytest.mark.anyio
async def session():
    print("Async session fixture ran")
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)
        await conn.run_sync(SQLModel.metadata.create_all)
    async with AsyncDatabaseSession() as session:
        try:
            yield session
        finally:
            await session.close()


@pytest.fixture()
@pytest.mark.anyio
async def client(session):
    async def override_get_db():
        try:
            yield session
        finally:
            await session.close()
    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(app=app, base_url="http://127.0.0.1:8000/") as ac:
        yield ac


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
async def test_user(client):
    print("Creating test user")
    user_data = {"first_name": "annie",
                 "last_name": "leonhartNAYNAYNAY",
                 "email": "annie15@gmail.com",
                 "password": "hello123"}
    res = await client.post("/register", json=user_data)

    assert res.status_code == 201

    test_user = res.json()
    test_user['password'] = user_data['password']
    test_user['email'] = user_data['email']

    return test_user


# @pytest.fixture
# async def test_user2(client):
#     print("Creating second test user")
#     user_data = {"first_name": "reiner",
#                  "last_name": "leonhart",
#                  "email": "reinerL@gmail.com",
#                  "password": "hello123"}
#     res = await client.post("/register", json=user_data)

#     assert res.status_code == 201

#     test_user = res.json()
#     test_user['password'] = user_data['password']
#     test_user['email'] = user_data['email']

#     return test_user


@pytest.fixture
def token(test_user):
    return create_access_token({"user_id": test_user['id']})


@pytest.fixture
def authorized_client(client, token):
    client.headers = {
        **client.headers,
        "Authorization": f"Bearer {token}"
    }

    return client


# @pytest.fixture
# async def test_posts(session, test_user, test_user2):
#     battery_cells_data = [{
#         "cell_name_id": "CALCE_CX2-16_prism_LCO_25C_0-100_0.5/0.5C_a",
#         "cycles": 1014.00,
#         "cathode": "LCO",
#         "anode": "graphite",
#         "capacity_ah": 2.35,
#         "type": "prismatic",
#         "source": "calce",
#         "temperature_c": 25.00,
#         "max_state_of_charge": 4,
#         "min_state_of_charge": 2.0,
#         "depth_of_discharge": 100.00,
#         "charge_capacity_rate": 1.80,
#         "discharge_capacity_rate": 0.60,
#         "owner_id": test_user['id']
#     }, {
#         "cell_name_id": "HNEI_CX2-16_prism_LCO_25C_0-100_0.5/0.5C_a",
#         "cycles": 1014.00,
#         "cathode": "LCO",
#         "anode": "graphite",
#         "capacity_ah": 2.35,
#         "type": "prismatic",
#         "source": "HNEI",
#         "temperature_c": 25.00,
#         "max_state_of_charge": 4,
#         "min_state_of_charge": 2.0,
#         "depth_of_discharge": 100.00,
#         "charge_capacity_rate": 1.80,
#         "discharge_capacity_rate": 0.60,
#         "owner_id": test_user['id']
#     },
#         {
#         "cell_name_id": "Oxford_CX2-16_prism_LCO_25C_0-100_0.5/0.5C_a",
#         "cycles": 1014.00,
#         "cathode": "LCO",
#         "anode": "graphite",
#         "capacity_ah": 2.35,
#         "type": "prismatic",
#         "source": "oxford",
#         "temperature_c": 25.00,
#         "max_state_of_charge": 4,
#         "min_state_of_charge": 2.0,
#         "depth_of_discharge": 100.00,
#         "charge_capacity_rate": 1.80,
#         "discharge_capacity_rate": 0.60,
#         "owner_id": test_user2['id']
#     }]

#     def create_post_model(battery_cell):
#         return entities.Battery_Cells(**battery_cell)

#     battery_cells_map = map(create_post_model, battery_cells_data)
#     battery_cells = list(battery_cells_map)

#     session.add_all(battery_cells)
#     await session.commit()

#     all_battery_cells = session.select(entities.Battery_Cells).all()
#     return all_battery_cells


@pytest.mark.anyio
async def test_ping():
    async with AsyncClient(app=app, base_url="http://127.0.0.1:8000/") as ac:
        response = await ac.get("/ping")
    assert response.status_code == 200
    assert response.json() == {"ping7": "pong!"}

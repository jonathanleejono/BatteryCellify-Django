import pytest
from app.config import settings
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_db
from app import schemas, entities, models
from httpx import AsyncClient
import asyncio
from typing import Generator
from app.oauth2 import create_access_token
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlmodel import SQLModel
from app.models import Base
from sqlalchemy.future import select
import pandas as pd
from io import StringIO


DATABASE_URL = f'postgresql+asyncpg://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}'


engine = create_async_engine(DATABASE_URL, future=True)

AsyncDatabaseSession = sessionmaker(
    engine, autocommit=False, autoflush=False, expire_on_commit=False, class_=AsyncSession)


@pytest.fixture()
@pytest.mark.anyio
async def session():
    print("Async session fixture ran")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
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
    async with AsyncClient(app=app, base_url="http://127.0.0.1:8000/api") as ac:
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
                 "last_name": "leonhart",
                 "email": "annie1@gmail.com",
                 "password": "hello123"}
    res = await client.post("/register", json=user_data)

    assert res.status_code == 201

    test_user = res.json()
    test_user['password'] = user_data['password']
    test_user['email'] = user_data['email']

    return test_user


@pytest.fixture
async def test_user2(client):
    print("Creating second test user")
    user_data = {"first_name": "bertholdt",
                 "last_name": "leonhart",
                 "email": "bertholdt1@gmail.com",
                 "password": "hello123"}
    res = await client.post("/register", json=user_data)

    assert res.status_code == 201

    test_user = res.json()
    test_user['password'] = user_data['password']
    test_user['email'] = user_data['email']

    return test_user


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


@pytest.fixture
async def test_battery_cells(session, test_user, test_user2):
    battery_cells_data = [{
        "cell_name_id": "HNEI_18650_NMC_LCO_25C_0-100_0.5/1.5C_b",
        "cycles": 1113.00,
        "cathode": "NMC-LCO",
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
        "owner_id": test_user['id']
    }, {
        "cell_name_id": "UL-PUR_N10-EX9_18650_NCA_23C_0-100_0.5/0.5C_i",
        "cycles": 205.00,
        "cathode": "NCA",
        "anode": "graphite",
        "capacity_ah": 3.40,
        "type": "18650",
        "source": "UL-PUR",
        "temperature_c": 23.00,
        "max_state_of_charge": 100.00,
        "min_state_of_charge": 0.00,
        "depth_of_discharge": 100.00,
        "charge_capacity_rate": 0.50,
        "discharge_capacity_rate": 0.50,
        "owner_id": test_user['id']
    },
        {
        "cell_name_id": "CALCE_CX2-16_prism_LCO_25C_0-100_0.5/0.5C_a",
        "cycles": 2016.00,
        "cathode": "LCO",
        "anode": "graphite",
        "capacity_ah": 1.35,
        "type": "prismatic",
        "source": "calce",
        "temperature_c": 25.00,
        "max_state_of_charge": 100.00,
        "min_state_of_charge": 0.00,
        "depth_of_discharge": 100.00,
        "charge_capacity_rate": 0.50,
        "discharge_capacity_rate": 0.50,
        "owner_id": test_user2['id']
    }]

    def create_cell_model(battery_cell):
        return models.Battery_Cells(**battery_cell)

    battery_cells_map = map(create_cell_model, battery_cells_data)
    battery_cells = list(battery_cells_map)

    session.add_all(battery_cells)
    await session.commit()

    all_battery_cells = await session.execute(select(models.Battery_Cells))
    test_battery_cells = all_battery_cells.scalars().all()

    return test_battery_cells


@pytest.fixture
async def test_csv_cycle_data(session, test_user, test_battery_cells):
    print("Uploading test cycle data")
    df = pd.read_csv(
        'tests/HNEI_18650_NMC_LCO_25C_0-100_0.5-1.5C_b_cycle_data.csv')

    df = df.fillna(0)
    if "Unnamed: 0" in df:
        df = df.drop("Unnamed: 0", 1)

    # can't do the mapping thing to add each pandas df row to the DB because
    # when converting the df to json, each object is a giant list of all the values for the key,
    # and not one by one for each key for each row

    for i in range(len(df)):
        query = models.Csv_Cycle_Data(
            cycle_index=df["Cycle_Index"][i],
            start_time=df["Start_Time"][i],
            end_time=df["End_Time"][i],
            test_time_seconds=df["Test_Time (s)"][i],
            min_current_a=df["Min_Current (A)"][i],
            max_current_a=df["Max_Current (A)"][i],
            min_voltage_v=df["Min_Voltage (V)"][i],
            max_voltage_v=df["Max_Voltage (V)"][i],
            charge_capacity_ah=df["Charge_Capacity (Ah)"][i],
            discharge_capacity_ah=df["Discharge_Capacity (Ah)"][i],
            charge_energy_wh=df["Charge_Energy (Wh)"][i],
            discharge_energy_wh=df["Discharge_Energy (Wh)"][i],
            battery_cell_id=test_battery_cells[0].id,
            owner_id=test_user["id"])
        session.add(query)
        await session.commit()

    cell_csv_cycle_data = await session.execute(select(models.Csv_Cycle_Data).where(
        models.Csv_Cycle_Data.battery_cell_id == test_battery_cells[0].id))

    csv_cycle_data = cell_csv_cycle_data.scalars().all()

    return csv_cycle_data


@pytest.mark.anyio
async def test_ping():
    async with AsyncClient(app=app, base_url="http://127.0.0.1:8000/") as ac:
        response = await ac.get("/ping")
    assert response.status_code == 200
    assert response.json() == {"ping7": "pong!"}

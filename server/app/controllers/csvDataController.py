from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter, Request, UploadFile

from ..old import entities
from .. import models, schemas, oauth2
from ..database import get_db
from ..utils import (
    get_list_total_cells_by_attr,
    get_cell_efficency,
    get_cycles_by_multiple_attr,
    get_attr_by_cycles_step
)
# from ..models import csvCycleData, csvTimeSeriesData
from slowapi import Limiter
from slowapi.util import get_remote_address
import pandas as pd
from io import StringIO
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select


router = APIRouter(
    prefix="/api/csv"
)

limiter = Limiter(key_func=get_remote_address)


@router.get("/cycle-data/{id}", status_code=status.HTTP_200_OK)
async def get_csv_cycle_data(id: int,
                             db: AsyncSession = Depends(get_db),
                             current_user: int = Depends(oauth2.get_current_user)):

    query = await db.execute(select(models.Csv_Cycle_Data).where(
        models.Csv_Cycle_Data.battery_cell_id == id))

    csv_cycle_data = query.scalars().all()

    if not csv_cycle_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Cycle data for battery cell with id: {id} does not exist")

    if csv_cycle_data[0].owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform requested action")

    cycle_numbers = get_list_total_cells_by_attr(
        "cycle_index", csv_cycle_data)
    cycle_discharge_capacity_ah = get_list_total_cells_by_attr(
        "discharge_capacity_ah", csv_cycle_data)
    cycle_discharge_energy_wh = get_list_total_cells_by_attr(
        "discharge_energy_wh", csv_cycle_data)
    cycle_charge_capacity_ah = get_list_total_cells_by_attr(
        "charge_capacity_ah", csv_cycle_data)
    cycle_charge_energy_wh = get_list_total_cells_by_attr(
        "charge_energy_wh", csv_cycle_data)

    # the greater than 1 and 0.1 is to remove outliers in the data:

    coulombic_efficiency = get_cell_efficency(
        cycle_discharge_capacity_ah, cycle_charge_capacity_ah, 0.1)

    energy_efficiency = get_cell_efficency(
        cycle_discharge_energy_wh, cycle_charge_energy_wh, 1.0)

    cycle_numbers_capacity = get_cycles_by_multiple_attr(
        "cycle_index", csv_cycle_data, "discharge_capacity_ah", "charge_capacity_ah", 0.1)
    cycle_numbers_energy = get_cycles_by_multiple_attr(
        "cycle_index", csv_cycle_data, "discharge_energy_wh", "charge_energy_wh", 0.1)

    return {"cycle_numbers": cycle_numbers,
            "cycle_discharge_capacity_ah": cycle_discharge_capacity_ah,
            "cycle_discharge_energy_wh": cycle_discharge_energy_wh,
            "energy_efficiency": energy_efficiency,
            "coulombic_efficiency": coulombic_efficiency,
            "cycle_numbers_capacity": cycle_numbers_capacity,
            "cycle_numbers_energy": cycle_numbers_energy}


@router.post("/cycle-data/{id}", status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def upload_csv_cycle_data(id: int,
                                request: Request,
                                upload_file: UploadFile,
                                db: AsyncSession = Depends(get_db),
                                current_user: int = Depends(oauth2.get_current_user)):

    battery_cell = await db.get(models.Battery_Cells, id)

    if not battery_cell:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Battery cell does not exist")

    query = await db.execute(select(models.Csv_Cycle_Data).where(
        models.Csv_Cycle_Data.battery_cell_id == id))

    csvCycleDataAlreadyExists = query.fetchone()

    if csvCycleDataAlreadyExists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Cycle data already exists")

    contents = await upload_file.read()
    s = str(contents, 'utf-8')
    data = StringIO(s)
    df = pd.read_csv(data)

    if ("Cycle_Index" not in df.columns
            or "Start_Time" not in df.columns
            or "End_Time" not in df.columns
            or "Test_Time (s)" not in df.columns
            or "Min_Current (A)" not in df.columns
            or "Max_Current (A)" not in df.columns
            or "Min_Voltage (V)" not in df.columns
            or "Max_Voltage (V)" not in df.columns
            or "Charge_Capacity (Ah)" not in df.columns
            or "Discharge_Capacity (Ah)" not in df.columns
            or "Charge_Energy (Wh)" not in df.columns
            or "Discharge_Energy (Wh)" not in df.columns):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="CSV Cycle Data Incompatible")

    df = df.fillna(0)
    if "Unnamed: 0" in df:
        df = df.drop("Unnamed: 0", 1)

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
            battery_cell_id=id,
            owner_id=current_user.id)
        db.add(query)
        await db.commit()

    return "Upload successful!"


@router.delete("/cycle-data/{id}", status_code=status.HTTP_200_OK)
@limiter.limit("3/minute", error_message="Too many requests, please try again later")
async def delete_csv_cycle_data(request: Request,
                                id: int,
                                db: AsyncSession = Depends(get_db),
                                current_user: int = Depends(oauth2.get_current_user)):

    query = await db.execute(select(models.Csv_Cycle_Data).where(
        models.Csv_Cycle_Data.battery_cell_id == id))

    csv_cycle_data = query.scalars().all()

    if not csv_cycle_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Cycle data for battery cell with id: {id} does not exist")

    if csv_cycle_data[0].owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform requested action")

    for row in csv_cycle_data:
        await db.delete(row)
    await db.commit()

    return {"msg": "Success! Cycle data for battery cell removed", "id": id}


@router.get("/time-series-data/{id}", status_code=status.HTTP_200_OK)
async def get_csv_time_series_data(id: int,
                                   db: AsyncSession = Depends(get_db),
                                   current_user: int = Depends(oauth2.get_current_user)):

    query = await db.execute(select(models.Csv_Time_Series_Data).where(
        models.Csv_Time_Series_Data.battery_cell_id == id))

    time_series_all_battery_cells = query.scalars().all()

    if not time_series_all_battery_cells:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Time series data for battery cell with id: {id} does not exist")

    if time_series_all_battery_cells[0].owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform requested action")

    test_time_seconds = get_list_total_cells_by_attr(
        "test_time_seconds", time_series_all_battery_cells)
    time_series_discharge_capacity_ah = get_list_total_cells_by_attr(
        "discharge_capacity_ah", time_series_all_battery_cells)
    time_series_discharge_energy_wh = get_list_total_cells_by_attr(
        "discharge_energy_wh", time_series_all_battery_cells)

    voltage_cycles_100_step = get_attr_by_cycles_step(
        "voltage_v", time_series_all_battery_cells, 1, 100)
    voltage_cycles_200_step = get_attr_by_cycles_step(
        "voltage_v", time_series_all_battery_cells, 101, 200)
    voltage_cycles_300_step = get_attr_by_cycles_step(
        "voltage_v", time_series_all_battery_cells, 201, 300)
    voltage_cycles_400_step = get_attr_by_cycles_step(
        "voltage_v", time_series_all_battery_cells, 301, 400)
    voltage_cycles_500_step = get_attr_by_cycles_step(
        "voltage_v", time_series_all_battery_cells, 401, 500)
    voltage_cycles_600_step = get_attr_by_cycles_step(
        "voltage_v", time_series_all_battery_cells, 501, 600)
    voltage_cycles_700_step = get_attr_by_cycles_step(
        "voltage_v", time_series_all_battery_cells, 601, 700)
    voltage_cycles_800_step = get_attr_by_cycles_step(
        "voltage_v", time_series_all_battery_cells, 701, 800)
    voltage_cycles_900_step = get_attr_by_cycles_step(
        "voltage_v", time_series_all_battery_cells, 801, 900)
    voltage_cycles_1000_step = get_attr_by_cycles_step(
        "voltage_v", time_series_all_battery_cells, 901, 1000)
    voltage_cycles_1100_step = get_attr_by_cycles_step(
        "voltage_v", time_series_all_battery_cells, 1001, 1100)

    charge_capacity_cycles_100_step = get_attr_by_cycles_step(
        "charge_capacity_ah", time_series_all_battery_cells, 1, 100)
    charge_capacity_cycles_200_step = get_attr_by_cycles_step(
        "charge_capacity_ah", time_series_all_battery_cells, 101, 200)
    charge_capacity_cycles_300_step = get_attr_by_cycles_step(
        "charge_capacity_ah", time_series_all_battery_cells, 201, 300)
    charge_capacity_cycles_400_step = get_attr_by_cycles_step(
        "charge_capacity_ah", time_series_all_battery_cells, 301, 400)
    charge_capacity_cycles_500_step = get_attr_by_cycles_step(
        "charge_capacity_ah", time_series_all_battery_cells, 401, 500)
    charge_capacity_cycles_600_step = get_attr_by_cycles_step(
        "charge_capacity_ah", time_series_all_battery_cells, 501, 600)
    charge_capacity_cycles_700_step = get_attr_by_cycles_step(
        "charge_capacity_ah", time_series_all_battery_cells, 601, 700)
    charge_capacity_cycles_800_step = get_attr_by_cycles_step(
        "charge_capacity_ah", time_series_all_battery_cells, 701, 800)
    charge_capacity_cycles_900_step = get_attr_by_cycles_step(
        "charge_capacity_ah", time_series_all_battery_cells, 801, 900)
    charge_capacity_cycles_1000_step = get_attr_by_cycles_step(
        "charge_capacity_ah", time_series_all_battery_cells, 901, 1000)
    charge_capacity_cycles_1100_step = get_attr_by_cycles_step(
        "charge_capacity_ah", time_series_all_battery_cells, 1001, 1100)

    discharge_capacity_cycles_100_step = get_attr_by_cycles_step(
        "discharge_capacity_ah", time_series_all_battery_cells, 1, 100)
    discharge_capacity_cycles_200_step = get_attr_by_cycles_step(
        "discharge_capacity_ah", time_series_all_battery_cells, 101, 200)
    discharge_capacity_cycles_300_step = get_attr_by_cycles_step(
        "discharge_capacity_ah", time_series_all_battery_cells, 201, 300)
    discharge_capacity_cycles_400_step = get_attr_by_cycles_step(
        "discharge_capacity_ah", time_series_all_battery_cells, 301, 400)
    discharge_capacity_cycles_500_step = get_attr_by_cycles_step(
        "discharge_capacity_ah", time_series_all_battery_cells, 401, 500)
    discharge_capacity_cycles_600_step = get_attr_by_cycles_step(
        "discharge_capacity_ah", time_series_all_battery_cells, 501, 600)
    discharge_capacity_cycles_700_step = get_attr_by_cycles_step(
        "discharge_capacity_ah", time_series_all_battery_cells, 601, 700)
    discharge_capacity_cycles_800_step = get_attr_by_cycles_step(
        "discharge_capacity_ah", time_series_all_battery_cells, 701, 800)
    discharge_capacity_cycles_900_step = get_attr_by_cycles_step(
        "discharge_capacity_ah", time_series_all_battery_cells, 801, 900)
    discharge_capacity_cycles_1000_step = get_attr_by_cycles_step(
        "discharge_capacity_ah", time_series_all_battery_cells, 901, 1000)
    discharge_capacity_cycles_1100_step = get_attr_by_cycles_step(
        "discharge_capacity_ah", time_series_all_battery_cells, 1001, 1100)

    return {"test_time_seconds": test_time_seconds,
            "time_series_discharge_capacity_ah": time_series_discharge_capacity_ah,
            "time_series_discharge_energy_wh": time_series_discharge_energy_wh,
            "voltage_cycles_100_step": voltage_cycles_100_step,
            "voltage_cycles_200_step": voltage_cycles_200_step,
            "voltage_cycles_300_step": voltage_cycles_300_step,
            "voltage_cycles_400_step": voltage_cycles_400_step,
            "voltage_cycles_500_step": voltage_cycles_500_step,
            "voltage_cycles_600_step": voltage_cycles_600_step,
            "voltage_cycles_700_step": voltage_cycles_700_step,
            "voltage_cycles_800_step": voltage_cycles_800_step,
            "voltage_cycles_900_step": voltage_cycles_900_step,
            "voltage_cycles_1000_step": voltage_cycles_1000_step,
            "voltage_cycles_1100_step": voltage_cycles_1100_step,
            "charge_capacity_cycles_100_step": charge_capacity_cycles_100_step,
            "charge_capacity_cycles_200_step": charge_capacity_cycles_200_step,
            "charge_capacity_cycles_300_step": charge_capacity_cycles_300_step,
            "charge_capacity_cycles_400_step": charge_capacity_cycles_400_step,
            "charge_capacity_cycles_500_step": charge_capacity_cycles_500_step,
            "charge_capacity_cycles_600_step": charge_capacity_cycles_600_step,
            "charge_capacity_cycles_700_step": charge_capacity_cycles_700_step,
            "charge_capacity_cycles_800_step": charge_capacity_cycles_800_step,
            "charge_capacity_cycles_900_step": charge_capacity_cycles_900_step,
            "charge_capacity_cycles_1000_step": charge_capacity_cycles_1000_step,
            "charge_capacity_cycles_1100_step": charge_capacity_cycles_1100_step,
            "discharge_capacity_cycles_100_step": discharge_capacity_cycles_100_step,
            "discharge_capacity_cycles_200_step": discharge_capacity_cycles_200_step,
            "discharge_capacity_cycles_300_step": discharge_capacity_cycles_300_step,
            "discharge_capacity_cycles_400_step": discharge_capacity_cycles_400_step,
            "discharge_capacity_cycles_500_step": discharge_capacity_cycles_500_step,
            "discharge_capacity_cycles_600_step": discharge_capacity_cycles_600_step,
            "discharge_capacity_cycles_700_step": discharge_capacity_cycles_700_step,
            "discharge_capacity_cycles_800_step": discharge_capacity_cycles_800_step,
            "discharge_capacity_cycles_900_step": discharge_capacity_cycles_900_step,
            "discharge_capacity_cycles_1000_step": discharge_capacity_cycles_1000_step,
            "discharge_capacity_cycles_1100_step": discharge_capacity_cycles_1100_step, }


@router.post("/time-series-data/{id}", status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def upload_csv_time_series_data(id: int,
                                      request: Request,
                                      upload_file: UploadFile,
                                      db: AsyncSession = Depends(get_db),
                                      current_user: int = Depends(oauth2.get_current_user)):

    battery_cell = await db.get(models.Battery_Cells, id)

    if not battery_cell:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Battery cell does not exist")

    query = await db.execute(select(models.Csv_Time_Series_Data).where(
        models.Csv_Time_Series_Data.battery_cell_id == id))

    csvTimeSeriesDataAlreadyExists = query.fetchone()

    if csvTimeSeriesDataAlreadyExists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Cycle data already exists")

    contents = await upload_file.read()
    s = str(contents, 'utf-8')
    data = StringIO(s)
    df = pd.read_csv(data)

    # df = df.head(100000)

    if ("Date_Time" not in df.columns
            or "Test_Time (s)" not in df.columns
            or "Cycle_Index" not in df.columns
            or "Current (A)" not in df.columns
            or "Voltage (V)" not in df.columns
            or "Charge_Capacity (Ah)" not in df.columns
            or "Discharge_Capacity (Ah)" not in df.columns
            or "Charge_Energy (Wh)" not in df.columns
            or "Discharge_Energy (Wh)" not in df.columns
            or "Environment_Temperature (C)" not in df.columns
            or "Cell_Temperature (C)" not in df.columns
        ):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="CSV Cycle Data Incompatible")

    df = df.fillna(0)

    if "Unnamed: 0" in df:
        df = df.drop("Unnamed: 0", 1)

    # df = df.head(100)

    for i in range(len(df)):
        query = models.Csv_Time_Series_Data(
            date_time=df["Date_Time"][i],
            test_time_seconds=df["Test_Time (s)"][i],
            cycle_index=df["Cycle_Index"][i],
            current_a=df["Current (A)"][i],
            voltage_v=df["Voltage (V)"][i],
            charge_capacity_ah=df["Charge_Capacity (Ah)"][i],
            discharge_capacity_ah=df["Discharge_Capacity (Ah)"][i],
            charge_energy_wh=df["Charge_Energy (Wh)"][i],
            discharge_energy_wh=df["Discharge_Energy (Wh)"][i],
            environment_temp_celsius=df["Environment_Temperature (C)"][i],
            cell_temp_celsius=df["Cell_Temperature (C)"][i],
            battery_cell_id=id,
            owner_id=current_user.id)
        db.add(query)
        await db.commit()

    return "Upload successful!"


@router.delete("/time-series-data/{id}", status_code=status.HTTP_200_OK)
@limiter.limit("3/minute", error_message="Too many requests, please try again later")
async def delete_csv_time_series_data(request: Request,
                                      id: int,
                                      db: AsyncSession = Depends(get_db),
                                      current_user: int = Depends(oauth2.get_current_user)):

    query = await db.execute(select(models.Csv_Time_Series_Data).where(
        models.Csv_Time_Series_Data.battery_cell_id == id))

    csv_time_series_data = query.scalars().all()

    if not csv_time_series_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Time series data for battery cell with id: {id} does not exist")

    if csv_time_series_data[0].owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform requested action")

    for row in csv_time_series_data:
        await db.delete(row)
    await db.commit()

    return {"msg": "Success! Time series data for battery cell removed", "id": id}

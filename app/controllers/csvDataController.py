from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter, Request, UploadFile
from .. import models, schemas, oauth2
from ..database import database
from ..models import csvCycleData, csvTimeSeriesData
from ..database import database
from slowapi import Limiter
from slowapi.util import get_remote_address
import pandas as pd
from io import StringIO


router = APIRouter(
    prefix="/csv-data"
)

limiter = Limiter(key_func=get_remote_address)


@router.get("/cycleData/{id}", status_code=status.HTTP_200_OK)
async def get_csvCycleData(id: int, current_user: int = Depends(oauth2.get_current_user)):
    try:
        query = csvCycleData.select().where(csvCycleData.c.batteryCell_id == id)

        csvCycleData_batteryCell_check = await database.fetch_one(query)

        if not csvCycleData_batteryCell_check:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Cycle data for battery cell with id: {id} does not exist")

        if csvCycleData_batteryCell_check.owner_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail="Not authorized to perform requested action")

        csvCycleData_batteryCells = await database.fetch_all(query)

        return {"csvCycleData_batteryCell": csvCycleData_batteryCells}
    except:
        return "An error occurred"


@router.post("/cycleData/{id}", status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def upload_csvCycleData(id: int, request: Request, uploadFile: UploadFile, current_user: int = Depends(oauth2.get_current_user)):
    try:
        csvCycleDataAlreadyExists = await database.fetch_one(csvCycleData.select().where(csvCycleData.c.batteryCell_id == id))

        if csvCycleDataAlreadyExists:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="Cycle data already exists")

        contents = await uploadFile.read()
        s = str(contents, 'utf-8')
        data = StringIO(s)
        df = pd.read_csv(data)

        # if ("Cycle_Index" not in df.columns
        #         or "Start_Time" not in df.columns
        #         or "End_Time" not in df.columns
        #         or "Test_Time (s)" not in df.columns
        #         or "Min_Current (A)" not in df.columns
        #         or "Max_Current (A)" not in df.columns
        #         or "Min_Voltage (V)" not in df.columns
        #         or "Max_Voltage (V)" not in df.columns
        #         or "Charge_Capacity (Ah)" not in df.columns
        #         or "Discharge_Capacity (Ah)" not in df.columns
        #         or "Charge_Energy (Wh)" not in df.columns
        #         or "Discharge_Energy (Wh)" not in df.columns):
        #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
        #                         detail="CSV Cycle Data Incompatible")

        df = df.fillna(0)
        if "Unnamed: 0" in df:
            df = df.drop("Unnamed: 0", 1)

        for i in range(len(df)):
            query = csvCycleData.insert().values(
                cycleIndex=df["Cycle_Index"][i],
                startTime=df["Start_Time"][i],
                endTime=df["End_Time"][i],
                testTimeSeconds=df["Test_Time (s)"][i],
                minCurrentA=df["Min_Current (A)"][i],
                maxCurrentA=df["Max_Current (A)"][i],
                minVoltageV=df["Min_Voltage (V)"][i],
                maxVoltageV=df["Max_Voltage (V)"][i],
                chargeCapacityAh=df["Charge_Capacity (Ah)"][i],
                dischargeCapacityAh=df["Discharge_Capacity (Ah)"][i],
                chargeEnergyWh=df["Charge_Energy (Wh)"][i],
                dischargeEnergyWh=df["Discharge_Energy (Wh)"][i],
                batteryCell_id=id,
                owner_id=current_user.id)
            await database.execute(query)

        return "Upload successful!"

    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="An error occurred")


@router.delete("/cycleData/{id}", status_code=status.HTTP_200_OK)
@limiter.limit("3/minute", error_message="Too many requests, please try again later")
async def delete_csvCycleData(request: Request, id: int, current_user: int = Depends(oauth2.get_current_user)):

    query = csvCycleData.select().where(csvCycleData.c.batteryCell_id == id)

    csvCycleData_batteryCell = await database.fetch_one(query)

    if not csvCycleData_batteryCell:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Cycle data for battery cell with id: {id} does not exist")

    if csvCycleData_batteryCell.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform requested action")

    delete_csvCycleData = csvCycleData.delete().where(
        csvCycleData.c.batteryCell_id == id)

    await database.execute(delete_csvCycleData)

    return {"msg": "Success! Cycle data for battery cell removed", "id": id}


@router.get("/timeSeriesData/{id}", status_code=status.HTTP_200_OK)
async def get_csvTimeSeriesData(id: int, current_user: int = Depends(oauth2.get_current_user)):

    query = csvTimeSeriesData.select().where(
        csvTimeSeriesData.c.batteryCell_id == id)

    csvTimeSeriesData_batteryCell_check = await database.fetch_one(query)

    if not csvTimeSeriesData_batteryCell_check:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Time series data for battery cell with id: {id} does not exist")

    if csvTimeSeriesData_batteryCell_check.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform requested action")

    csvTimeSeriesData_batteryCells = await database.fetch_all(query)

    return {"csvTimeSeriesData_batteryCell": csvTimeSeriesData_batteryCells}


@router.post("/timeSeriesData/{id}", status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def upload_csvTimeSeriesData(id: int, request: Request, uploadFile: UploadFile, current_user: int = Depends(oauth2.get_current_user)):

    csvTimeSeriesDataAlreadyExists = await database.fetch_one(csvTimeSeriesData.select().where(csvTimeSeriesData.c.batteryCell_id == id))

    if csvTimeSeriesDataAlreadyExists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Time series data already exists")

    contents = await uploadFile.read()
    s = str(contents, 'utf-8')
    data = StringIO(s)
    df = pd.read_csv(data)

    if (not "Date_Time" in df.columns
            or not "Test_Time (s)" in df.columns
            or not "Cycle_Index" in df.columns
            or not "Current (A)" in df.columns
            or not "Voltage (V)" in df.columns
            or not "Charge_Capacity (Ah)" in df.columns
            or not "Discharge_Capacity (Ah)" in df.columns
            or not "Charge_Energy (Wh)" in df.columns
            or not "Discharge_Energy(Wh)" in df.columns
            or not "Environment_Temperature (C)" in df.columns
            or not "Cell_Temperature (C)" in df.columns
        ):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="CSV Cycle Data Incompatible")

    df = df.fillna(0)

    if "Unnamed: 0" in df:
        df = df.drop("Unnamed: 0", 1)

    df = df.head(100)

    for i in range(len(df)):
        query = csvTimeSeriesData.insert().values(
            dateTime=df["Date_Time"][i],
            testTimeSeconds=df["Test_Time (s)"][i],
            cycleIndex=df["Cycle_Index"][i],
            currentA=df["Current (A)"][i],
            voltageV=df["Voltage (V)"][i],
            chargeCapacityAh=df["Charge_Capacity (Ah)"][i],
            dischargeCapacityAh=df["Discharge_Capacity (Ah)"][i],
            chargeEnergyWh=df["Charge_Energy (Wh)"][i],
            dischargeEnergyWh=df["Discharge_Energy (Wh)"][i],
            environmentTempCelsius=df["Environment_Temperature (C)"][i],
            cellTempCelsius=df["Cell_Temperature (C)"][i],
            batteryCell_id=id,
            owner_id=current_user.id)
        await database.execute(query)

    return "Upload successful!"


@router.delete("/timeSeriesData/{id}", status_code=status.HTTP_200_OK)
@limiter.limit("3/minute", error_message="Too many requests, please try again later")
async def delete_csvTimeSeriesData(request: Request, id: int, current_user: int = Depends(oauth2.get_current_user)):

    query = csvTimeSeriesData.select().where(
        csvTimeSeriesData.c.batteryCell_id == id)

    csvTimeSeriesData_batteryCell = await database.fetch_one(query)

    if not csvTimeSeriesData_batteryCell:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Time series data for battery cell with id: {id} does not exist")

    if csvTimeSeriesData_batteryCell.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform requested action")

    delete_csvTimeSeriesData = csvTimeSeriesData.delete().where(
        csvTimeSeriesData.c.batteryCell_id == id)

    await database.execute(delete_csvTimeSeriesData)

    return {"msg": "Success! Time series data for battery cell removed", "id": id}


# -----------------------------------------------

# for row in range(len(df)):
#     query = csvCycleData.insert().values(
#         cycleIndex=df[row][0],
#         startTime=df[row][1],
#         endTime=df[row][2],
#         testTimeSeconds=df[row][3],
#         minCurrentA=df[row][4],
#         maxCurrentA=df[row][5],
#         minVoltageV=df[row][6],
#         maxVoltageV=df[row][7],
#         chargeCapacityAh=df[row][8],
#         dischargeCapacityAh=df[row][9],
#         chargeEnergyWh=df[row][10],
#         dischargeEnergyWh=df[row][11],
#         batteryCell_id=id,
#         owner_id=current_user.id)
#     await database.execute(query)

# for row in range(len(df)):
#     query = csvTimeSeriesData.insert().values(
#         dateTime=df[row][0],
#         testTimeSeconds=df[row][1],
#         cycleIndex=df[row][2],
#         currentA=df[row][3],
#         voltageV=df[row][4],
#         chargeCapacityAh=df[row][5],
#         dischargeCapacityAh=df[row][6],
#         chargeEnergyWh=df[row][7],
#         dischargeEnergyWh=df[row][8],
#         environmentTempCelsius=df[row][9],
#         cellTempCelsius=df[row][10],
#         batteryCell_id=id,
#         owner_id=current_user.id)
#     await database.execute(query)

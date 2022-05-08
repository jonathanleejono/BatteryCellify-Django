from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter, Request, UploadFile
from .. import models, schemas, oauth2
from ..database import database
from ..models import csvData
from ..database import database
from slowapi import Limiter
from slowapi.util import get_remote_address
import pandas as pd
from io import StringIO


router = APIRouter(
    prefix="/csv-data"
)

limiter = Limiter(key_func=get_remote_address)


@router.get("/{id}", status_code=status.HTTP_200_OK)
async def get_csvData(id: int, current_user: int = Depends(oauth2.get_current_user)):

    query = csvData.select().where(csvData.c.batteryCell_id == id)

    csvData_batteryCell = await database.fetch_all(query)

    if not csvData_batteryCell:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Csv data for battery cell with id: {id} does not exist")

    if csvData_batteryCell.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform requested action")

    return {"csvData_batteryCell": csvData_batteryCell}


@router.post("/{id}", status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def upload_csvData(id: int, request: Request, upload_file: UploadFile, current_user: int = Depends(oauth2.get_current_user)):

    contents = await upload_file.read()
    s = str(contents, 'utf-8')
    data = StringIO(s)
    df = pd.read_csv(data)
    df = df.fillna(0)

    csvDataAlreadyExists = await database.fetch_one(csvData.select().where(csvData.c.batteryCell_id == id))

    if csvDataAlreadyExists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Csv data already exists")

    for i in range(len(df)):
        query = csvData.insert().values(
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


@router.delete("/{id}", status_code=status.HTTP_200_OK)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def delete_csvData(request: Request, id: int, current_user: int = Depends(oauth2.get_current_user)):

    query = csvData.select().where(csvData.c.batteryCell_id == id)

    csvData_batteryCell = await database.fetch_one(query)

    if not csvData_batteryCell:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Csv data for battery cell with id: {id} does not exist")

    if csvData_batteryCell.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform requested action")

    delete_csvData = csvData.delete().where(csvData.c.batteryCell_id == id)

    await database.execute(delete_csvData)

    return {"msg": "Success! Csv data for battery cell removed", "id": id}

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

        cycleNumbers = [batteryCell["Cycle_Index"]
                        for batteryCell in csvCycleData_batteryCells]

        dischargeCapacityAh = [batteryCell["Discharge_Capacity (Ah)"]
                               for batteryCell in csvCycleData_batteryCells]
        dischargeEnergyWh = [batteryCell["Discharge_Energy (Wh)"]

                             for batteryCell in csvCycleData_batteryCells]
        chargeCapacityAh = [batteryCell["Charge_Capacity (Ah)"]
                            for batteryCell in csvCycleData_batteryCells]
        chargeEnergyWh = [batteryCell["Charge_Energy (Wh)"]
                          for batteryCell in csvCycleData_batteryCells]

        energyEfficiency = [float(a)/float(b)
                            for a, b in zip(dischargeEnergyWh, chargeEnergyWh)]
        coulombicEfficiency = [float(a)/float(b)
                               for a, b in zip(dischargeCapacityAh, chargeCapacityAh)]

        return {"cycleNumbers": cycleNumbers,
                "dischargeCapacityAh": dischargeCapacityAh,
                "dischargeEnergyWh": dischargeEnergyWh,
                "energyEfficiency": energyEfficiency,
                "coulombicEfficiency": coulombicEfficiency}
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="An error occurred")


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
    try:
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

    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="An error occurred")


@router.get("/timeSeriesData/{id}", status_code=status.HTTP_200_OK)
async def get_csvTimeSeriesData(id: int, current_user: int = Depends(oauth2.get_current_user)):
    try:
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

        testTime = [
            batteryCell["Test_Time (s)"] for batteryCell in csvTimeSeriesData_batteryCells]

        dischargeCapacityAh = [batteryCell["Discharge_Capacity (Ah)"]
                               for batteryCell in csvTimeSeriesData_batteryCells]
        dischargeEnergyWh = [batteryCell["Discharge_Energy (Wh)"]
                             for batteryCell in csvTimeSeriesData_batteryCells]

        voltageCycles100Step = [
            batteryCell["Voltage (V)"] for batteryCell in csvTimeSeriesData_batteryCells if 1 <= batteryCell["Cycle_Index"] <= 100]
        voltageCycles200Step = [
            batteryCell["Voltage (V)"] for batteryCell in csvTimeSeriesData_batteryCells if 101 <= batteryCell["Cycle_Index"] <= 200]
        voltageCycles300Step = [
            batteryCell["Voltage (V)"] for batteryCell in csvTimeSeriesData_batteryCells if 201 <= batteryCell["Cycle_Index"] <= 300]
        voltageCycles400Step = [
            batteryCell["Voltage (V)"] for batteryCell in csvTimeSeriesData_batteryCells if 301 <= batteryCell["Cycle_Index"] <= 400]
        voltageCycles500Step = [
            batteryCell["Voltage (V)"] for batteryCell in csvTimeSeriesData_batteryCells if 401 <= batteryCell["Cycle_Index"] <= 500]
        voltageCycles600Step = [
            batteryCell["Voltage (V)"] for batteryCell in csvTimeSeriesData_batteryCells if 501 <= batteryCell["Cycle_Index"] <= 600]
        voltageCycles700Step = [
            batteryCell["Voltage (V)"] for batteryCell in csvTimeSeriesData_batteryCells if 601 <= batteryCell["Cycle_Index"] <= 700]
        voltageCycles800Step = [
            batteryCell["Voltage (V)"] for batteryCell in csvTimeSeriesData_batteryCells if 701 <= batteryCell["Cycle_Index"] <= 800]
        voltageCycles900Step = [
            batteryCell["Voltage (V)"] for batteryCell in csvTimeSeriesData_batteryCells if 801 <= batteryCell["Cycle_Index"] <= 900]
        voltageCycles1000Step = [
            batteryCell["Voltage (V)"] for batteryCell in csvTimeSeriesData_batteryCells if 901 <= batteryCell["Cycle_Index"] <= 1000]
        voltageCycles1100Step = [
            batteryCell["Voltage (V)"] for batteryCell in csvTimeSeriesData_batteryCells if 1001 <= batteryCell["Cycle_Index"] <= 1100]

        chargeCapacityCycles100Step = [
            batteryCell["Charge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 1 <= batteryCell["Cycle_Index"] <= 100]
        chargeCapacityCycles200Step = [
            batteryCell["Charge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 101 <= batteryCell["Cycle_Index"] <= 200]
        chargeCapacityCycles300Step = [
            batteryCell["Charge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 201 <= batteryCell["Cycle_Index"] <= 300]
        chargeCapacityCycles400Step = [
            batteryCell["Charge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 301 <= batteryCell["Cycle_Index"] <= 400]
        chargeCapacityCycles500Step = [
            batteryCell["Charge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 401 <= batteryCell["Cycle_Index"] <= 500]
        chargeCapacityCycles600Step = [
            batteryCell["Charge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 501 <= batteryCell["Cycle_Index"] <= 600]
        chargeCapacityCycles700Step = [
            batteryCell["Charge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 601 <= batteryCell["Cycle_Index"] <= 700]
        chargeCapacityCycles800Step = [
            batteryCell["Charge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 701 <= batteryCell["Cycle_Index"] <= 800]
        chargeCapacityCycles900Step = [
            batteryCell["Charge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 801 <= batteryCell["Cycle_Index"] <= 900]
        chargeCapacityCycles1000Step = [
            batteryCell["Charge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 901 <= batteryCell["Cycle_Index"] <= 1000]
        chargeCapacityCycles1100Step = [
            batteryCell["Charge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 1001 <= batteryCell["Cycle_Index"] <= 1100]

        dischargeCapacityCycles100Step = [
            batteryCell["Discharge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 1 <= batteryCell["Cycle_Index"] <= 100]
        dischargeCapacityCycles200Step = [
            batteryCell["Discharge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 101 <= batteryCell["Cycle_Index"] <= 200]
        dischargeCapacityCycles300Step = [
            batteryCell["Discharge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 201 <= batteryCell["Cycle_Index"] <= 300]
        dischargeCapacityCycles400Step = [
            batteryCell["Discharge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 301 <= batteryCell["Cycle_Index"] <= 400]
        dischargeCapacityCycles500Step = [
            batteryCell["Discharge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 401 <= batteryCell["Cycle_Index"] <= 500]
        dischargeCapacityCycles600Step = [
            batteryCell["Discharge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 501 <= batteryCell["Cycle_Index"] <= 600]
        dischargeCapacityCycles700Step = [
            batteryCell["Discharge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 601 <= batteryCell["Cycle_Index"] <= 700]
        dischargeCapacityCycles800Step = [
            batteryCell["Discharge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 701 <= batteryCell["Cycle_Index"] <= 800]
        dischargeCapacityCycles900Step = [
            batteryCell["Discharge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 801 <= batteryCell["Cycle_Index"] <= 900]
        dischargeCapacityCycles1000Step = [
            batteryCell["Discharge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 901 <= batteryCell["Cycle_Index"] <= 1000]
        dischargeCapacityCycles1100Step = [
            batteryCell["Discharge_Capacity (Ah)"] for batteryCell in csvTimeSeriesData_batteryCells if 1001 <= batteryCell["Cycle_Index"] <= 1100]

        return {"testTime": testTime,
                "dischargeCapacityAh": dischargeCapacityAh,
                "dischargeEnergyWh": dischargeEnergyWh,
                "voltageCycles100Step": voltageCycles100Step,
                "voltageCycles200Step": voltageCycles200Step,
                "voltageCycles300Step": voltageCycles300Step,
                "voltageCycles400Step": voltageCycles400Step,
                "voltageCycles500Step": voltageCycles500Step,
                "voltageCycles600Step": voltageCycles600Step,
                "voltageCycles700Step": voltageCycles700Step,
                "voltageCycles800Step": voltageCycles800Step,
                "voltageCycles900Step": voltageCycles900Step,
                "voltageCycles1000Step": voltageCycles1000Step,
                "voltageCycles1100Step": voltageCycles1100Step,
                "chargeCapacityCycles100Step": chargeCapacityCycles100Step,
                "chargeCapacityCycles200Step": chargeCapacityCycles200Step,
                "chargeCapacityCycles300Step": chargeCapacityCycles300Step,
                "chargeCapacityCycles400Step": chargeCapacityCycles400Step,
                "chargeCapacityCycles500Step": chargeCapacityCycles500Step,
                "chargeCapacityCycles600Step": chargeCapacityCycles600Step,
                "chargeCapacityCycles700Step": chargeCapacityCycles700Step,
                "chargeCapacityCycles800Step": chargeCapacityCycles800Step,
                "chargeCapacityCycles900Step": chargeCapacityCycles900Step,
                "chargeCapacityCycles1000Step": chargeCapacityCycles1000Step,
                "chargeCapacityCycles1100Step": chargeCapacityCycles1100Step,
                "dischargeCapacityCycles100Step": dischargeCapacityCycles100Step,
                "dischargeCapacityCycles200Step": dischargeCapacityCycles200Step,
                "dischargeCapacityCycles300Step": dischargeCapacityCycles300Step,
                "dischargeCapacityCycles400Step": dischargeCapacityCycles400Step,
                "dischargeCapacityCycles500Step": dischargeCapacityCycles500Step,
                "dischargeCapacityCycles600Step": dischargeCapacityCycles600Step,
                "dischargeCapacityCycles700Step": dischargeCapacityCycles700Step,
                "dischargeCapacityCycles800Step": dischargeCapacityCycles800Step,
                "dischargeCapacityCycles900Step": dischargeCapacityCycles900Step,
                "dischargeCapacityCycles1000Step": dischargeCapacityCycles1000Step,
                "dischargeCapacityCycles1100Step": dischargeCapacityCycles1100Step, }
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="An error occurred")


@router.post("/timeSeriesData/{id}", status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def upload_csvTimeSeriesData(id: int, request: Request, uploadFile: UploadFile, current_user: int = Depends(oauth2.get_current_user)):
    try:
        csvTimeSeriesDataAlreadyExists = await database.fetch_one(csvTimeSeriesData.select().where(csvTimeSeriesData.c.batteryCell_id == id))

        if csvTimeSeriesDataAlreadyExists:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="Time series data already exists")

        contents = await uploadFile.read()
        s = str(contents, 'utf-8')
        data = StringIO(s)
        df = pd.read_csv(data)

        if ("Date_Time" not in df.columns
                    or "Test_Time (s)" not in df.columns
                    or "Cycle_Index" not in df.columns
                    or "Current (A)" not in df.columns
                    or "Voltage (V)" not in df.columns
                    or "Charge_Capacity (Ah)" not in df.columns
                    or "Discharge_Capacity (Ah)" not in df.columns
                    or "Charge_Energy (Wh)" not in df.columns
                    or "Discharge_Energy(Wh)" not in df.columns
                    or "Environment_Temperature (C)" not in df.columns
                    or "Cell_Temperature (C)" not in df.columns
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
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="An error occurred")


@router.delete("/timeSeriesData/{id}", status_code=status.HTTP_200_OK)
@limiter.limit("3/minute", error_message="Too many requests, please try again later")
async def delete_csvTimeSeriesData(request: Request, id: int, current_user: int = Depends(oauth2.get_current_user)):
    try:
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
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="An error occurred")


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

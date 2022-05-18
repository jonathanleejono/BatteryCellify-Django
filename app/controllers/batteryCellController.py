from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter, Request
from typing import Optional, List
from .. import models, schemas, oauth2
from ..database import database
from ..models import batteryCells, csvCycleData
from ..database import database
from slowapi import Limiter
from slowapi.util import get_remote_address

import math
import statistics
import re

router = APIRouter(
    prefix="/battery-cells"
)

limiter = Limiter(key_func=get_remote_address)


@router.get("/", response_model=schemas.BatteryCellsManyOut)
async def get_batteryCells(
        current_user: int = Depends(oauth2.get_current_user),
        limit: int = 10,
        search: Optional[str] = "",
        cathode: Optional[str] = "",
        anode: Optional[str] = "",
        type: Optional[str] = "",
        source: Optional[str] = "",
        page: int = 1,
        skip: int = 0):

    batteryCells_query = batteryCells.select().where(
        batteryCells.c.owner_id == current_user.id)

    result = batteryCells_query

    # result = result.skip(skip).limit(limit)

    all_batteryCells = await database.fetch_all(result)

    if search and search != None:
        all_batteryCells = list(filter(lambda x: re.search(
            search, x["cellNameId"]), all_batteryCells))

    if cathode and cathode != "all":
        all_batteryCells = [
            batteryCell for batteryCell in all_batteryCells
            if batteryCell['cathode'] == cathode]
    if anode and anode != "all":
        all_batteryCells = [
            batteryCell for batteryCell in all_batteryCells
            if batteryCell['anode'] == anode]
    if type and type != "all":
        all_batteryCells = [
            batteryCell for batteryCell in all_batteryCells
            if batteryCell['type'] == type]
    if source and source != "all":
        all_batteryCells = [
            batteryCell for batteryCell in all_batteryCells
            if batteryCell['source'] == source]

    totalBatteryCells = len(all_batteryCells)

    pagesLimit = totalBatteryCells / limit

    numOfPages = math.ceil(pagesLimit)

    averageCapacity = statistics.fmean([batteryCell["capacityAh"]
                                        for batteryCell in all_batteryCells])
    averageDepthOfDischarge = statistics.fmean([batteryCell["depthOfDischarge"]
                                               for batteryCell in all_batteryCells])
    averageTemperatureC = statistics.fmean([batteryCell["temperatureC"]
                                           for batteryCell in all_batteryCells])

    totalCathodeLCOCells = len([
        batteryCell for batteryCell in all_batteryCells
        if batteryCell['cathode'] == 'LCO'])
    totalCathodeLFPCells = len([
        batteryCell for batteryCell in all_batteryCells
        if batteryCell['cathode'] == 'LFP'])
    totalCathodeNCACells = len([
        batteryCell for batteryCell in all_batteryCells
        if batteryCell['cathode'] == 'NCA'])
    totalCathodeNMCCells = len([
        batteryCell for batteryCell in all_batteryCells
        if batteryCell['cathode'] == 'NMC'])
    totalCathodeNMCLCOCells = len([
        batteryCell for batteryCell in all_batteryCells
        if batteryCell['cathode'] == 'NMC-LCO'])

    avgTemp18650Cells = statistics.fmean([batteryCell["temperatureC"]
                                         if batteryCell["type"] == "18650" else 0 for batteryCell in all_batteryCells])
    avgMaxSoC18650Cells = statistics.fmean([batteryCell["maxStateOfCharge"]
                                           if batteryCell["type"] == "18650" else 0 for batteryCell in all_batteryCells])
    avgMinSoC18650Cells = statistics.fmean([batteryCell["minStateOfCharge"]
                                           if batteryCell["type"] == "18650" else 0 for batteryCell in all_batteryCells])
    avgDoD18650Cells = statistics.fmean([batteryCell["depthOfDischarge"]
                                        if batteryCell["type"] == "18650" else 0 for batteryCell in all_batteryCells])
    avgChargeCRate18650Cells = statistics.fmean([batteryCell["chargeCapacityRate"]
                                                if batteryCell["type"] == "18650" else 0 for batteryCell in all_batteryCells])
    avgDischargeCRate18650Cells = statistics.fmean([batteryCell["dischargeCapacityRate"]
                                                   if batteryCell["type"] == "18650" else 0 for batteryCell in all_batteryCells])

    avgTempPouchCells = statistics.fmean([batteryCell["temperatureC"]
                                         if batteryCell["type"] == "pouch" else 0.0 for batteryCell in all_batteryCells])
    avgMaxSoCPouchCells = statistics.fmean([batteryCell["maxStateOfCharge"]
                                           if batteryCell["type"] == "pouch" else 0.0 for batteryCell in all_batteryCells])
    avgMinSoCPouchCells = statistics.fmean([batteryCell["minStateOfCharge"]
                                           if batteryCell["type"] == "pouch" else 0.0 for batteryCell in all_batteryCells])
    avgDoDPouchCells = statistics.fmean([batteryCell["depthOfDischarge"]
                                        if batteryCell["type"] == "pouch" else 0.0 for batteryCell in all_batteryCells])
    avgChargeCRatePouchCells = statistics.fmean([batteryCell["chargeCapacityRate"]
                                                if batteryCell["type"] == "pouch" else 0.0 for batteryCell in all_batteryCells])
    avgDischargeCRatePouchCells = statistics.fmean([batteryCell["dischargeCapacityRate"]
                                                   if batteryCell["type"] == "pouch" else 0.0 for batteryCell in all_batteryCells])

    avgTempPrismaticCells = statistics.fmean([batteryCell["temperatureC"]
                                             if batteryCell["type"] == "prismatic" else 0.0 for batteryCell in all_batteryCells])
    avgMaxSoCPrismaticCells = statistics.fmean([batteryCell["maxStateOfCharge"]
                                               if batteryCell["type"] == "prismatic" else 0.0 for batteryCell in all_batteryCells])
    avgMinSoCPrismaticCells = statistics.fmean([batteryCell["minStateOfCharge"]
                                               if batteryCell["type"] == "prismatic" else 0.0 for batteryCell in all_batteryCells])
    avgDoDPrismaticCells = statistics.fmean([batteryCell["depthOfDischarge"]
                                            if batteryCell["type"] == "prismatic" else 0.0 for batteryCell in all_batteryCells])
    avgChargeCRatePrismaticCells = statistics.fmean([batteryCell["chargeCapacityRate"]
                                                    if batteryCell["type"] == "prismatic" else 0.0 for batteryCell in all_batteryCells])
    avgDischargeCRatePrismaticCells = statistics.fmean(
        [batteryCell["dischargeCapacityRate"] if batteryCell["type"] == "prismatic" else 0.0 for batteryCell in all_batteryCells])

    #    [a if a else 2 for a in [0,1,0,3]]
    #    [batteryCell["dischargeCapacityRate"] if batteryCell["type"] == "prismatic" else 0 for batteryCell in all_batteryCells]

    return {"batteryCells": all_batteryCells,
            "totalBatteryCells": totalBatteryCells,
            "averageCapacity": averageCapacity,
            "averageDepthOfDischarge": averageDepthOfDischarge,
            "averageTemperatureC": averageTemperatureC,
            "totalCathodeLCOCells": totalCathodeLCOCells,
            "totalCathodeLFPCells": totalCathodeLFPCells,
            "totalCathodeNCACells": totalCathodeNCACells,
            "totalCathodeNMCCells": totalCathodeNMCCells,
            "totalCathodeNMCLCOCells": totalCathodeNMCLCOCells,
            "avgTemp18650Cells": avgTemp18650Cells,
            "avgMaxSoC18650Cells": avgMaxSoC18650Cells,
            "avgMinSoC18650Cells": avgMinSoC18650Cells,
            "avgDoD18650Cells": avgDoD18650Cells,
            "avgChargeCRate18650Cells": avgChargeCRate18650Cells,
            "avgDischargeCRate18650Cells": avgDischargeCRate18650Cells,
            "avgTempPouchCells": avgTempPouchCells,
            "avgMaxSoCPouchCells": avgMaxSoCPouchCells,
            "avgMinSoCPouchCells": avgMinSoCPouchCells,
            "avgDoDPouchCells": avgDoDPouchCells,
            "avgChargeCRatePouchCells": avgChargeCRatePouchCells,
            "avgDischargeCRatePouchCells": avgDischargeCRatePouchCells,
            "avgTempPrismaticCells": avgTempPrismaticCells,
            "avgMaxSoCPrismaticCells": avgMaxSoCPrismaticCells,
            "avgMinSoCPrismaticCells": avgMinSoCPrismaticCells,
            "avgDoDPrismaticCells": avgDoDPrismaticCells,
            "avgChargeCRatePrismaticCells": avgChargeCRatePrismaticCells,
            "avgDischargeCRatePrismaticCells": avgDischargeCRatePrismaticCells,
            }


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.BatteryCellOut)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def create_batteryCell(batteryCell: schemas.BatteryCellCreate, request: Request, current_user: int = Depends(oauth2.get_current_user)):

    # make sure in the function it says "request: Request" and not "req: Request", or else the slowapi rate limiter won't work
    try:
        if not batteryCell:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Please fill out all values")

        query = batteryCells.insert(
            values={**batteryCell.dict(), "owner_id": current_user.id})

        # the database.execute(query) is what inserts the object into the db, while also retrieving the id at the same time
        created_batteryCellId = await database.execute(query)

        created_batteryCell = {
            **batteryCell.dict(), "id": created_batteryCellId}

        return created_batteryCell

    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="An error occurred")


@router.patch("/{id}", response_model=schemas.BatteryCellOut)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def update_batteryCell(request: Request, id: int, updating_batteryCell: schemas.BatteryCellUpdate, current_user: int = Depends(oauth2.get_current_user)):
    try:
        batteryCell_query = batteryCells.select().where(batteryCells.c.id == id)

        batteryCell = await database.fetch_one(batteryCell_query)

        if not batteryCell:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Battery cell with id: {id} does not exist")

        if batteryCell.owner_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail="Not authorized to perform requested action")

        updated_batteryCell_query = batteryCells.update().where(batteryCells.c.id == id).values(
            **updating_batteryCell.dict())

        await database.execute(updated_batteryCell_query)

        updated_batteryCell = {**updating_batteryCell.dict(), "id": id}

        return updated_batteryCell
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="An error occurred")


@router.delete("/{id}", status_code=status.HTTP_200_OK)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def delete_batteryCell(request: Request, id: int, current_user: int = Depends(oauth2.get_current_user)):
    try:
        batteryCell_query = batteryCells.select().where(batteryCells.c.id == id)

        batteryCell = await database.fetch_one(batteryCell_query)

        if not batteryCell:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Battery cell with id: {id} does not exist")

        if batteryCell.owner_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail="Not authorized to perform requested action")

        delete_batteryCell = batteryCells.delete().where(batteryCells.c.id == id)

        await database.execute(delete_batteryCell)

        # if the battery cell gets deleted, then the csv data associated with that same battery cell should be deleted

        delete_csvCycleData_batteryCell = csvCycleData.delete().where(
            csvCycleData.c.batteryCell_id == id)

        await database.execute(delete_csvCycleData_batteryCell)

        return {"msg": "Success! Battery cell removed", "id": id}
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="An error occurred")

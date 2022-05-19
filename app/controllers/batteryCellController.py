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

    lcoCycles = [batteryCell["cycles"]
                 for batteryCell in all_batteryCells if batteryCell["cathode"] == "LCO"]
    lfpCycles = [batteryCell["cycles"]
                 for batteryCell in all_batteryCells if batteryCell["cathode"] == "LFP"]
    ncaCycles = [batteryCell["cycles"]
                 for batteryCell in all_batteryCells if batteryCell["cathode"] == "NCA"]
    nmcCycles = [batteryCell["cycles"]
                 for batteryCell in all_batteryCells if batteryCell["cathode"] == "NMC"]
    nmcLcoCycles = [batteryCell["cycles"]
                    for batteryCell in all_batteryCells if batteryCell["cathode"] == "NMC-LCO"]

    # the if statement checks if a battery cell with that specific cathode exists, if not, return 0 for the average

    if len(lcoCycles) > 0:
        avgCyclesLC0Cells = statistics.fmean(lcoCycles)
    else:
        avgCyclesLC0Cells = 0.0

    if len(lfpCycles) > 0:
        avgCyclesLFPCells = statistics.fmean(lfpCycles)
    else:
        avgCyclesLFPCells = 0.0

    if len(ncaCycles) > 0:
        avgCyclesNCACells = statistics.fmean(ncaCycles)
    else:
        avgCyclesNCACells = 0.0

    if len(nmcCycles) > 0:
        avgCyclesNMCCells = statistics.fmean(nmcCycles)
    else:
        avgCyclesNMCCells = 0.0

    if len(nmcLcoCycles) > 0:
        avgCyclesNMCLCOCells = statistics.fmean(nmcLcoCycles)
    else:
        avgCyclesNMCLCOCells = 0.0

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
            "avgCyclesLC0Cells": avgCyclesLC0Cells,
            "avgCyclesLFPCells": avgCyclesLFPCells,
            "avgCyclesNCACells": avgCyclesNCACells,
            "avgCyclesNMCCells": avgCyclesNMCCells,
            "avgCyclesNMCLCOCells": avgCyclesNMCLCOCells,
            "lcoCycles": lcoCycles,
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

from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter, Request
from typing import Optional
from .. import models, schemas, oauth2
from ..database import database
from ..models import batteryCells
from ..database import database
from slowapi import Limiter
from slowapi.util import get_remote_address

import math
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
        battery_cycles: Optional[int] = "",
        cathode: Optional[str] = "",
        anode: Optional[str] = "",
        capacity_ah: Optional[int] = "",
        battery_type: Optional[str] = "",
        battery_source: Optional[str] = "",
        temperature_c: Optional[int] = "",
        max_state_of_charge_soc: Optional[int] = "",
        min_state_of_charge_soc: Optional[int] = "",
        depth_of_discharge_dod: Optional[int] = "",
        charge_capacity_rate: Optional[int] = "",
        discharge_capacity_rate: Optional[int] = "",
        page: int = 1,
        skip: int = 0):

    batteryCells_query = batteryCells.select().where(
        batteryCells.c.owner_id == current_user.id)

    result = batteryCells_query

    # result = result.skip(skip).limit(limit)

    all_batteryCells = await database.fetch_all(result)

    if search:
        all_batteryCells = list(filter(lambda x: re.search(
            search, x["cell_id"]), all_batteryCells))

    if battery_cycles and battery_cycles != "all":
        all_batteryCells = [
            batteryCell for batteryCell in all_batteryCells
            if batteryCell['battery_cycles'] == battery_cycles]
    if cathode and cathode != "all":
        all_batteryCells = [
            batteryCell for batteryCell in all_batteryCells
            if batteryCell['cathode'] == cathode]
    if anode and anode != "all":
        all_batteryCells = [
            batteryCell for batteryCell in all_batteryCells
            if batteryCell['anode'] == anode]
    if capacity_ah and capacity_ah != "all":
        all_batteryCells = [
            batteryCell for batteryCell in all_batteryCells
            if batteryCell['capacity_ah'] == capacity_ah]
    if battery_type and battery_type != "all":
        all_batteryCells = [
            batteryCell for batteryCell in all_batteryCells
            if batteryCell['battery_type'] == battery_type]
    if battery_source and battery_source != "all":
        all_batteryCells = [
            batteryCell for batteryCell in all_batteryCells
            if batteryCell['battery_source'] == battery_source]
    if temperature_c and temperature_c != "all":
        all_batteryCells = [
            batteryCell for batteryCell in all_batteryCells
            if batteryCell['temperature_c'] == temperature_c]
    if max_state_of_charge_soc and max_state_of_charge_soc != "all":
        all_batteryCells = [
            batteryCell for batteryCell in all_batteryCells
            if batteryCell['max_state_of_charge_soc'] == max_state_of_charge_soc]
    if min_state_of_charge_soc and min_state_of_charge_soc != "all":
        all_batteryCells = [
            batteryCell for batteryCell in all_batteryCells
            if batteryCell['min_state_of_charge_soc'] == min_state_of_charge_soc]
    if depth_of_discharge_dod and depth_of_discharge_dod != "all":
        all_batteryCells = [
            batteryCell for batteryCell in all_batteryCells
            if batteryCell['depth_of_discharge_dod'] == depth_of_discharge_dod]
    if charge_capacity_rate and charge_capacity_rate != "all":
        all_batteryCells = [
            batteryCell for batteryCell in all_batteryCells
            if batteryCell['charge_capacity_rate'] == charge_capacity_rate]
    if discharge_capacity_rate and discharge_capacity_rate != "all":
        all_batteryCells = [
            batteryCell for batteryCell in all_batteryCells
            if batteryCell['discharge_capacity_rate'] == discharge_capacity_rate]

    totalBatteryCells = len(all_batteryCells)

    pagesLimit = totalBatteryCells / limit

    numOfPages = math.ceil(pagesLimit)

    return {"batteryCells": all_batteryCells, "totalBatteryCells": totalBatteryCells, "numOfPages": numOfPages}


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.BatteryCellOut)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def create_batteryCell(batteryCell: schemas.BatteryCellCreate, request: Request, current_user: int = Depends(oauth2.get_current_user)):

    # make sure in the function it says "request: Request" and not "req: Request", or else the slowapi rate limiter won't work

    query = batteryCells.insert(
        values={**batteryCell.dict(), "owner_id": current_user.id})

    # the database.execute(query) is what inserts the object into the db, while also retrieving the id at the same time
    created_batteryCell_id = await database.execute(query)

    created_batteryCell = {**batteryCell.dict(), "id": created_batteryCell_id}

    return created_batteryCell


@router.patch("/{id}", response_model=schemas.BatteryCellOut)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def update_batteryCell(request: Request, id: int, updating_batteryCell: schemas.BatteryCellUpdate, current_user: int = Depends(oauth2.get_current_user)):

    batteryCell_query = batteryCells.select().where(batteryCells.c.id == id)

    batteryCell = await database.fetch_one(batteryCell_query)

    if not batteryCell:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"BatteryCell with id: {id} does not exist")

    if batteryCell.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform requested action")

    updated_batteryCell_query = batteryCells.update().where(batteryCells.c.id == id).values(
        **updating_batteryCell.dict())

    await database.execute(updated_batteryCell_query)

    updated_batteryCell = {**updating_batteryCell.dict(), "id": id}

    return updated_batteryCell


@router.delete("/{id}", status_code=status.HTTP_200_OK)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def delete_batteryCell(request: Request, id: int, current_user: int = Depends(oauth2.get_current_user)):

    batteryCell_query = batteryCells.select().where(batteryCells.c.id == id)

    batteryCell = await database.fetch_one(batteryCell_query)

    if not batteryCell:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"BatteryCell with id: {id} does not exist")

    if batteryCell.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform requested action")

    deleted_batteryCell = batteryCells.delete().where(batteryCells.c.id == id)

    await database.execute(deleted_batteryCell)

    return {"msg": "Success! Battery cell removed", "id": id}

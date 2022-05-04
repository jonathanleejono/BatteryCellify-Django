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
        skip: int = 0,
        search: Optional[str] = "",
        status: Optional[str] = "",
        sort: Optional[str] = "",
        batteryCellType: Optional[str] = "",
        page: int = 1):

    batteryCells_query = batteryCells.select().where(
        batteryCells.c.owner_id == current_user.id)

    result = batteryCells_query

    # result = result.skip(skip).limit(limit)

    all_batteryCells = await database.fetch_all(result)

    if status and status != "all":
        all_batteryCells = [
            batteryCell for batteryCell in all_batteryCells if batteryCell['status'] == status]
    if batteryCellType and batteryCellType != "all":
        all_batteryCells = [
            batteryCell for batteryCell in all_batteryCells if batteryCell['batteryCellType'] == batteryCellType]

    if search:
        all_batteryCells = list(filter(lambda x: re.search(
            search, x["position"]), all_batteryCells))

    if sort and sort == "latest":
        all_batteryCells = sorted(
            all_batteryCells, key=lambda dict: dict['created_at'], reverse=True)
    if sort and sort == "oldest":
        all_batteryCells = sorted(
            all_batteryCells, key=lambda dict: dict['created_at'])
    if sort and sort == "a-z":
        all_batteryCells = sorted(
            all_batteryCells, key=lambda dict: dict['position'])
    if sort and sort == "z-a":
        all_batteryCells = sorted(
            all_batteryCells, key=lambda dict: dict['position'], reverse=True)

    totalBatteryCells = len(all_batteryCells)

    pagesLimit = totalBatteryCells / limit

    numOfPages = math.ceil(pagesLimit)

    return {"batteryCells": all_batteryCells, "totalBatteryCells": totalBatteryCells, "numOfPages": numOfPages}


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.BatteryCellOut)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def create_batteryCell(batteryCell: schemas.BatteryCellCreate, request: Request, current_user: int = Depends(oauth2.get_current_user)):

    # make sure in the function it says "request: Request" and not "req: Request", or else the slowapi rate limiter won't work

    if not batteryCell.position or not batteryCell.company:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Please provide all values")

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

    return {"msg": "Success! BatteryCell removed", "id": id}

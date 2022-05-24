from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter, Request
from typing import Optional, List
from .. import models, schemas, oauth2, entities
from ..database import database, get_db
from ..utils import (search_query_battery_cell,
                     calc_float_avg,
                     get_total_cells_by_value,
                     get_avg_attr_by_another_attr_value)
# from ..models import batteryCells, csvCycleData
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

import re

router = APIRouter(
    prefix="/battery-cells"
)

limiter = Limiter(key_func=get_remote_address)


@router.get("/", response_model=schemas.BatteryCellsManyOut)
async def get_batteryCells(db: AsyncSession = Depends(get_db),
                           current_user: int = Depends(
                               oauth2.get_current_user),
                           limit: Optional[int] = 10,
                           search: Optional[str] = "",
                           cathode: Optional[str] = "",
                           anode: Optional[str] = "",
                           type: Optional[str] = "",
                           source: Optional[str] = "",
                           page: Optional[int] = 1,
                           skip: Optional[int] = 0):

    query = await db.execute(select(models.Battery_Cells).where(
        models.Battery_Cells.owner_id == current_user.id))

    all_batteryCells = query.scalars().all()

    if search and search != None:
        all_batteryCells = list(filter(lambda x: re.search(
            search, x.cell_name_id), all_batteryCells))

    all_batteryCells = search_query_battery_cell(
        cathode, 'cathode', all_batteryCells)
    all_batteryCells = search_query_battery_cell(
        anode, 'anode', all_batteryCells)
    all_batteryCells = search_query_battery_cell(
        type, 'type', all_batteryCells)
    all_batteryCells = search_query_battery_cell(
        source, 'source', all_batteryCells)

    total_battery_cells = len(all_batteryCells)

    avg_capacity = calc_float_avg("capacity_ah", all_batteryCells)
    avg_depth_of_discharge = calc_float_avg(
        "depth_of_discharge", all_batteryCells)
    avg_temperature_c = calc_float_avg("temperature_c", all_batteryCells)

    total_cathode_lco_cells = get_total_cells_by_value(
        'cathode', 'LCO', all_batteryCells)
    total_cathode_lfp_cells = get_total_cells_by_value(
        'cathode', 'LFP', all_batteryCells)
    total_cathode_nca_cells = get_total_cells_by_value(
        'cathode', 'NCA', all_batteryCells)
    total_cathode_nmc_cells = get_total_cells_by_value(
        'cathode', 'NMC', all_batteryCells)
    total_cathode_nmclco_cells = get_total_cells_by_value(
        'cathode', 'NMC-LCO', all_batteryCells)

    avg_cycles_lco_cells = get_avg_attr_by_another_attr_value(
        "cycles", "cathode", "LCO", all_batteryCells)
    avg_cycles_lfp_cells = get_avg_attr_by_another_attr_value(
        "cycles", "cathode", "LFP", all_batteryCells)
    avg_cycles_nca_cells = get_avg_attr_by_another_attr_value(
        "cycles", "cathode", "NCA", all_batteryCells)
    avg_cycles_nmc_cells = get_avg_attr_by_another_attr_value(
        "cycles", "cathode", "NMC", all_batteryCells)
    avg_cycles_nmclco_cells = get_avg_attr_by_another_attr_value(
        "cycles", "cathode", "NMC-LCO", all_batteryCells)

    return {"battery_cells": all_batteryCells,
            "total_battery_cells": total_battery_cells,
            "avg_capacity": avg_capacity,
            "avg_depth_of_discharge": avg_depth_of_discharge,
            "avg_temperature_c": avg_temperature_c,
            "total_cathode_lco_cells": total_cathode_lco_cells,
            "total_cathode_lfp_cells": total_cathode_lfp_cells,
            "total_cathode_nca_cells": total_cathode_nca_cells,
            "total_cathode_nmc_cells": total_cathode_nmc_cells,
            "total_cathode_nmclco_cells": total_cathode_nmclco_cells,
            "avg_cycles_lco_cells": avg_cycles_lco_cells,
            "avg_cycles_lfp_cells": avg_cycles_lfp_cells,
            "avg_cycles_nca_cells": avg_cycles_nca_cells,
            "avg_cycles_nmc_cells": avg_cycles_nmc_cells,
            "avg_cycles_nmclco_cells": avg_cycles_nmclco_cells,
            }


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.BatteryCellOut)
@limiter.limit("30/minute", error_message="Too many requests, please try again later")
async def create_batteryCell(batteryCell: schemas.BatteryCellCreate, request: Request, db: AsyncSession = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):

    # make sure the response_model = the table itself for pytest
    # make sure in the function it says "request: Request" and not "req: Request", or else the slowapi rate limiter won't work

    created_batteryCell = models.Battery_Cells(
        **batteryCell.dict(), owner_id=current_user.id)

    db.add(created_batteryCell)

    await db.commit()
    await db.refresh(created_batteryCell)
    return created_batteryCell


@router.patch("/{id}", response_model=schemas.BatteryCellOut)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def update_batteryCell(request: Request, id: int, updating_batteryCell: schemas.BatteryCellUpdate, db: AsyncSession = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):

    batteryCell = await db.get(models.Battery_Cells, id)

    if not batteryCell:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Battery cell with id: {id} does not exist")

    if batteryCell.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform requested action")

    batteryCell_data = updating_batteryCell.dict(exclude_unset=True)
    for key, value in batteryCell_data.items():
        setattr(batteryCell, key, value)

    db.add(batteryCell)
    await db.commit()
    await db.refresh(batteryCell)

    return batteryCell


@router.delete("/{id}", status_code=status.HTTP_200_OK)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def delete_batteryCell(request: Request, id: int,  db: AsyncSession = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):

    batteryCell = await db.get(models.Battery_Cells, id)

    if not batteryCell:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Battery cell with id: {id} does not exist")

    if batteryCell.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not authorized to perform requested action")

    await db.delete(batteryCell)
    await db.commit()

    # if the battery cell gets deleted, then the csv data associated with that same battery cell should be deleted

    cycle_query = await db.execute(select(models.Csv_Cycle_Data).where(
        models.Csv_Cycle_Data.battery_cell_id == id))

    csv_cycle_data = cycle_query.scalars().all()

    if csv_cycle_data:
        for row in csv_cycle_data:
            await db.delete(row)
        await db.commit()
    else:
        pass

    time_series_query = await db.execute(select(models.Csv_Time_Series_Data).where(
        models.Csv_Time_Series_Data.battery_cell_id == id))

    csv_time_series_data = time_series_query.scalars().all()

    if csv_time_series_data:
        for row in csv_time_series_data:
            await db.delete(row)
        await db.commit()
    else:
        pass

    return {"msg": "Success! Battery cell removed", "id": id}

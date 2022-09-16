from fastapi import status, Depends, HTTPException, APIRouter, Request
from .. import schemas, models, utils, oauth2
from ..models import Base
from ..database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from asyncpg import UniqueViolationError
import asyncpg
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel


router = APIRouter(
    prefix="/api/test"
)


class Item(BaseModel):
    name: str
    description: str
    price: float
    tax: float


async def query_db(db: AsyncSession, model: int):
    query = await db.execute(select(model))
    data = query.scalars().all()
    # do not raise HTTPException here or the frontend tests (ie. Cypress) will stop
    if not data:
        data = []
    return data


@router.post("/mock-user", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
async def create_mock_user(request: Request, db: AsyncSession = Depends(get_db)):
    try:
        user = {
            "first_name": "silas",
            "last_name": "corrin",
            "email": "silas.corrin@gmail.com",
            "password": "hello123"
        }

        query = select(models.Users).where(models.Users.email == user["email"])
        existing_email = await db.execute(query)
        emailAlreadyExists = existing_email.first()

        if emailAlreadyExists:
            raise Exception("Email already exists")

        hashed_password = utils.hash(user["password"])
        user["password"] = hashed_password

        new_user = models.Users(**user)
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)

        access_token = oauth2.create_access_token(
            data={"user_id": new_user.id})

        mock_user = {"email": user["email"],
                     "first_name": user["first_name"], "last_name": user["last_name"]}

        return {"id": new_user.id, "user": mock_user, "token": access_token}
    except Exception as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"{error}")
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="An error occurred")


@router.delete("/clear-db", status_code=status.HTTP_200_OK)
async def clear_database(request: Request, db: AsyncSession = Depends(get_db)):

    users = await query_db(db, models.Users)
    battery_cells = await query_db(db, models.Battery_Cells)

    # do not raise HTTPException here or the frontend tests (ie. Cypress) will stop

    async def delete_data(data_list: list, db_session: AsyncSession):
        if data_list:
            for row in data_list:
                await db_session.delete(row)
            await db_session.commit()
        else:
            return "No data list provided"

    await delete_data(users, db)
    await delete_data(battery_cells, db)

    return {"message": "Cleared db!"}


@router.post("/mock-battery-cells", status_code=status.HTTP_201_CREATED)
async def create_mock_battery_cells(request: Request, db: AsyncSession = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
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
        "owner_id": current_user.id
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
        "owner_id": current_user.id
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
        "owner_id": current_user.id
    }]

    def create_cell_model(battery_cell):
        return models.Battery_Cells(**battery_cell)

    battery_cells_map = map(create_cell_model, battery_cells_data)
    battery_cells = list(battery_cells_map)

    db.add_all(battery_cells)
    await db.commit()

    all_battery_cells = await db.execute(select(models.Battery_Cells))
    mock_battery_cells = all_battery_cells.scalars().all()

    return {"battery_cells": mock_battery_cells}


@router.get("/get-db", status_code=status.HTTP_200_OK)
async def get_database(request: Request, db: AsyncSession = Depends(get_db)):
    # this router is never used for automated testing (ie. Cypress)
    # only used as a helper in Postman

    users = await query_db(db, models.Users)
    mock_battery_cells = await query_db(db, models.Battery_Cells)

    total_battery_cells = len(mock_battery_cells)

    avg_capacity = utils.calc_float_avg(
        "capacity_ah", mock_battery_cells)
    avg_depth_of_discharge = utils.calc_float_avg(
        "depth_of_discharge", mock_battery_cells)
    avg_temperature_c = utils.calc_float_avg(
        "temperature_c", mock_battery_cells)

    total_cathode_lco_cells = utils.get_total_cells_by_value(
        'cathode', 'LCO', mock_battery_cells)
    total_cathode_lfp_cells = utils.get_total_cells_by_value(
        'cathode', 'LFP', mock_battery_cells)
    total_cathode_nca_cells = utils.get_total_cells_by_value(
        'cathode', 'NCA', mock_battery_cells)
    total_cathode_nmc_cells = utils.get_total_cells_by_value(
        'cathode', 'NMC', mock_battery_cells)
    total_cathode_nmclco_cells = utils.get_total_cells_by_value(
        'cathode', 'NMC-LCO', mock_battery_cells)

    avg_cycles_lco_cells = utils.get_avg_attr_by_another_attr_value(
        "cycles", "cathode", "LCO", mock_battery_cells)
    avg_cycles_lfp_cells = utils.get_avg_attr_by_another_attr_value(
        "cycles", "cathode", "LFP", mock_battery_cells)
    avg_cycles_nca_cells = utils.get_avg_attr_by_another_attr_value(
        "cycles", "cathode", "NCA", mock_battery_cells)
    avg_cycles_nmc_cells = utils.get_avg_attr_by_another_attr_value(
        "cycles", "cathode", "NMC", mock_battery_cells)
    avg_cycles_nmclco_cells = utils.get_avg_attr_by_another_attr_value(
        "cycles", "cathode", "NMC-LCO", mock_battery_cells)

    return {"users": users,
            "battery_cells": mock_battery_cells,
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

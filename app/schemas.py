from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

from pydantic.types import conint, constr


class UserBase(BaseModel):
    first_name: constr(min_length=2, max_length=20)
    last_name: constr(min_length=2, max_length=20)
    email: EmailStr

    class Config:
        anystr_strip_whitespace = True


class UserCreate(UserBase):
    password: constr(min_length=7)


class UserOut(BaseModel):
    id: int
    user: dict
    token: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(UserBase):
    first_name: Optional[constr(min_length=2, max_length=20)]
    last_name: Optional[constr(min_length=2, max_length=20)]
    email: Optional[EmailStr]

    class Config:
        orm_mode = True

# -----------------------------------------


class BatteryCellBase(BaseModel):
    cell_name_id: str
    cycles: float
    cathode: str
    anode: str
    capacity_ah: float
    type: str
    source: str
    temperature_c: float
    max_state_of_charge: float
    min_state_of_charge: float
    depth_of_discharge: float
    charge_capacity_rate: float
    discharge_capacity_rate: float


class BatteryCellCreate(BatteryCellBase):
    pass


class BatteryCellUpdate(BatteryCellBase):
    pass


class BatteryCellOut(BatteryCellBase):
    id: int
    owner_id: int

# leave this here if the error "value is not valid dict"
    class Config:
        orm_mode = True


class BatteryCellsManyOut(BaseModel):
    battery_cells: List[BatteryCellOut]
    total_battery_cells: int
    avg_capacity: float
    avg_depth_of_discharge: float
    avg_temperature_c: float
    total_cathode_lco_cells: int
    total_cathode_lfp_cells: int
    total_cathode_nca_cells: int
    total_cathode_nmc_cells: int
    total_cathode_nmclco_cells: int
    avg_cycles_lco_cells: float
    avg_cycles_lfp_cells: float
    avg_cycles_nca_cells: float
    avg_cycles_nmc_cells: float
    avg_cycles_nmclco_cells: float

    class Config:
        orm_mode = True


# -----------------------------------------


class Token(BaseModel):
    token: str


class TokenData(BaseModel):
    id: Optional[str] = None

# -----------------------------------------

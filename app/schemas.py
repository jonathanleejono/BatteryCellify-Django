from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

from pydantic.types import conint, constr


class BatteryCellBase(BaseModel):
    cell_id: str
    battery_cycles: int
    cathode: str
    anode: str
    capacity_ah: int
    battery_type: str
    battery_source: str
    temperature_c: int
    max_state_of_charge_soc: int
    min_state_of_charge_soc: int
    depth_of_discharge_dod: int
    charge_capacity_rate: int
    discharge_capacity_rate: int


class BatteryCellCreate(BatteryCellBase):
    pass


class BatteryCellUpdate(BatteryCellBase):
    pass


class BatteryCellOut(BatteryCellBase):
    id: int

    class Config:
        orm_mode = True


class BatteryCellsOut(BatteryCellBase):
    id: int

    class Config:
        orm_mode = True


class BatteryCellsManyOut(BaseModel):
    batteryCells: List[BatteryCellOut]
    totalBatteryCells: int
    numOfPages: int

    class Config:
        orm_mode = True

# -----------------------------------------


class Token(BaseModel):
    token: str


class TokenData(BaseModel):
    id: Optional[str] = None

# -----------------------------------------


class UserCreate(BaseModel):
    name: constr(min_length=2, max_length=20)
    email: EmailStr
    password: constr(min_length=7)

    class Config:
        anystr_strip_whitespace = True


class UserOut(BaseModel):
    user: dict
    token: str

    class Config:
        orm_mode = True


class UserLoginOut(BaseModel):
    email: EmailStr
    password: str

    class Config:
        orm_mode = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: str
    email: EmailStr
    lastName: str

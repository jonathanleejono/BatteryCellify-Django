from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

from pydantic.types import conint, constr


class BatteryCellBase(BaseModel):
    cellNameId: str
    cycles: str
    cathode: str
    anode: str
    capacityAh: str
    type: str
    source: str
    temperatureC: str
    maxStateOfCharge: str
    minStateOfCharge: str
    depthOfDischarge: str
    chargeCapacityRate: str
    dischargeCapacityRate: str


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

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
    pass

# -----------------------------------------


class BatteryCellBase(BaseModel):
    cell_name_id: str
    cycles: float
    cathode: str
    anode: str
    capacityAh: float
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


class BatteryCellsManyOut(BaseModel):
    batteryCells: List[BatteryCellOut]
    totalBatteryCells: int
    averageCapacity: float
    averageDepthOfDischarge: float
    averageTemperatureC: float
    totalCathodeLCOCells: int
    totalCathodeLFPCells: int
    totalCathodeNCACells: int
    totalCathodeNMCCells: int
    totalCathodeNMCLCOCells: int
    avgCyclesLC0Cells: float
    avgCyclesLFPCells: float
    avgCyclesNCACells: float
    avgCyclesNMCCells: float
    avgCyclesNMCLCOCells: float
    lcoCycles: List

    class Config:
        orm_mode = True


# -----------------------------------------


class Token(BaseModel):
    token: str


class TokenData(BaseModel):
    id: Optional[str] = None

# -----------------------------------------

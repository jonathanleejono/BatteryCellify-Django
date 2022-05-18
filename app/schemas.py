from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

from pydantic.types import conint, constr


class BatteryCellBase(BaseModel):
    cellNameId: str
    cycles: float
    cathode: str
    anode: str
    capacityAh: float
    type: str
    source: str
    temperatureC: float
    maxStateOfCharge: float
    minStateOfCharge: float
    depthOfDischarge: float
    chargeCapacityRate: float
    dischargeCapacityRate: float


class BatteryCellCreate(BatteryCellBase):
    pass


class BatteryCellUpdate(BatteryCellBase):
    pass


class BatteryCellOut(BatteryCellBase):
    id: int

    class Config:
        orm_mode = True


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
    avgTemp18650Cells: float
    avgMaxSoC18650Cells: float
    avgMinSoC18650Cells: float
    avgDoD18650Cells: float
    avgChargeCRate18650Cells: float
    avgDischargeCRate18650Cells: float
    avgTempPouchCells: float
    avgMaxSoCPouchCells: float
    avgMinSoCPouchCells: float
    avgDoDPouchCells: float
    avgChargeCRatePouchCells: float
    avgDischargeCRatePouchCells: float
    avgTempPrismaticCells: float
    avgMaxSoCPrismaticCells: float
    avgMinSoCPrismaticCells: float
    avgDoDPrismaticCells: float
    avgChargeCRatePrismaticCells: float
    avgDischargeCRatePrismaticCells: float

    class Config:
        orm_mode = True


# -----------------------------------------


class Token(BaseModel):
    token: str


class TokenData(BaseModel):
    id: Optional[str] = None

# -----------------------------------------


class UserCreate(BaseModel):
    firstName: constr(min_length=2, max_length=20)
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
    firstName: str
    email: EmailStr
    lastName: str

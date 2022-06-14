from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
import sqlmodel

from pydantic.types import conint, constr
from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

import sqlalchemy as sa

# ------leaving this for future SQLModel use


class UserBase(SQLModel):
    first_name: constr(min_length=2, max_length=20)
    last_name: constr(min_length=2, max_length=20)
    email: EmailStr

    class Config:
        anystr_strip_whitespace = True


class UserCreate(UserBase):
    password: constr(min_length=7)


class UserLogin(SQLModel):
    email: EmailStr
    password: str


class UserUpdate(SQLModel):
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[EmailStr]


class UserOut(SQLModel):
    id: int
    user: dict
    token: str


class Users(UserCreate, table=True):
    id: int = Field(sa_column=sqlmodel.Column(
        sqlmodel.Integer,
        nullable=False, primary_key=True)
    )
    created_at: datetime = Field(default=datetime.now(timezone.utc), sa_column=sqlmodel.Column(
        sqlmodel.DateTime(timezone=True),
        nullable=False)
    )

# -----------------------------------------


class BatteryCellBase(SQLModel):
    cell_name_id: str
    cycles: float
    cathode: str = Field(
        sa_column=sqlmodel.Column(sa.Enum('LCO', 'LFP', 'NCA', 'NMC',
                                          'NMC-LCO', name="cathode_enum"),
                                  nullable=False))

    anode: str = Field(
        sa_column=sqlmodel.Enum('graphite', name="anode_enum"),
        nullable=False)

    capacity_ah: float

    type: str = Field(
        sa_column=sqlmodel.Enum(
            '18650', 'pouch', 'prismatic', name="type_enum"),
        nullable=False)

    source: str = Field(
        sa_column=sqlmodel.Enum('HNEI', 'UL-PUR', 'calce',
                                'oxford', 'snl', name="source_enum"),
        nullable=False)
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


class BatteryCellsManyOut(SQLModel):
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


class Battery_Cells(BatteryCellBase, table=True):
    id: int = Field(sa_column=sqlmodel.Column(
        sqlmodel.Integer,
        nullable=False, primary_key=True)
    )
    created_at: datetime = Field(default=datetime.now(timezone.utc),
                                 sa_column=sqlmodel.Column(
        sqlmodel.DateTime(timezone=True),
        nullable=False)
    )
    owner_id: int = Field(sa_column=sqlmodel.Column(
        sqlmodel.ForeignKey(
            "users.id", ondelete="CASCADE"),
        nullable=False))

# -----------------------------------------


class Token(SQLModel):
    token: str


class TokenData(SQLModel):
    id: Optional[str] = None

# -----------------------------------------


class Csv_Cycle_Data_Base(SQLModel):
    cycle_index: int
    start_time: float
    end_time: float
    test_time_seconds: float
    min_current_a: float
    max_current_a: float
    min_voltage_v: float
    max_voltage_v: float
    charge_capacity_ah: float
    discharge_capacity_ah: float
    charge_energy_wh: float
    discharge_energy_wh: float


class Csv_Cycle_Data(Csv_Cycle_Data_Base, table=True):
    id: int = Field(sa_column=sqlmodel.Column(
        sqlmodel.Integer,
        nullable=False, primary_key=True)
    )
    created_at: datetime = Field(default=datetime.now(timezone.utc),
                                 sa_column=sqlmodel.Column(
        sqlmodel.DateTime(timezone=True),
        nullable=False)
    )
    owner_id: int = Field(sa_column=sqlmodel.Column(
        sqlmodel.ForeignKey(
            "users.id", ondelete="CASCADE"),
        nullable=False))
    battery_cell_id: int = Field(sa_column=sqlmodel.Column(
        sqlmodel.ForeignKey(
            "battery_cells.id", ondelete="CASCADE"),
        nullable=False))


class Csv_Time_Series_Data_Base(SQLModel):
    date_time: str
    test_time_seconds: float
    cycle_index: int
    current_a: float
    voltage_v: float
    start_time: float
    end_time: float
    charge_capacity_ah: float
    discharge_capacity_ah: float
    charge_energy_wh: float
    discharge_energy_wh: float
    environment_temp_celsius: float
    cell_temp_celsius: float


class Csv_Time_Series_Data(Csv_Time_Series_Data_Base, table=True):
    id: int = Field(sa_column=sqlmodel.Column(
        sqlmodel.Integer,
        nullable=False, primary_key=True)
    )
    created_at: datetime = Field(default=datetime.now(timezone.utc), sa_column=sqlmodel.Column(
        sqlmodel.DateTime(timezone=True),
        nullable=False)
    )
    owner_id: int = Field(sa_column=sqlmodel.Column(
        sqlmodel.ForeignKey(
            "users.id", ondelete="CASCADE"),
        nullable=False))
    battery_cell_id: int = Field(sa_column=sqlmodel.Column(
        sqlmodel.ForeignKey(
            "battery_cells.id", ondelete="CASCADE"),
        nullable=False))

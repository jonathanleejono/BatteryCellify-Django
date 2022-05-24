import enum
import sqlalchemy
from sqlalchemy.dialects import postgresql
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Table, Enum, Float
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()

# do not add commas at the end of the columns


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=True,)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(
        timezone=True), nullable=False, server_default=text('now()'))


class Battery_Cells(Base):
    __tablename__ = "battery_cells"

    id = Column(Integer,
                primary_key=True, nullable=False)
    owner_id = Column(Integer, ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=False)
    cell_name_id = Column(String, nullable=False)
    cycles = Column(Float, nullable=False)
    cathode = Column(Enum('LCO', 'LFP', 'NCA', 'NMC', 'NMC-LCO', name="cathode_enum"),
                     nullable=False, default="LCO", server_default="LCO")
    anode = Column(Enum('graphite', name="anode_enum"),
                   nullable=False, default="graphite", server_default="graphite")
    capacity_ah = Column(Float, nullable=False)
    type = Column(Enum('18650', 'pouch', 'prismatic', name="type_enum"),
                  nullable=False, default="18650", server_default="18650")
    source = Column(Enum('HNEI', 'UL-PUR', 'calce', 'oxford', 'snl', name="source_enum"),
                    nullable=False, default="HNEI", server_default="HNEI")
    temperature_c = Column(Float, nullable=False)
    max_state_of_charge = Column(Float, nullable=False)
    min_state_of_charge = Column(Float, nullable=False)
    depth_of_discharge = Column(Float, nullable=False)
    charge_capacity_rate = Column(Float, nullable=False)
    discharge_capacity_rate = Column(Float, nullable=False)
    created_at = Column(TIMESTAMP(
        timezone=True), nullable=False, server_default=text('now()'))


class Csv_Cycle_Data(Base):
    __tablename__ = "csv_cycle_data"

    id = Column(Integer,
                primary_key=True, nullable=False)
    owner_id = Column(Integer, ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=False)
    battery_cell_id = Column(Integer, ForeignKey(
        "battery_cells.id", ondelete="CASCADE"), nullable=False)
    cycle_index = Column(Integer, nullable=False)
    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)
    test_time_seconds = Column(Float, nullable=False)
    min_current_a = Column(Float, nullable=False)
    max_current_a = Column(Float, nullable=False)
    min_voltage_v = Column(Float, nullable=False)
    max_voltage_v = Column(Float, nullable=False)
    charge_capacity_ah = Column(Float, nullable=False)
    discharge_capacity_ah = Column(Float, nullable=False)
    charge_energy_wh = Column(Float, nullable=False)
    discharge_energy_wh = Column(Float, nullable=False)
    created_at = Column(TIMESTAMP(
        timezone=True), nullable=False, server_default=text('now()'))


class Csv_Time_Series_Data(Base):
    __tablename__ = "csv_time_series_data"

    id = Column(Integer,
                primary_key=True, nullable=False)
    owner_id = Column(Integer, ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=False)
    battery_cell_id = Column(Integer, ForeignKey(
        "battery_cells.id", ondelete="CASCADE"), nullable=False)
    date_time = Column(String, nullable=False)
    test_time_seconds = Column(Float, nullable=False)
    cycle_index = Column(Integer, nullable=False)
    current_a = Column(Float, nullable=False)
    voltage_v = Column(Float, nullable=False)
    charge_capacity_ah = Column(Float, nullable=False)
    discharge_capacity_ah = Column(Float, nullable=False)
    charge_energy_wh = Column(Float, nullable=False)
    discharge_energy_wh = Column(Float, nullable=False)
    environment_temp_celsius = Column(Float, nullable=False)
    cell_temp_celsius = Column(Float, nullable=False)
    created_at = Column(TIMESTAMP(
        timezone=True), nullable=False, server_default=text('now()'))

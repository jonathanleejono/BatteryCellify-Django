import enum
import sqlalchemy
from sqlalchemy.dialects import postgresql
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Table, Enum, Float
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.orm import relationship
from .database import SQLALCHEMY_DATABASE_URL

# you can import MetaData from sqlalchemy or just leave the 'sqlalchemy.' in the front

metadata = sqlalchemy.MetaData()

# capitalization of variable and table name must match

users = Table(
    "users",
    metadata,
    Column("id", Integer,
           primary_key=True, nullable=False),
    Column("firstName", String, nullable=False),
    Column("lastName", String, nullable=True, server_default="lastName"),
    Column("email", String, nullable=False, unique=True),
    Column("password", String, nullable=False),
    Column("created_at", TIMESTAMP(
        timezone=True), nullable=False, server_default=text('now()')),
)


batteryCells = Table(
    "batteryCells",
    metadata,
    Column("id", Integer,
           primary_key=True, nullable=False),
    Column("cellNameId", String, nullable=False),
    Column("cycles", String, nullable=False),
    Column("cathode", Enum('LCO', 'LFP', 'NCA', 'NMC', 'NMC-LCO', name="cathode_enum"),
           nullable=False, default="LCO", server_default="LCO"),
    Column("anode", Enum('graphite', name="anode_enum"),
           nullable=False, default="graphite", server_default="graphite"),
    Column("capacityAh", String, nullable=False),
    Column("type", Enum('18650', 'pouch', 'prismatic', name="type_enum"),
           nullable=False, default="18650", server_default="18650"),
    Column("source", Enum('HNEI', 'UL-PUR', 'calce', 'oxford', 'snl', name="source_enum"),
           nullable=False, default="HNEI", server_default="HNEI"),
    Column("temperatureC", String, nullable=False),
    Column("maxStateOfCharge", String, nullable=False),
    Column("minStateOfCharge", String, nullable=False),
    Column("depthOfDischarge", String, nullable=False),
    Column("chargeCapacityRate", String, nullable=False),
    Column("dischargeCapacityRate", String, nullable=False),
    Column("created_at", TIMESTAMP(
        timezone=True), nullable=False, server_default=text('now()')),
    Column("owner_id", Integer, ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=False)
)

csvCycleData = Table(
    "csvCycleData",
    metadata,
    Column("id", Integer,
           primary_key=True, nullable=False),
    Column("cycleIndex", Integer, nullable=False),
    Column("startTime", Float, nullable=False),
    Column("endTime", Float, nullable=False),
    Column("testTimeSeconds", Float, nullable=False),
    Column("minCurrentA", Float, nullable=False),
    Column("maxCurrentA", Float, nullable=False),
    Column("minVoltageV", Float, nullable=False),
    Column("maxVoltageV", Float, nullable=False),
    Column("chargeCapacityAh", Float, nullable=False),
    Column("dischargeCapacityAh", Float, nullable=False),
    Column("chargeEnergyWh", Float, nullable=False),
    Column("dischargeEnergyWh", Float, nullable=False),
    Column("created_at", TIMESTAMP(
        timezone=True), nullable=False, server_default=text('now()')),
    Column("batteryCell_id", Integer, ForeignKey(
        "batteryCells.id", ondelete="CASCADE"), nullable=False),
    Column("owner_id", Integer, ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=False)
)
csvTimeSeriesData = Table(
    "csvTimeSeriesData",
    metadata,
    Column("id", Integer,
           primary_key=True, nullable=False),
    Column("dateTime", String, nullable=False),
    Column("testTimeSeconds", Float, nullable=False),
    Column("cycleIndex", Integer, nullable=False),
    Column("currentA", Float, nullable=False),
    Column("voltageV", Float, nullable=False),
    Column("chargeCapacityAh", Float, nullable=False),
    Column("dischargeCapacityAh", Float, nullable=False),
    Column("chargeEnergyWh", Float, nullable=False),
    Column("dischargeEnergyWh", Float, nullable=False),
    Column("environmentTempCelsius", Float, nullable=False),
    Column("cellTempCelsius", Float, nullable=False),
    Column("created_at", TIMESTAMP(
        timezone=True), nullable=False, server_default=text('now()')),
    Column("batteryCell_id", Integer, ForeignKey(
        "batteryCells.id", ondelete="CASCADE"), nullable=False),
    Column("owner_id", Integer, ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=False)
)


# the order matters
engine = sqlalchemy.create_engine(SQLALCHEMY_DATABASE_URL)

metadata.create_all(engine)

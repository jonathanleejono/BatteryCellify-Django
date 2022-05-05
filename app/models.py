import enum
import sqlalchemy
from sqlalchemy.dialects import postgresql
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Table, Enum
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
    Column("name", String, nullable=False),
    Column("email", String, nullable=False, unique=True),
    Column("password", String, nullable=False),
    Column("lastName", String, nullable=True, server_default="lastName"),
    Column("created_at", TIMESTAMP(
        timezone=True), nullable=False, server_default=text('now()')),
)


batteryCells = Table(
    "batteryCells",
    metadata,
    Column("id", Integer,
           primary_key=True, nullable=False),
    Column("cell_id", String, nullable=False),
    Column("battery_cycles", Integer, nullable=False),
    Column("cathode", Enum('LCO', 'LFP', 'NCA', 'NMC', 'NMC-LCO', name="cathode_enum"),
           nullable=False, default="LCO", server_default="LCO"),
    Column("anode", Enum('graphite', name="anode_enum"),
           nullable=False, default="graphite", server_default="graphite"),
    Column("capacity_ah", Integer, nullable=False),
    Column("battery_type", Enum('18650', 'pouch', 'prismatic', name="battery_type_enum"),
           nullable=False, default="18650", server_default="18650"),
    Column("battery_source", Enum('HNEI', 'UL-PUR', 'calce', 'oxford', 'snl', name="battery_source_enum"),
           nullable=False, default="HNEI", server_default="HNEI"),
    Column("temperature_c", Integer, nullable=False),
    Column("max_state_of_charge_soc", Integer, nullable=False),
    Column("min_state_of_charge_soc", Integer, nullable=False),
    Column("depth_of_discharge_dod", Integer, nullable=False),
    Column("charge_capacity_rate", Integer, nullable=False),
    Column("discharge_capacity_rate", Integer, nullable=False),
    Column("created_at", TIMESTAMP(
        timezone=True), nullable=False, server_default=text('now()')),
    Column("owner_id", Integer, ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=False)
)

# the order matters
engine = sqlalchemy.create_engine(SQLALCHEMY_DATABASE_URL)

metadata.create_all(engine)

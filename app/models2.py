# import enum
# import sqlalchemy
# from sqlalchemy.dialects import postgresql
# from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Table, Enum, Float
# from sqlalchemy.sql.expression import text
# from sqlalchemy.sql.sqltypes import TIMESTAMP
# from sqlalchemy.orm import relationship
# from .database import SQLALCHEMY_DATABASE_URL


# # you can import MetaData from sqlalchemy or just leave the 'sqlalchemy.' in the front

# metadata = sqlalchemy.MetaData()

# # capitalization of variable and table name must match

# users = Table(
#     "users",
#     metadata,
#     Column("id", Integer,
#            primary_key=True, nullable=False),
#     Column("first_name", String, nullable=False),
#     Column("last_name", String, nullable=True, server_default="last_name"),
#     Column("email", String, nullable=False, unique=True),
#     Column("password", String, nullable=False),
#     Column("created_at", TIMESTAMP(
#         timezone=True), nullable=False, server_default=text('now()')),
# )


# batteryCells = Table(
#     "batteryCells",
#     metadata,
#     Column("id", Integer,
#            primary_key=True, nullable=False),
#     Column("cell_name_id", String, nullable=False),
#     Column("cycles", Float, nullable=False),
#     Column("cathode", Enum('LCO', 'LFP', 'NCA', 'NMC', 'NMC-LCO', name="cathode_enum"),
#            nullable=False, default="LCO", server_default="LCO"),
#     Column("anode", Enum('graphite', name="anode_enum"),
#            nullable=False, default="graphite", server_default="graphite"),
#     Column("capacityAh", Float, nullable=False),
#     Column("type", Enum('18650', 'pouch', 'prismatic', name="type_enum"),
#            nullable=False, default="18650", server_default="18650"),
#     Column("source", Enum('HNEI', 'UL-PUR', 'calce', 'oxford', 'snl', name="source_enum"),
#            nullable=False, default="HNEI", server_default="HNEI"),
#     Column("temperature_c", Float, nullable=False),
#     Column("max_state_of_charge", Float, nullable=False),
#     Column("min_state_of_charge", Float, nullable=False),
#     Column("depth_of_discharge", Float, nullable=False),
#     Column("charge_capacity_rate", Float, nullable=False),
#     Column("discharge_capacity_rate", Float, nullable=False),
#     Column("created_at", TIMESTAMP(
#         timezone=True), nullable=False, server_default=text('now()')),
#     Column("owner_id", Integer, ForeignKey(
#         "users.id", ondelete="CASCADE"), nullable=False)
# )

# csvCycleData = Table(
#     "csvCycleData",
#     metadata,
#     Column("id", Integer,
#            primary_key=True, nullable=False),
#     Column("cycle_index", Integer, nullable=False),
#     Column("start_time", Float, nullable=False),
#     Column("end_time", Float, nullable=False),
#     Column("test_time_seconds", Float, nullable=False),
#     Column("min_current_a", Float, nullable=False),
#     Column("max_current_a", Float, nullable=False),
#     Column("min_voltage_v", Float, nullable=False),
#     Column("max_voltage_v", Float, nullable=False),
#     Column("charge_capacity_ah", Float, nullable=False),
#     Column("discharge_capacity_ah", Float, nullable=False),
#     Column("charge_energy_wh", Float, nullable=False),
#     Column("discharge_energy_wh", Float, nullable=False),
#     Column("created_at", TIMESTAMP(
#         timezone=True), nullable=False, server_default=text('now()')),
#     Column("battery_cell_id", Integer, ForeignKey(
#         "batteryCells.id", ondelete="CASCADE"), nullable=False),
#     Column("owner_id", Integer, ForeignKey(
#         "users.id", ondelete="CASCADE"), nullable=False)
# )
# csvTimeSeriesData = Table(
#     "csvTimeSeriesData",
#     metadata,
#     Column("id", Integer,
#            primary_key=True, nullable=False),
#     Column("date_time", String, nullable=False),
#     Column("test_time_seconds", Float, nullable=False),
#     Column("cycle_index", Integer, nullable=False),
#     Column("current_a", Float, nullable=False),
#     Column("voltage_v", Float, nullable=False),
#     Column("charge_capacity_ah", Float, nullable=False),
#     Column("discharge_capacity_ah", Float, nullable=False),
#     Column("charge_energy_wh", Float, nullable=False),
#     Column("discharge_energy_wh", Float, nullable=False),
#     Column("environment_temp_celsius", Float, nullable=False),
#     Column("cell_temp_celsius", Float, nullable=False),
#     Column("created_at", TIMESTAMP(
#         timezone=True), nullable=False, server_default=text('now()')),
#     Column("battery_cell_id", Integer, ForeignKey(
#         "batteryCells.id", ondelete="CASCADE"), nullable=False),
#     Column("owner_id", Integer, ForeignKey(
#         "users.id", ondelete="CASCADE"), nullable=False)
# )


# # the order matters
# # engine = sqlalchemy.create_engine(SQLALCHEMY_DATABASE_URL)

# # metadata.create_all(engine)


# # class PostBase(SQLModel):
# #     title: str
# #     content: str
# #     colour: str
# #     published: bool = True


# # class PostCreate(PostBase):
# #     pass


# # class UserCreate(SQLModel):
# #     email: EmailStr = Field(default=None, nullable=False)
# #     password: str = Field(default=None, nullable=False)

# # Column("source", Enum('HNEI', 'UL-PUR', 'calce', 'oxford', 'snl', name="source_enum"),
# #        nullable=False, default="HNEI", server_default="HNEI"),

# #  Column("created_at", TIMESTAMP(
# #         timezone=True), nullable=False, server_default=text('now()')),


# # class UserOut(SQLModel):
# #     # id: int
# #     email: EmailStr
# #     # created_at: datetime

# #     class Config:
# #         orm_mode = True


# # class User(SQLModel, table=True):
# #     id: int = Field(default=None, primary_key=True)
# #     email: EmailStr
# #     password: str


# # # class PostOut(PostBase):
# # #     post: PostBase
# # #     # votes: int

# # #     class Config:
# # #         orm_mode = True


# # class Post_Test(PostBase, table=True):
# #     id: int = Field(sa_column=sqlmodel.Column(
# #         sqlmodel.Integer,
# #         nullable=False, primary_key=True)
# #     )
# #     created_at: datetime = Field(default=datetime.now(timezone.utc), sa_column=sqlmodel.Column(
# #         sqlmodel.DateTime(timezone=True),
# #         nullable=False)
# #     )


# # class Token(SQLModel):
# #     access_token: str
# #     token_type: str


# # class TokenData(SQLModel):
# #     id: Optional[str] = None

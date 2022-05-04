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
    Column("location", String, nullable=True, server_default="my city"),
    Column("created_at", TIMESTAMP(
        timezone=True), nullable=False, server_default=text('now()')),
)


# class JobStatus(enum.Enum):
#     interview = 1
#     pending = 2
#     denied = 3


# class JobType(enum.Enum):
#     full_time = 1
#     part_time = 2
#     remote = 3
#     internship = 4


jobs = Table(
    "jobs",
    metadata,
    Column("id", Integer,
           primary_key=True, nullable=False),
    Column("company", String, nullable=False),
    Column("position", String, nullable=False),
    Column("status", Enum('interview', 'denied', 'pending', name="status_enum"),
           nullable=False, default="pending", server_default="pending"),
    Column("jobType", Enum('full-time', 'part-time', 'remote', 'internship', name="jobType_enum"),
           nullable=False, default="full-time", server_default="full-time"),
    Column("jobLocation", String, nullable=False, server_default="my city"),
    Column("created_at", TIMESTAMP(
        timezone=True), nullable=False, server_default=text('now()')),
    Column("owner_id", Integer, ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=False)
)

# the order matters
engine = sqlalchemy.create_engine(SQLALCHEMY_DATABASE_URL)

metadata.create_all(engine)

# class Users(Base):
#     __tablename__ = "users"
#     id = Column(Integer, primary_key=True, nullable=False)
#     name = Column(String, nullable=False)
#     email = Column(String, nullable=False, unique=True)
#     password = Column(String, nullable=False)
#     lastName = Column(String, nullable=False, server_default="lastName")
#     location = Column(String, nullable=False, server_default="my city")
#     created_at = Column(TIMESTAMP(timezone=True),
#                         nullable=False, server_default=text('now()'))

# class Jobs(Base):
#     __tablename__ = "jobs"

#     id = Column(Integer, primary_key=True, nullable=False)
#     company = Column(String, nullable=False)
#     position = Column(String, nullable=False)
#     status = Column(Enum('interview', 'pending', 'remote',
#                     name="status_enum"), server_default='pending', nullable=False)
#     jobType = Column(Enum('full-time', 'part-time', 'remote', 'internship',
#                           name="jobType_enum"), server_default='pending', nullable=False)
#     jobLocation = Column(String, nullable=False, server_default="my city")
#     created_at = Column(TIMESTAMP(timezone=True),
#                         nullable=False, server_default=text('now()'))
#     owner_id = Column(Integer, ForeignKey(
#         "users.id", ondelete="CASCADE"), nullable=False)
# #     owner = relationship("User")

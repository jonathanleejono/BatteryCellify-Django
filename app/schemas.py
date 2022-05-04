from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

from pydantic.types import conint, constr


class JobBase(BaseModel):
    company: constr(max_length=50)
    position: constr(max_length=50)
    status: str
    jobType: str
    jobLocation: str


class JobCreate(JobBase):
    pass


class JobUpdate(JobBase):
    pass


class JobOut(JobBase):
    id: int

    class Config:
        orm_mode = True


class JobsOut(JobBase):
    id: int

    class Config:
        orm_mode = True


class JobsManyOut(BaseModel):
    jobs: List[JobOut]
    totalJobs: int
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
    location: str
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
    location: str

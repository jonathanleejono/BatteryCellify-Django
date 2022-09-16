import logging
import os
from os import path
from pathlib import Path
from typing import Union

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exception_handlers import http_exception_handler
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from sqlalchemy.exc import IntegrityError
from starlette.templating import Jinja2Templates

from .config import settings
from .controllers import (batteryCellController, csvDataController,
                          testSeedDbController, usersController)
from .database import init_db

from structlog import get_logger

app = FastAPI()

origins = ["https://batterycellify.vercel.app", "*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.state.limiter = usersController.limiter
app.state.limiter = batteryCellController.limiter

app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.get("/ping")
async def pong():
    return {"ping": "pong!"}


logger = get_logger(__name__)


@app.get("/health")
async def health_check():
    """health check route"""
    logger.debug("health_check")
    return {"status": "healthy"}


# if using alembic migrations, leave this commented
# (because this function creates the SQL tables)
@app.on_event("startup")
async def on_startup():
    print("Database is connecting...")
    await init_db()


app.include_router(usersController.router)
app.include_router(batteryCellController.router)
app.include_router(csvDataController.router)

if settings.environment == "development":
    app.include_router(testSeedDbController.router)

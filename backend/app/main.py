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

app = FastAPI()

origins = ["https://batterycellify.vercel.app"]

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

# test 3


@app.get("/yoyo")
async def pong():
    return {"yo": "yo!"}


@app.on_event("startup")
async def on_startup():
    print("Database is starting up...")
    await init_db()


app.include_router(usersController.router)
app.include_router(batteryCellController.router)
app.include_router(csvDataController.router)

if settings.environment == "development":
    app.include_router(testSeedDbController.router)


***REMOVED***_dir = Path("./client/build")

# templates = Jinja2Templates(directory=build_dir.as_posix())


# app.mount(
#     "/static/",
#     StaticFiles(directory=build_dir / "static"),
#     name="React App static files",
# )


# @app.get("/{full_path:path}")
# async def catch_all(request: Request, full_path: str):
#     return templates.TemplateResponse("index.html", {"request": request})

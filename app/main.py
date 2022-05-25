import logging
from fastapi import FastAPI
from .database import init_db
from .controllers import authController, batteryCellController, csvDataController
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from os import path
import os
from pathlib import Path


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.state.limiter = authController.limiter
app.state.limiter = batteryCellController.limiter

app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.get("/ping")
async def pong():
    return {"ping": "pong!"}


@app.on_event("startup")
async def on_startup():
    print("Database is starting up...")
    await init_db()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# @app.on_event("shutdown")
# async def shutdown():
#     await database.disconnect()


app.include_router(authController.router)
app.include_router(batteryCellController.router)
app.include_router(csvDataController.router)

# script_dir = os.path.dirname(__file__)
# logger.info("relative path of script_dir: %s", script_dir)
# # st_abs_file_path = os.path.join(script_dir, "./client/build")
# # app.mount("/static", StaticFiles(directory=st_abs_file_path), name="static")


# path_str = path.dirname(path.realpath(__file__))
# logger.info("relative path of static folder: %s", path_str)

# current_file = Path(__file__)
# current_file_dir = current_file.parent
# project_root = current_file_dir.parent
# project_root_parent = project_root.parent
# project_root_absolute = project_root.resolve()
# logger.info("what is this1: %s", current_file)
# logger.info("what is this2: %s", current_file_dir)
# logger.info("what is this3: %s", project_root)
# logger.info("what is this5: %s", project_root.parent)
# logger.info("what is this4: %s", project_root_absolute)


# this messes up creation of things, only use when deploying
app.mount("/", StaticFiles(directory=f"{project_root_parent}/client/build",
          html=True), name="client/build")

from starlette.templating import Jinja2Templates
import logging
from fastapi import FastAPI, Request, HTTPException
from .database import init_db
from .controllers import batteryCellController, csvDataController, usersController, testSeedDbController
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from os import path
import os
from pathlib import Path
from fastapi.exception_handlers import http_exception_handler
from starlette.exceptions import HTTPException as StarletteHTTPException
from typing import Union
from fastapi.responses import FileResponse
from starlette.responses import RedirectResponse
from fastapi.encoders import jsonable_encoder
from fastapi import Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from .config import settings


# def serve_react_app(app: FastAPI, build_dir: Union[Path, str]) -> FastAPI:

#     if isinstance(build_dir, str):
#         build_dir = Path(build_dir)

#     app.mount(
#         "/static/",
#         StaticFiles(directory=build_dir / "static"),
#         name="React App static files",
#     )
#     templates = Jinja2Templates(directory=build_dir.as_posix())

#     @app.get("/{full_path:path}")
#     async def serve_react_app(request: Request, full_path: str):

#         return templates.TemplateResponse("index.html", {"request": request})

#     return app


# path_to_react_app_build_dir = './client/build'

app = FastAPI()


# app = serve_react_app(app, path_to_react_app_build_dir)

***REMOVED***_dir = Path("./client/build")

# templates = Jinja2Templates(directory=build_dir.as_posix())


origins = ["*"]

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


# @app.exception_handler(RequestValidationError)
# async def validation_exception_handler(request: Request, error: RequestValidationError):
#     try:
#         field = error.errors()[0]['loc'][1]
#         msg = error.errors()[0]['msg']

#         error_message = f"{field}: {msg}"

#         return JSONResponse(
#             status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
#             content=jsonable_encoder({"detail": f"{error_message}"}),
#         )
#     except:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
#                             detail="Please fill out all fields")

#  doesn't seem to work
# @app.exception_handler(IntegrityError)
# async def duplicate_exception_handler(request: Request, error: IntegrityError):

#     if "asyncpg.exceptions.UniqueViolationError" and "users_email_key" in str(error):
#         return JSONResponse(
#             status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
#             content=jsonable_encoder({"detail": "Email already exists"}),
#         )
#     else:
#         return JSONResponse(
#             status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
#             content=jsonable_encoder({"detail": f"{error}"}),
#         )


@app.get("/ping")
async def pong():
    return {"ping": "pong!"}


@app.on_event("startup")
async def on_startup():
    print("Database is starting up...")
    await init_db()


# @app.on_event("shutdown")
# async def shutdown():
#     await database.disconnect()


app.include_router(usersController.router)
app.include_router(batteryCellController.router)
app.include_router(csvDataController.router)

if settings.environment == "development":
    app.include_router(testSeedDbController.router)

# this messes up creation of things, only use when deploying
# app.mount("/", StaticFiles(directory="client/build",
#           html=True), name="client/build")

build_dir = Path("./client/build")

templates = Jinja2Templates(directory=build_dir.as_posix())


app.mount(
    "/static/",
    StaticFiles(directory=build_dir / "static"),
    name="React App static files",
)


@app.get("/{full_path:path}")
async def catch_all(request: Request, full_path: str):
    print("full_pathTEST: " + full_path)
    print("os.path.exists: ", os.path)
    # path = request.path_params["full_path"]
    # file = "/client/build/"+path

    # print('look for: ', path, file)
    # if os.path.exists(file):

    #     return FileResponse(file)
    # else:
    #     return templates.TemplateResponse("index.html", {"request": request})
    return templates.TemplateResponse("index.html", {"request": request})


# ----------------------------------------------------

# @app.exception_handler(RequestValidationError)
# async def validation_exception_handler(request: Request, error: RequestValidationError):
#     # error = error.errors()
#     field = error.errors()[0]['loc'][1]
#     print("error.errors(): ", error.errors())
#     print("error[0]: ", error.errors()[0])
#     print("error[0]: ", error.errors()[0]['loc'])
#     print("field: ", field)
#     print("field: ", field)

#     # return HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
#     #                      detail="Please fill out all fields!")

#     # return JSONResponse(
#     #     status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
#     #     content=jsonable_encoder({"detail": error.errors(),
#     #                               "body": error.body,
#     #                               "your_additional_errors777": {"error.detail": error.errors(), "This": " Error message"},
#     #                               "your_additional_errors": {"Will be": "Inside222", "This": " Error message"}}),
#     # )
#     return JSONResponse(
#         status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
#         content=jsonable_encoder({"detail": "Please fill out all fields"}),
#     )

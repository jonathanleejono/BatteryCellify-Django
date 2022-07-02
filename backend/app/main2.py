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

# app = FastAPI()

# app = serve_react_app(app, path_to_react_app_build_dir)

# build_dir = Path("./client/build")

# templates = Jinja2Templates(directory=build_dir.as_posix())

# @app.get("/{full_path:path}")
# async def catch_all(request: Request, full_path: str):
#     print("full_pathTEST: " + full_path)
#     print("os.path.exists: ", os.path)
#     # path = request.path_params["full_path"]
#     # file = "/client/build/"+path

#     # print('look for: ', path, file)
#     # if os.path.exists(file):

#     #     return FileResponse(file)
#     # else:
#     #     return templates.TemplateResponse("index.html", {"request": request})
#     return templates.TemplateResponse("index.html", {"request": request})

from fastapi import status, Depends, HTTPException, APIRouter, Request
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from .. import schemas, models, utils, oauth2
from ..database import database
from ..models import users
from slowapi import Limiter
from slowapi.util import get_remote_address


router = APIRouter()

limiter = Limiter(key_func=get_remote_address)


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
@limiter.limit("5/minute", error_message="Too many requests, please try again later")
async def create_user(user: schemas.UserCreate, request: Request):

    if not user.email or not user.name or not user.password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Please provide all values")

    emailAlreadyExists = await database.fetch_one(users.select().where(users.c.email == user.email))

    if emailAlreadyExists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Email already exists")

    hashed_password = utils.hash(user.password)
    user.password = hashed_password

    query = users.insert(values={**user.dict()})

    registered_user_id = await database.execute(query)

    access_token = oauth2.create_access_token(
        data={"user_id": registered_user_id})

    registered_user = {"email": user.email,
                       "name": user.name, "lastName": "lastName"}

    return {"user": registered_user, "token": access_token}


@router.post('/login', response_model=schemas.UserOut)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def login_user(request: Request, logging_in_user: schemas.UserLogin):

    # user_credentials: OAuth2PasswordRequestForm = Depends()

    if not logging_in_user.email or not logging_in_user.password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Please provide all values")

    query = users.select().where(
        users.c.email == logging_in_user.email)

    user = await database.fetch_one(query)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")

    if not utils.verify(logging_in_user.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")

    access_token = oauth2.create_access_token(data={"user_id": user.id})

    logged_in_user = {"email": user.email, "name": user.name,
                      "lastName": user.lastName}

    return {"user": logged_in_user, "token": access_token}


@router.patch('/updateUser', response_model=schemas.UserOut)
@limiter.limit("10/minute", error_message="Too many requests, please try again later")
async def update_user(request: Request, updated_user: schemas.UserUpdate, current_user: int = Depends(oauth2.get_current_user)):

    user_query = users.select().where(users.c.id == current_user.id)

    user = await database.fetch_one(user_query)

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Invalid Credentials")

    if not updated_user.email or not updated_user.name or not updated_user.lastName or not updated_user.location:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Please provide all values")

    query = users.update().where(
        users.c.id == current_user.id).values(**updated_user.dict())

    # updated_user_id = await database.execute(query)
    await database.execute(query)

    # use the current_user.id and not the updated_user_id for JWT to avoid auth issues
    access_token = oauth2.create_access_token(
        data={"user_id": current_user.id})

    return {"user": updated_user, "token": access_token}

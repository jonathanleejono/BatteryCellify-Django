from fastapi import status, Depends, HTTPException, APIRouter, Request
from sqlalchemy.orm import Session
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from .. import schemas, models, utils, oauth2, entities
from ..database import get_db
# from ..models import users
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select


router = APIRouter()

limiter = Limiter(key_func=get_remote_address)


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
@limiter.limit("100/hour", error_message="Too many requests, please try again later")
async def create_user(user: schemas.UserCreate, request: Request, db: AsyncSession = Depends(get_db)):

    query = select(models.Users).where(models.Users.email == user.email)
    existing_email = await db.execute(query)
    emailAlreadyExists = existing_email.first()

    if emailAlreadyExists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Email already exists")

    hashed_password = utils.hash(user.password)
    user.password = hashed_password

    if not user.email or not user.first_name or user.password is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Please provide all values")

    new_user = models.Users(**user.dict())
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    access_token = oauth2.create_access_token(
        data={"user_id": new_user.id})

    registered_user = {"email": user.email,
                       "first_name": user.first_name, "last_name": user.last_name}

    return {"id": new_user.id, "user": registered_user, "token": access_token}


@router.post('/login', response_model=schemas.UserOut)
@limiter.limit("20/minute", error_message="Too many requests, please try again later")
async def login_user(request: Request, logging_in_user: schemas.UserLogin, db: AsyncSession = Depends(get_db)):

    if not logging_in_user.email or not logging_in_user.password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Please provide all values")

    query = select(models.Users).where(
        models.Users.email == logging_in_user.email)

    user_exists = await db.execute(query)

    user = user_exists.scalar_one()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")

    if not utils.verify(logging_in_user.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")

    access_token = oauth2.create_access_token(data={"user_id": user.id})

    logged_in_user = {"email": user.email, "first_name": user.first_name,
                      "last_name": user.last_name}

    return {"id": user.id, "user": logged_in_user, "token": access_token}


@router.patch('/updateUser', response_model=schemas.UserOut)
@limiter.limit("20/minute", error_message="Too many requests, please try again later")
async def update_user(request: Request, updating_user: schemas.UserUpdate, db: AsyncSession = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):

    user = await db.get(models.Users, current_user.id)

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Invalid Credentials")

    # the exclude_unset = True tells Pydantic to only include the values that were sent by the client
    # ^ this avoids updating the user with "None" values unintentionally
    user_data = updating_user.dict(exclude_unset=True)
    for key, value in user_data.items():
        setattr(user, key, value)

    db.add(user)
    await db.commit()
    await db.refresh(user)

    # use the current_user.id and not the db.commit for JWT to avoid auth issues
    access_token = oauth2.create_access_token(
        data={"user_id": current_user.id})

    return {"id": current_user.id, "user": updating_user, "token": access_token}

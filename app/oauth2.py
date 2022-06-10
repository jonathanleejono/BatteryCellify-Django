from jose import JWTError, jwt
from datetime import datetime, timedelta
from . import schemas, models, entities
# from .models import users
from .database import get_db
from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from .config import settings
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select


oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')

SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def verify_access_token(token: str, credentials_exception):

    try:

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id: str = payload.get("user_id")

        if id is None:
            raise credentials_exception

        token_data = schemas.TokenData(id=id)

    except JWTError:
        raise credentials_exception

    return token_data


async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail=f"Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})

    token = verify_access_token(token, credentials_exception)

    # super important to put 'int' around token.id when using asyncpg

    query = select(models.Users).where(models.Users.id == int(token.id))
    users = await db.execute(query)
    user = users.first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User was not found")
    # have to use user[0] to access attributes (eg. password) to do things (eg. create battery cell)
    user = user[0]

    return user

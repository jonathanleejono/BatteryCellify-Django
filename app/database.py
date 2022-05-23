from .config import settings
import databases
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlmodel import SQLModel


SQLALCHEMY_DATABASE_URL = f'postgresql+asyncpg://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}'

database = databases.Database(SQLALCHEMY_DATABASE_URL)

engine = create_async_engine(SQLALCHEMY_DATABASE_URL, future=True, echo=True)

AsyncDatabaseSession = sessionmaker(
    engine, expire_on_commit=False, class_=AsyncSession)


async def init_db():
    async with engine.begin() as conn:
        # await conn.run_sync(SQLModel.metadata.drop_all)
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_db():
    async with AsyncDatabaseSession() as session:

        try:
            yield session
        finally:
            await session.close()

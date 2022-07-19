from .config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlmodel import SQLModel
from . import models


DATABASE_URL = settings.database_url.replace(
    "postgres://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL, future=True)

AsyncDatabaseSession = sessionmaker(
    bind=engine, expire_on_commit=False, class_=AsyncSession)


async def init_db():
    async with engine.begin() as conn:
        # await conn.run_sync(models.Base.metadata.drop_all)
        await conn.run_sync(models.Base.metadata.create_all)


async def get_db():
    async with AsyncDatabaseSession() as session:

        try:
            yield session
        finally:
            await session.close()

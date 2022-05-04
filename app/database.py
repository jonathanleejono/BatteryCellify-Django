from .config import settings
import databases


SQLALCHEMY_DATABASE_URL = f'postgresql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}'

database = databases.Database(SQLALCHEMY_DATABASE_URL)

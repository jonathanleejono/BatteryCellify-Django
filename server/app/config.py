from pydantic import BaseSettings
# pydantic reads everything case insensitively


class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    environment: str

    class Config:
        env_file = ".env"


settings = Settings()

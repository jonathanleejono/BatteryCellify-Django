import datetime

import environ
import jwt

env = environ.Env()
environ.Env.read_env()


def generate_tokens(user_id: int) -> dict[str, str]:

    payload = {
        "id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
        "iat": datetime.datetime.utcnow()
    }

    access_token = jwt.encode(payload, env("JWT_ACCESS_SECRET"),
                              algorithm=env("JWT_ALGORITHM"))

    payload["exp"] = datetime.datetime.utcnow() + \
        datetime.timedelta(minutes=60)

    refresh_token = jwt.encode(payload, env("JWT_REFRESH_SECRET"),
                               algorithm=env("JWT_ALGORITHM"))

    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }

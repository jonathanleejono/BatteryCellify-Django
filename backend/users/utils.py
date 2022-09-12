import datetime

import environ
import jwt
from rest_framework.exceptions import AuthenticationFailed

from users.constants import COOKIE_TOKEN
from users.models import User

env = environ.Env()
environ.Env.read_env()


def generate_jwt(user_id: int) -> dict[str, str]:

    payload = {
        "id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
        "iat": datetime.datetime.utcnow()
    }

    access_token = jwt.encode(payload, env("JWT_ACCESS_SECRET"),
                              algorithm=env("JWT_ALGORITHM"))

    return {
        "access_token": access_token
    }


def get_user(request):
    token = request.COOKIES.get(COOKIE_TOKEN)

    if not token:
        raise AuthenticationFailed("Unauthenticated")

    try:
        payload = jwt.decode(
            token, env("JWT_ACCESS_SECRET"), algorithms=env("JWT_ALGORITHM")
        )
    except:
        raise AuthenticationFailed("Unauthenticated, please login again")

    user = User.objects.filter(id=payload["id"]).first()

    if user is None:
        raise AuthenticationFailed("User not found!")

    return user

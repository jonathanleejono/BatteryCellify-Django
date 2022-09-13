import datetime

import jwt
from battery_cellify_django.settings import JWT_ACCESS_SECRET, JWT_ALGORITHM
from rest_framework.exceptions import AuthenticationFailed

from users.constants import COOKIE_TOKEN
from users.models import User
from users.serializers import UserSerializer


def generate_jwt(user_id: int) -> dict[str, str]:
    payload = {
        "id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
        "iat": datetime.datetime.utcnow()
    }

    access_token = jwt.encode(payload, JWT_ACCESS_SECRET,
                              algorithm=JWT_ALGORITHM)

    return {
        "access_token": access_token
    }


def authenticate_user(request):
    token = request.COOKIES.get(COOKIE_TOKEN)

    if not token:
        raise AuthenticationFailed("Please login again")

    try:
        payload = jwt.decode(
            token, JWT_ACCESS_SECRET, algorithms=JWT_ALGORITHM)

    except:
        raise AuthenticationFailed("Unauthenticated, please login again")

    user = User.objects.get(pk=payload["id"])

    if user is None:
        raise AuthenticationFailed("User not found!")

    return user


def authenticate_user_get_id(request):
    user = authenticate_user(request)

    serializer_user = UserSerializer(user)

    return serializer_user.data["id"]

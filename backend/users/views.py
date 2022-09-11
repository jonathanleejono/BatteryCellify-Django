import environ
import jwt
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from users.utils import generate_tokens
from utils.messages import invalid_fields_message

from .models import User
from .serializers import UserSerializer

env = environ.Env()
environ.Env.read_env()

COOKIE_TOKEN = "bcd_id"


valid_register_fields = [key for key in UserSerializer().fields if key != "id"]


class RegisterUser(APIView):
    def post(self, request):

        for key in request.data.keys():
            if key not in valid_register_fields:
                raise ValidationError(
                    invalid_fields_message(valid_register_fields))

        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class LoginUser(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data["password"]

        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed("User not found!")

        if not user.check_password(password):
            raise AuthenticationFailed("Invalid credentials")

        try:
            jwt = generate_tokens(user.id)
        except:
            raise AuthenticationFailed("Error authenticating")

        response = Response()

        response.set_cookie(
            key=COOKIE_TOKEN, value=jwt["refresh_token"], httponly=True)

        response.data = {
            "access_token": jwt["access_token"]
        }

        return response


class GetAuthUser(APIView):
    def get(self, request):
        token = request.COOKIES.get(COOKIE_TOKEN)

        if not token:
            raise AuthenticationFailed("Unauthenticated")

        try:
            payload = jwt.decode(token, env("JWT_SECRET"),
                                 algorithm=env("JWT_ALGORITHM"))
        except:
            raise AuthenticationFailed("Unauthenticated")

        user = User.objects.filter(id=payload["id"]).first()

        serializer = UserSerializer(user)

        return Response(serializer.data)


class Logout(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie(COOKIE_TOKEN)
        response.data = {
            "message": "success"
        }
        return response

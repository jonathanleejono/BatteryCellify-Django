from battery_cellify_django.settings import PY_ENV
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from users.constants import COOKIE_EXPIRY, COOKIE_TOKEN
from users.models import User
from users.serializers import UserSerializer
from users.utils import generate_jwt, get_user
from utils.messages import invalid_fields_message

valid_register_fields = [key for key in UserSerializer().fields if key != "id"]
valid_login_fields = ["email", "password"]
valid_update_profile_fields = ["name", "email"]


class RegisterUser(APIView):
    def post(self, request):

        for key in request.data.keys():
            if key not in valid_register_fields:
                raise ValidationError(
                    invalid_fields_message(valid_register_fields))

        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        try:
            jwt = generate_jwt(serializer.data["id"])
        except:
            raise AuthenticationFailed("Error authenticating")

        response = Response(serializer.data,
                            status=status.HTTP_201_CREATED)

        # ensure samesite is "none" and not None
        response.set_cookie(
            key=COOKIE_TOKEN,
            value=jwt["access_token"],
            httponly=True,
            secure=True if PY_ENV == "production" else False,
            samesite="none" if PY_ENV == "production" else "lax",
            max_age=COOKIE_EXPIRY
        )

        return response


class LoginUser(APIView):
    def post(self, request):
        for key in request.data.keys():
            if key not in valid_login_fields:
                raise ValidationError(
                    invalid_fields_message(valid_login_fields))

        email = request.data["email"]
        password = request.data["password"]

        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed("User not found!")

        if not user.check_password(password):
            raise AuthenticationFailed("Invalid credentials")

        try:
            jwt = generate_jwt(user.id)
        except:
            raise AuthenticationFailed("Error authenticating")

        response = Response()

        # ensure samesite is "none" and not None
        response.set_cookie(
            key=COOKIE_TOKEN,
            value=jwt["access_token"],
            httponly=True,
            secure=True if PY_ENV == "production" else False,
            samesite="none" if PY_ENV == "production" else "lax",
            max_age=COOKIE_EXPIRY
        )

        response.data = {"message": "Login success"}

        return response


class AuthUser(APIView):
    def get(self, request):
        user = get_user(request)

        serializer = UserSerializer(user)

        return Response(serializer.data)

    def patch(self, request):

        for key in request.data.keys():
            if key not in valid_update_profile_fields:
                raise ValidationError(
                    invalid_fields_message(valid_update_profile_fields))

        user = get_user(request)

        # make sure partial=True
        serializer = UserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.update(user, request.data)

        return Response(serializer.data)


class Logout(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie(COOKIE_TOKEN)
        response.data = {"message": "Logout success"}
        return response

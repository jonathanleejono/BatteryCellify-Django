from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.views import APIView

from users.constants import (
    COOKIE_EXPIRY,
    COOKIE_TOKEN,
    valid_login_fields,
    valid_register_fields,
    valid_update_profile_fields,
)
from users.models import User
from users.serializers import UserSerializer
from users.utils import authenticate_user, generate_jwt, get_cookie_settings
from utils.validate import validate_fields


class RegisterUser(APIView):
    throttle_scope = "mutation"

    def post(self, request):
        validate_fields(request.data.keys(), valid_register_fields)

        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        try:
            jwt = generate_jwt(serializer.data["id"])
        except:
            raise AuthenticationFailed("Error authenticating")

        response = Response(serializer.data, status=status.HTTP_201_CREATED)

        secure_setting, samesite_setting = get_cookie_settings(request)

        response.set_cookie(
            key=COOKIE_TOKEN,
            value=jwt["access_token"],
            httponly=True,
            secure=secure_setting,
            samesite=samesite_setting,
            max_age=COOKIE_EXPIRY,
        )
        return response


class LoginUser(APIView):
    throttle_scope = "mutation"

    def post(self, request):
        validate_fields(request.data.keys(), valid_login_fields)

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

        secure_setting = True
        samesite_setting = "none"

        secure_setting, samesite_setting = get_cookie_settings(request)

        response = Response()

        response.set_cookie(
            key=COOKIE_TOKEN,
            value=jwt["access_token"],
            httponly=True,
            secure=secure_setting,
            samesite=samesite_setting,
            max_age=COOKIE_EXPIRY,
        )

        serializer = UserSerializer(user)

        response.data = serializer.data

        return response


class AuthUser(APIView):
    throttle_scope = "mutation"

    def get(self, request):
        user = authenticate_user(request)

        serializer = UserSerializer(user)

        return Response(serializer.data)

    def patch(self, request):
        user = authenticate_user(request)

        validate_fields(request.data.keys(), valid_update_profile_fields)

        # make sure partial=True
        serializer = UserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.update(user, request.data)

        return Response(serializer.data)


class Logout(APIView):
    throttle_scope = "mutation"

    def delete(self, request):

        response = Response()
        response.delete_cookie(COOKIE_TOKEN)
        response.data = {"message": "Logout success"}

        return response

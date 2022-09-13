from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from users.utils import get_user_id

from battery_cells.models import BatteryCell
from battery_cells.serializers import BatteryCellSerializer
from battery_cells.utils import handle_filter
from utils.validate import validate_fields, validate_value

valid_battery_cell_fields = [
    key
    for key in BatteryCellSerializer().fields
    if key != "id" or key != "created_at" or key != "updated_at"
]

valid_filters = [
    "cathode",
    "anode",
    "type",
    "source",
]

valid_query_params = [
    "cell_name_id",
    "sort_by",
    "sort_direction",
    "offset_skip",
    "limit",
] + valid_filters

valid_sort_directions = ["asc", "desc"]


class BatteryCellList(APIView):
    def get(self, request):
        user_id = get_user_id(request)

        query_params = self.request.query_params

        input_query_params = list(query_params.keys())

        validate_fields(input_query_params, valid_query_params)

        filters = {
            k: v for (k, v) in query_params.items() if handle_filter(key=k, value=v)
        }

        sort = "id"

        sort_by = query_params.get("sort_by")

        if sort_by:
            validate_value("sort_by", sort_by, valid_filters)
            sort = sort_by

        sort_direction = query_params.get("sort_direction")

        if sort_direction:
            validate_value("sort_direction", sort_direction, valid_sort_directions)

            if sort_direction == valid_sort_directions[1]:  # desc
                sort = f"-{sort}"

        cell_name_id = query_params.get("cell_name_id")

        if cell_name_id is None:
            cell_name_id = ""

        offset_skip = query_params.get("offset_skip")

        if offset_skip is not None:
            offset_skip = int(offset_skip)

        limit = query_params.get("limit")

        if limit is not None:
            limit = int(limit)

        queryset = BatteryCell.objects.filter(
            owner=user_id, cell_name_id__icontains=cell_name_id, **filters
        ).order_by(f"{sort}")[offset_skip:limit]

        serializer = BatteryCellSerializer(queryset, many=True)

        return Response(serializer.data)


class BatteryCellCreate(APIView):
    def post(self, request):
        user_id = get_user_id(request)

        validate_fields(request.data.keys(), valid_battery_cell_fields)

        request.data["owner"] = user_id

        serializer = BatteryCellSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        response = Response(serializer.data, status=status.HTTP_201_CREATED)

        return response


# edit, get de, stats

# class LoginUser(APIView):
#     def post(self, request):
#         for key in request.data.keys():
#             if key not in valid_login_fields:
#                 raise ValidationError(
#                     invalid_fields_message(valid_login_fields))

#         email = request.data["email"]
#         password = request.data["password"]

#         user = User.objects.filter(email=email).first()

#         if user is None:
#             raise AuthenticationFailed("User not found!")

#         if not user.check_password(password):
#             raise AuthenticationFailed("Invalid credentials")

#         try:
#             jwt = generate_jwt(user.id)
#         except:
#             raise AuthenticationFailed("Error authenticating")

#         response = Response()

#         # ensure samesite is "none" and not None
#         response.set_cookie(
#             key=COOKIE_TOKEN,
#             value=jwt["access_token"],
#             httponly=True,
#             secure=True if PY_ENV == "production" else False,
#             samesite="none" if PY_ENV == "production" else "lax",
#             max_age=COOKIE_EXPIRY
#         )

#         response.data = {"message": "Login success"}

#         return response


# class AuthUser(APIView):
#     def get(self, request):
#         user = authenticate_user(request)

#         serializer = UserSerializer(user)

#         return Response(serializer.data)

#     def patch(self, request):

#         for key in request.data.keys():
#             if key not in valid_update_profile_fields:
#                 raise ValidationError(
#                     invalid_fields_message(valid_update_profile_fields))

#         user = authenticate_user(request)

#         # make sure partial=True
#         serializer = UserSerializer(user, data=request.data, partial=True)
#         serializer.is_valid(raise_exception=True)
#         serializer.update(user, request.data)

#         return Response(serializer.data)


# class Logout(APIView):
#     def post(self, request):
#         response = Response()
#         response.delete_cookie(COOKIE_TOKEN)
#         response.data = {"message": "Logout success"}
#         return response

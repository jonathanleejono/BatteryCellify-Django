from rest_framework import status
from rest_framework.exceptions import (AuthenticationFailed, NotAuthenticated)
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # Update the structure of the response data.
    customized_response = {}
    customized_response['errors'] = []

    # default code gives 403, and is overrided to give 401
    if isinstance(exc, (AuthenticationFailed, NotAuthenticated)):
        response.status_code = status.HTTP_401_UNAUTHORIZED

    if response is not None and type(response.data) == list and len(response.data) == 1:
        error = {'field': "", 'message': response.data[0]}
        customized_response['errors'].append(error)

        response.data = customized_response

        return response

    if response is not None:
        for key, value in response.data.items():
            # keep this at the top
            if "This field" in value[0]:
                value[0] = value[0].replace("This field", key.capitalize())

            if len(value) == 1:
                error = {'field': key, 'message': value[0]}

            elif len(value) != 1:
                error = {'field': key, 'message': value}

            customized_response['errors'].append(error)

        response.data = customized_response

        return response

    if response is None:
        error = {'field': "", 'message': f"Error occurred: {exc}"}
        customized_response['errors'].append(error)

        return Response(customized_response, status=status.HTTP_400_BAD_REQUEST)

    return response

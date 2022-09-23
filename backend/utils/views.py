from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView


class PingRequest(APIView):
    def get(self, request):
        print("request.META['HTTP_HOST']: ", request.META["HTTP_HOST"])
        print("request host: ", request.get_host())
        print("req headers: ", request.headers)
        return Response({"ping": "pong!!!"})


def custom404(request, exception=None):
    return JsonResponse(
        {"errors": [{"field": "", "message": "Request for route not found"}]},
        status=404,
    )


def custom500(request, exception=None):

    return JsonResponse(
        {"errors": [{"field": "", "message": "Server error occurred"}]}, status=500
    )

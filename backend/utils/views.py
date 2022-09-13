from django.http import JsonResponse


def custom404(request, exception=None):
    return JsonResponse({"errors": [{"field": "", "message": 'Page not found'}]}, status=404)


def custom500(request, exception=None):
    return JsonResponse({"errors": [{"field": "", "message": 'Server error occurred'}]}, status=500)

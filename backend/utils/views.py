from django.http import JsonResponse


def custom404(request, exception=None):
    return JsonResponse({"error": 'Page not found'}, status=404)

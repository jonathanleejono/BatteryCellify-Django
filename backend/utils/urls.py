from django.urls import path

from utils.views import PingRequest

urlpatterns = [
    path("ping", PingRequest.as_view()),
]

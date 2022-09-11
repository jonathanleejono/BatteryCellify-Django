from django.contrib import admin
from django.urls import path

from .views import GetAuthUser, LoginUser, Logout, RegisterUser

urlpatterns = [
    path('register', RegisterUser.as_view()),
    path('login', LoginUser.as_view()),
    path('user', GetAuthUser.as_view()),
    path('logout', Logout.as_view()),

]

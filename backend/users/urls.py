from django.urls import path

from users.views import AuthUser, LoginUser, Logout, RegisterUser

urlpatterns = [
    path("register", RegisterUser.as_view()),
    path("login", LoginUser.as_view()),
    path("user", AuthUser.as_view()),
    path("logout", Logout.as_view()),
]

from django.urls import path

from battery_cells.views import BatteryCellCreate, BatteryCellList

urlpatterns = [
    path("list", BatteryCellList.as_view()),
    path("create", BatteryCellCreate.as_view()),
    # path('user', AuthUser.as_view()),
    # path('logout', Logout.as_view()),
]

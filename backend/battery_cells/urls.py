from django.urls import path

from battery_cells.views import (BatteryCellCreate, BatteryCellId,
                                 BatteryCellList, BatteryCellStats)

urlpatterns = [
    path("list", BatteryCellList.as_view()),
    path("create", BatteryCellCreate.as_view()),
    path('<int:pk>', BatteryCellId.as_view()),
    path('stats', BatteryCellStats.as_view()),
]

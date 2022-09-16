from django.urls import path

from csv_data.views import CsvCycleDataView, CsvTimeSeriesDataView

urlpatterns = [
    path("cycle-data/<int:battery_cell_pk>", CsvCycleDataView.as_view()),
    path("time-series-data/<int:battery_cell_pk>", CsvTimeSeriesDataView.as_view()),
]

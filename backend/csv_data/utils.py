from io import StringIO

import pandas as pd
from battery_cells.utils import authorize_battery_cell
from rest_framework.exceptions import ValidationError
from users.utils import get_auth_user_id

from csv_data.models import CsvCycleData, CsvTimeSeriesData
from utils.validate import validate_fields


def get_cycle_data(request, battery_cell_pk):
    user_id = get_auth_user_id(request)

    authorize_battery_cell(battery_cell_pk, user_id)

    return CsvCycleData.objects.filter(
        battery_cell_id=battery_cell_pk, owner_id=user_id
    )


def get_time_series_data(request, battery_cell_pk):
    user_id = get_auth_user_id(request)

    authorize_battery_cell(battery_cell_pk, user_id)

    return CsvTimeSeriesData.objects.filter(
        battery_cell_id=battery_cell_pk, owner_id=user_id
    )


def validate_csv(request):
    csv_file = request.data["file"]

    if not csv_file or csv_file is None:
        raise ValidationError("No file included, please re-upload")

    if not csv_file.name.endswith(".csv"):
        raise ValidationError("File must be .csv")

    return csv_file


def preprocess_dataframe(csv_file, valid_column_headers):
    data_set = csv_file.read().decode("UTF-8")

    data = StringIO(data_set)

    df = pd.read_csv(data)

    validate_fields(list(df.columns), valid_column_headers)

    df = df.fillna(0)

    if "Unnamed: 0" in list(df.columns):
        df = df.drop("Unnamed: 0", 1)

    # cut memory size in half
    for column in df:
        if df[column].dtype == "float64":
            df[column] = pd.to_numeric(df[column], downcast="float")

        if df[column].dtype == "int64":
            df[column] = pd.to_numeric(df[column], downcast="integer")

    return df

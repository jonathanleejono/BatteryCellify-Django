from rest_framework import serializers

from csv_data.models import CsvCycleData, CsvTimeSeriesData


class CsvCycleDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CsvCycleData
        fields = "__all__"
        extra_kwargs = {
            "created_at": {
                "read_only": False,
                "write_only": True,
            },
            "updated_at": {
                "read_only": False,
                "write_only": True,
            },
            "start_time": {
                "write_only": True,
            },
            "end_time": {
                "write_only": True,
            },
        }


class CsvTimeSeriesDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CsvTimeSeriesData
        fields = "__all__"
        extra_kwargs = {
            "created_at": {
                "read_only": False,
                "write_only": True,
            },
            "updated_at": {
                "read_only": False,
                "write_only": True,
            },
            "start_time": {
                "write_only": True,
            },
            "end_time": {
                "write_only": True,
            },
        }

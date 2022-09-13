from rest_framework import serializers

from battery_cells.models import BatteryCell


class BatteryCellSerializer(serializers.ModelSerializer):
    class Meta:
        model = BatteryCell
        fields = "__all__"

from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    # must be here to validate email
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = ["id", "name", "email", "password"]
        extra_kwargs = {
            "password": {"write_only": True, "min_length": 5, "error_messages": {
                "min_length": "Please use a password with at least 6 characters",
            }, }
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    def validate_email(self, value):
        lower_email = value.lower()
        if User.objects.filter(email__iexact=lower_email).exists():
            raise serializers.ValidationError(
                "Please use a different email")
        return lower_email

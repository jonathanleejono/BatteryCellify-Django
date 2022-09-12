from rest_framework import serializers

from users.models import User


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
        current_email = self.__dict__['instance']
        new_email = value.lower()

        # make sure this is casted to str
        if str(current_email).lower() != new_email:
            if User.objects.filter(email__iexact=new_email).exists():
                raise serializers.ValidationError(
                    "Please use a different email")

        return new_email

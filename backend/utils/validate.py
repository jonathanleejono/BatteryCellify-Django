from rest_framework.exceptions import ValidationError


def invalid_fields_message(valid_fields: list[str]) -> str:
    return f"Error, can only input: {valid_fields}".replace("[", "", 1).replace(
        "]", "", 1
    )


def invalid_value_message(key: str, valid_fields: list[str]) -> str:
    return f"Invalid {key}, can only input: {valid_fields}".replace("[", "", 1).replace(
        "]", "", 1
    )


def validate_fields(input_fields: list[str], valid_fields: list[str]):
    for key in input_fields:
        if key not in valid_fields:
            raise ValidationError(invalid_fields_message(valid_fields))
    if len(set(input_fields)) != len(input_fields):
        raise ValidationError(
            f"Error, please only enter one of each field: {valid_fields} "
        )


def validate_value(key: str, value: str, valid_fields: list[str]):
    if value not in valid_fields:
        raise ValidationError(invalid_value_message(key, valid_fields))

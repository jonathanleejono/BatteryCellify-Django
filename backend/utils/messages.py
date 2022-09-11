def invalid_fields_message(valid_fields: list[str]) -> str:
    return f"Error, can only input: {valid_fields}".replace("[", "", 1).replace("]", "", 1)

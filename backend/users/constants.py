from users.serializers import UserSerializer

COOKIE_TOKEN = "bcd_id"
COOKIE_EXPIRY = 1 * 60 * 60  # 60 mins

valid_register_fields = [key for key in UserSerializer().fields if key != "id"]
valid_login_fields = ["email", "password"]
valid_update_profile_fields = ["name", "email"]

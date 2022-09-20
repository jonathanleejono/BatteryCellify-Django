import os


def test_adding_numbers():
    print("Testing if Pytest works")

    sum = 1 + 2
    assert sum == 3


def test_setup_env(set_env):
    print("Testing if env variables are set")

    assert os.environ.get("TESTING") == "yes"

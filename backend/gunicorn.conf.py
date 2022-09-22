workers = 1

# Access log - records incoming HTTP requests
accesslog = (
    # the "gunicorn-access.log" is a file that is generated
    # optionally can use a folder like logs/gunicorn-access.log
    "gunicorn-access.log"
)

# Whether to send Django output to the error log
capture_output = True

# How verbose the Gunicorn error logs should be
loglevel = "info"

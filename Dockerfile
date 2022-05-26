FROM python:3.9.7

WORKDIR /usr/src/app

# optimization step
COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

# copy all our code into the current WORKDIR
# if we make changes to our source code, we don't have to RUN pip install every time
COPY . . 

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
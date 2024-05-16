FROM python:3.11

WORKDIR /home/api

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY . ./

# Runs 'entrypoint.sh' script.
# https://stackoverflow.com/a/50276037/10521456
RUN sed -i 's/\r//' ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

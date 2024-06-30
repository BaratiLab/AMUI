FROM python:3.11

WORKDIR /home/api

COPY requirements.txt ./

RUN pip install -r requirements.txt
RUN apt update
RUN apt install -y locales prusa-slicer libcanberra-gtk-module libcanberra-gtk3-module

# Sets locales for prusa-slicer
# https://stackoverflow.com/a/28406007/10521456
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen
ENV LANG en_US.UTF-8  
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

COPY . ./

# Runs 'entrypoint.sh' script.
# https://stackoverflow.com/a/50276037/10521456
RUN sed -i 's/\r//' ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

FROM python:3.11

WORKDIR /home/api

COPY requirements.txt ./

ARG DJANGO_HOST

RUN apt update
RUN apt install -y locales \
# PyVista
  libgl1-mesa-glx xvfb \
# Slicing
  prusa-slicer libcanberra-gtk-module libcanberra-gtk3-module
# SSL Certification
  # mkcert

# RUN mkcert -cert-file cert.pem -key-file key.pem ${DJANGO_HOST} 0.0.0.0

# Sets locales for prusa-slicer
# https://stackoverflow.com/a/28406007/10521456
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen
ENV LANG en_US.UTF-8  
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

RUN pip install -r requirements.txt

COPY . ./

# Runs 'entrypoint.sh' script.
# https://stackoverflow.com/a/50276037/10521456
RUN sed -i 's/\r//' ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

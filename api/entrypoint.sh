#!/bin/bash

# Wait for PostgreSQL service to fully start.
sleep 10s

python manage.py migrate --noinput
python manage.py createsuperuser --noinput \
  --username $DJANGO_SUPERUSER_USERNAME \
  --email $DJANGO_SUPERUSER_EMAIL

# Seed melt pool data.
python manage.py loaddata melt_pool/fixture/records.json

python manage.py runserver 0.0.0.0:8000

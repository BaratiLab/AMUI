#!/bin/bash

# Function to wait for PostgreSQL to be ready
# wait_for_postgres() {
#     echo "Waiting for PostgreSQL to start..."
#     while ! pg_isready -h sql -p 5432 > /dev/null 2> /dev/null; do
#         echo "PostgreSQL is unavailable - waiting"
#         sleep 2
#     done
#     echo "PostgreSQL is up!"
# }

# # Wait for PostgreSQL service to fully start
# wait_for_postgres
# Wait for PostgreSQL service to fully start.
sleep 10s

# Run database migrations
echo "Running database migrations..."
python manage.py migrate --noinput

# Create superuser if it doesn't exist
echo "Creating superuser if not exists..."
# python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); \
# if not User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists(): \
#     User.objects.create_superuser('$DJANGO_SUPERUSER_USERNAME', '$DJANGO_SUPERUSER_EMAIL', 'password'); \
# else: \
#     print('Superuser already exists');"
python manage.py createsuperuser --noinput \
  --username $DJANGO_SUPERUSER_USERNAME \
  --email $DJANGO_SUPERUSER_EMAIL

# Seed melt pool data, check if fixtures exist first
echo "Seeding data..."
python manage.py loaddata melt_pool/fixture/records.json || echo "Records already loaded or error occurred."
python manage.py loaddata machine/fixture/machine.json || echo "Machine already loaded or error occurred."
python manage.py loaddata material/fixture/material.json || echo "Material already loaded or error occurred."

# For production, use Gunicorn instead of runserver
# echo "Starting Django using Gunicorn..."
# exec gunicorn api.wsgi:application --bind 0.0.0.0:8000 --workers 3

python manage.py runserver 0.0.0.0:8000

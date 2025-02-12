#!/bin/bash

# Wait for Redis service to start.
# sleep 10s
echo "Starting Worker..."
. venv/bin/activate
exec celery -A worker.worker worker --loglevel=info
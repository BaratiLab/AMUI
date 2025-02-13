#!/bin/bash

# Wait for Redis service to start.
# sleep 10s
echo "Starting Worker..."
. venv/bin/activate
cd worker 
exec celery -A app worker --loglevel=info
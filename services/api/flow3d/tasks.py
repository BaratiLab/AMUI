# Create your tasks here

from celery import shared_task

@shared_task
def add(x, y):
    return None

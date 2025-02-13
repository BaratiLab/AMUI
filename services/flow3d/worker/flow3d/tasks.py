from celery import shared_task

@shared_task
def long_running_task(data):
    import time
    time.sleep(10)
    return f"Processed {data}"

@shared_task
def add(x, y):
    print(x, y)
    return f"Processed {x + y}"
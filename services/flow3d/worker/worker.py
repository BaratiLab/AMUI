from celery import Celery

app = Celery('tasks', broker='redis://redis:6379/0')

@app.task
def long_running_task(data):
    import time
    time.sleep(10)
    return f"Processed {data}"

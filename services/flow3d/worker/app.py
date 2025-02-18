from celery import Celery

app = Celery('app', broker='redis://redis:6379/0')

app.conf.task_track_started = True
app.conf.task_ignore_result = False

# Needed to discover tasks
import flow3d

if __name__ == "__main__":
    app.start()

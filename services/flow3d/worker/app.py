from celery import Celery

app = Celery('app', broker='redis://redis:6379/0')

# Needed to discover tasks
import flow3d

if __name__ == "__main__":
    app.start()

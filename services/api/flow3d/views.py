from django.shortcuts import render

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

# from flow3d.tasks import add
from api.celery import app

import time

class Flow3DTestTask(APIView):

    permission_classes = (AllowAny,)

    def post(self, request):
        print(request.data)
        x = request.data.get("x")
        y = request.data.get("y")
        # add.delay(x, y)
        task = app.send_task('flow3d.tasks.add', args=[x, y])
        return Response({"task_id": task.id }, status=status.HTTP_201_CREATED)

    def get(self, request, task_id):
        task_result = app.AsyncResult(task_id)
        result = task_result.result
        status = task_result.status
        print(result, status)
        return Response({"task_id": task_id, "status": status, "result": result})

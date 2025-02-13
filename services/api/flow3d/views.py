from django.shortcuts import render

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

# from flow3d.tasks import add
from api.celery import app

class Flow3DTestTask(APIView):

    permission_classes = (AllowAny,)

    def post(self, request):
        print(request.data)
        x = request.data.get("x")
        y = request.data.get("y")
        # add.delay(x, y)
        app.send_task('flow3d.tasks.add', args=[x, y])
        return Response({"message": "task is processing"}, status=status.HTTP_201_CREATED)
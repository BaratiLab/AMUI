from django.db import models


# Create your models here.
class UploadedFile(models.Model):
    file = models.FileField(upload_to="uploads/")
    uploaded_at = models.DateTimeField(auto_now_add=True)


class Example(models.Model):
    """
    Example shapes to utilize for slicer api.
    """

    name = models.CharField(max_length=100)
    file = models.FileField()

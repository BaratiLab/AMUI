from django.db import models
from auth0.models import Auth0User

class Part(models.Model):
    created_by = models.ForeignKey(Auth0User, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100, blank=True, default="")
    file = models.FileField(upload_to="uploads/")

    class Meta:
        ordering = ["created_on", "updated_on"]

from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class Auth0User(AbstractUser):
  auth0_id = models.CharField(max_length=255, unique=True, default=uuid.uuid4)

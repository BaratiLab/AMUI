from rest_framework import serializers
from build_profile.models import build_profile

class BuildProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model = BuildProfile
    fields = "__all__"
    extra_kwargs = {'created_by': {'required': False}}
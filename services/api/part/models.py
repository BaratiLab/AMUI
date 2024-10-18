import pyvista as pv
import io

pv.start_xvfb()

from django.db import models
from django.core.files.base import ContentFile
from auth0.models import Auth0User

class PartFile(models.Model):
    created_by = models.ForeignKey(Auth0User, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to="uploads/part_file", blank=True, null=True)
    thumbnail = models.FileField(upload_to="uploads/part_file", blank=True, null=True)

    class Meta:
        ordering = ["created_on", "updated_on"]

    def generate_thumbnail(self):
        """Generates a thumbnail for the uploaded STL file with isometric view."""
        mesh = pv.read(self.file.path)

        # Render the STL file
        plotter = pv.Plotter(off_screen=True, window_size=(512, 512))
        plotter.add_mesh(mesh, show_edges=False)

        # Set orthographic projection
        plotter.camera.parallel_projection = True

        # Set the camera to isometric view
        plotter.view_isometric()
        plotter.camera.zoom(1)  # Adjust zoom if needed

        # Save the screenshot to an in-memory buffer
        screenshot_buffer = io.BytesIO()
        plotter.screenshot(screenshot_buffer, transparent_background=True)
        screenshot_buffer.seek(0)  # Reset buffer position

        # Convert the screenshot buffer to a Django-compatible file
        image_content = ContentFile(screenshot_buffer.read())
        filename = self.file.name.split('/')[-1].split(".")[0]
        thumbnail_name = f"{filename}_thumbnail.png"

        # Save the thumbnail to the field
        self.thumbnail.save(thumbnail_name, image_content, save=False)


    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # Save the object to get the file path

        # Generate thumbnail if an STL file is uploaded
        if self.file and self.file.name.endswith(".stl"):
            self.generate_thumbnail()
            super().save(update_fields=["thumbnail"])  # Save again with the thumbnail

class Part(models.Model):
    created_by = models.ForeignKey(Auth0User, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100, blank=True, default="")

    # The currently active part file (optional, but unique to the part)
    part_file = models.ForeignKey(
        "PartFile", on_delete=models.SET_NULL, blank=True, null=True, related_name="active_parts"
    )
    
    # A collection of part files (many-to-many relationship)
    part_files = models.ManyToManyField("PartFile", related_name="parts", blank=True)

    class Meta:
        ordering = ["created_on", "updated_on"]

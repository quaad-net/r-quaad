from django.db import models
from django.urls import reverse # Used to generate URLs by reversing the URL patterns

class Category(models.Model):
    """Model representing a sql column"""
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text=""
    )

    def __str__(self):
        """String for representing the Model object."""
        return self.name

    def get_absolute_url(self):
        """Returns the url to access a particular genre instance."""
        return reverse('category-detail', args=[str(self.id)])

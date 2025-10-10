from django.db import models

# We'll use your XML class directly, but here's a Django model for reference
class Receta(models.Model):
    nombre = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'recetas'
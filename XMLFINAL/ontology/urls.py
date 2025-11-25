from django.urls import path
from . import views

app_name = 'ontology'

urlpatterns = [
    path('', views.index, name='index'),
    path('recipe/<str:recipe_name>/', views.get_recipe, name='get_recipe'),
]

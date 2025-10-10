from django.urls import path
from . import views

app_name = 'editor'

urlpatterns = [
    path('', views.index, name='index'),
    path('editor/<str:recipe_name>/', views.get_recipe, name='get_recipe'),
]
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .utils import Recetario
import json

def index(request):
    recetario = Recetario()
    editing_recipe = None
    
    if request.method == 'POST':
        action = request.POST.get('action')
        
        try:
            if action == 'add' or action == 'modify':
                # Parse form data into recipe structure
                new_recipe = {
                    'nombre': request.POST.get('nombre'),
                    'ingredientes': [],
                    'procedimiento': [],
                    'detalles': {}
                }
                
                # Process ingredients
                ingredientes_nombres = request.POST.getlist('ingrediente_nombre[]')
                ingredientes_cantidades = request.POST.getlist('ingrediente_cantidad[]')
                ingredientes_unidades = request.POST.getlist('ingrediente_unidad[]')
                
                for i in range(len(ingredientes_nombres)):
                    if ingredientes_nombres[i].strip():
                        new_recipe['ingredientes'].append({
                            'nombre': ingredientes_nombres[i],
                            'cantidad': ingredientes_cantidades[i],
                            'unidad': ingredientes_unidades[i]
                        })
                
                # Process procedure steps
                pasos = request.POST.getlist('paso[]')
                for paso in pasos:
                    if paso.strip():
                        new_recipe['procedimiento'].append(paso)
                
                # Process details
                if request.POST.get('duracion'):
                    new_recipe['detalles']['duracion'] = request.POST.get('duracion')
                
                if request.POST.get('porciones_cantidad'):
                    new_recipe['detalles']['porciones'] = {
                        'cantidad': request.POST.get('porciones_cantidad'),
                        'unidad': request.POST.get('porciones_unidad', '')
                    }
                
                if action == 'modify':
                    nombre_original = request.POST.get('nombre_original')
                    recetario.modify_receta(nombre_original, new_recipe)
                else:  # add
                    recetario.add_receta(new_recipe)
                
                recetario.save()
                
            elif action == 'delete':
                nombre = request.POST.get('nombre')
                recetario.delete_receta(nombre)
                recetario.save()
                
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
        
        return redirect('editor:index')
    
    # GET request - show all recipes
    recipes_dict = recetario.extract_recipes_to_dict()
    
    # Check if we're editing a specific recipe
    edit_recipe_name = request.GET.get('edit')
    if edit_recipe_name and edit_recipe_name in recipes_dict:
        editing_recipe = {
            'nombre': edit_recipe_name,
            **recipes_dict[edit_recipe_name]
        }
    
    return render(request, 'editor/index.html', {
        'recipes': recipes_dict,
        'editing_recipe': editing_recipe
    })

def get_recipe(request, recipe_name):
    recetario = Recetario()
    recipes_dict = recetario.extract_recipes_to_dict()
    
    if recipe_name in recipes_dict:
        return JsonResponse({
            'success': True,
            'recipe': recipes_dict[recipe_name]
        })
    else:
        return JsonResponse({'success': False, 'error': 'Receta no encontrada'})
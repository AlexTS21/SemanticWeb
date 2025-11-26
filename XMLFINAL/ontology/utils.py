from rdflib import Graph, Namespace, RDF, RDFS, XSD, Literal
from rdflib.plugins.stores.sparqlstore import SPARQLUpdateStore
import os

# Configuración de namespaces
RECETARIO = Namespace("http://www.semanticweb.org/recetario#")
OWL = Namespace("http://www.w3.org/2002/07/owl#")
RDFS = Namespace("http://www.w3.org/2000/01/rdf-schema#")

class RecetarioManager:
    def __init__(self):
        self.graph = Graph()
        self.graph.bind("rec", RECETARIO)
        self.graph.bind("owl", OWL)
        self.graph.bind("rdfs", RDFS)
        
        # Cargar la ontología existente
        ontology_path = "recetas.ttl"  
        if os.path.exists(ontology_path):
            self.graph.parse(ontology_path, format="turtle")
            print("SE CARGO LA ONTOLOGIA")
        else:
            print("PROBLEMAS AL ABRIR LA ONTOLOGIA")
    
    def save_ontology(self):
        """Guarda la ontología en archivo"""
        self.graph.serialize(destination="recetas.ttl", format="turtle")
    
    def extract_recipes_to_dict(self):
        """Extrae todas las recetas a un diccionario para la vista"""
        recipes_dict = {}
        
        # Consultar todas las recetas
        query = """
        PREFIX rec: <http://www.semanticweb.org/recetario#>
        SELECT ?recipe ?name ?duration ?difficulty
        WHERE {
            ?recipe a rec:Receta ;
                   rec:nombre ?name .
            OPTIONAL { ?recipe rec:duracionMinutos ?duration . }
            OPTIONAL { ?recipe rec:dificultad ?difficulty . }
        }
        """
        
        results = self.graph.query(query)
        
        for row in results:
            recipe_uri = row.recipe
            recipe_name = str(row.name)
            
            # Obtener ingredientes
            ingredients = self._get_recipe_ingredients(recipe_uri)
            
            # Obtener pasos del procedimiento
            procedure = self._get_recipe_procedure(recipe_uri)
            
            # Obtener utensilios
            utensils = self._get_recipe_utensils(recipe_uri)
            
            # Construir diccionario de receta
            recipes_dict[recipe_name] = {
                'ingredientes': ingredients,
                'procedimiento': procedure,
                'utensilios': utensils,  # NUEVO: agregar utensilios
                'detalles': {
                    'duracion': str(row.duration) if row.duration else None,
                    'dificultad': str(row.difficulty) if row.difficulty else None
                }
            }
        
        return recipes_dict
    
    def _get_recipe_ingredients(self, recipe_uri):
        """Obtiene los ingredientes de una receta específica"""
        query = """
        PREFIX rec: <http://www.semanticweb.org/recetario#>
        SELECT ?ingName ?cantidad ?unidad
        WHERE {
            ?recipe rec:tieneIngrediente ?ingReceta .
            ?ingReceta rec:usaIngrediente ?ingrediente ;
                      rec:cantidad ?cantidad ;
                      rec:tieneUnidadMedida ?unidadMedida .
            ?ingrediente rdfs:label ?ingName .
            ?unidadMedida rdfs:label ?unidad .
        }
        """
        
        results = self.graph.query(query, initBindings={'recipe': recipe_uri})
        ingredients = []
        
        for row in results:
            ingredients.append({
                'nombre': str(row.ingName),
                'cantidad': str(row.cantidad),
                'unidad': str(row.unidad)
            })
        
        return ingredients
    
    def _get_recipe_procedure(self, recipe_uri):
        """Obtiene los pasos del procedimiento de una receta"""
        query = """
        PREFIX rec: <http://www.semanticweb.org/recetario#>
        SELECT ?descripcion
        WHERE {
            ?recipe rec:tienePaso ?paso .
            ?paso rec:descripcion ?descripcion ;
                  rec:numeroPaso ?numero .
        }
        ORDER BY ?numero
        """
        
        results = self.graph.query(query, initBindings={'recipe': recipe_uri})
        procedure = [str(row.descripcion) for row in results]
        
        return procedure
    
    def _get_recipe_utensils(self, recipe_uri):
        """Obtiene los utensilios de una receta específica"""
        query = """
        PREFIX rec: <http://www.semanticweb.org/recetario#>
        SELECT ?utensilName
        WHERE {
            ?recipe rec:usaUtensilio ?utensilio .
            ?utensilio rdfs:label ?utensilName .
        }
        """
        
        results = self.graph.query(query, initBindings={'recipe': recipe_uri})
        utensils = [str(row.utensilName) for row in results]
        
        return utensils
    
    def add_recipe(self, recipe_data):
        """Agrega una nueva receta a la ontología"""
        recipe_name = recipe_data['nombre']
        recipe_uri = RECETARIO[recipe_name.lower().replace(' ', '_')]
        
        # Agregar la receta
        self.graph.add((recipe_uri, RDF.type, RECETARIO.Receta))
        self.graph.add((recipe_uri, RECETARIO.nombre, Literal(recipe_name)))
        
        # Agregar duración si existe
     
        duration = int(recipe_data['duracion'])
        self.graph.add((recipe_uri, RECETARIO.duracionMinutos, Literal(duration)))
         
        
        # Agregar dificultad
        difficulty = recipe_data.get('dificultad', 'Fácil')
        self.graph.add((recipe_uri, RECETARIO.dificultad, Literal(difficulty)))
        
        # Agregar ingredientes
        for i, ingrediente in enumerate(recipe_data['ingredientes']):
            ing_uri = RECETARIO[f"ing_{recipe_name.lower().replace(' ', '_')}_{i}"]
            
            # Crear instancia de IngredientePorReceta
            self.graph.add((ing_uri, RDF.type, RECETARIO.IngredientePorReceta))
            self.graph.add((ing_uri, RECETARIO.cantidad, Literal(float(ingrediente['cantidad']))))
            
            # Buscar o crear unidad de medida
            unidad_uri = self._get_or_create_unit(ingrediente['unidad'])
            self.graph.add((ing_uri, RECETARIO.tieneUnidadMedida, unidad_uri))
            
            # Buscar o crear ingrediente
            ingrediente_uri = self._get_or_create_ingredient(ingrediente['nombre'])
            self.graph.add((ing_uri, RECETARIO.usaIngrediente, ingrediente_uri))
            
            # Conectar ingrediente con la receta
            self.graph.add((recipe_uri, RECETARIO.tieneIngrediente, ing_uri))
        
        # Agregar pasos del procedimiento
        for i, paso_text in enumerate(recipe_data['procedimiento']):
            paso_uri = RECETARIO[f"paso_{recipe_name.lower().replace(' ', '_')}_{i}"]
            
            self.graph.add((paso_uri, RDF.type, RECETARIO.Paso))
            self.graph.add((paso_uri, RECETARIO.numeroPaso, Literal(i + 1)))
            self.graph.add((paso_uri, RECETARIO.descripcion, Literal(paso_text)))
            
            # Conectar paso con la receta
            self.graph.add((recipe_uri, RECETARIO.tienePaso, paso_uri))
        
        #  Agregar utensilios
        for utensilio_name in recipe_data.get('utensilios', []):
            utensilio_uri = self._get_or_create_utensil(utensilio_name)
            self.graph.add((recipe_uri, RECETARIO.usaUtensilio, utensilio_uri))
    
    def _get_or_create_unit(self, unit_name):
        """Obtiene o crea una unidad de medida"""
        unit_uri = RECETARIO[unit_name.lower()]
        
        if not (unit_uri, RDF.type, RECETARIO.UnidadMedida) in self.graph:
            self.graph.add((unit_uri, RDF.type, RECETARIO.UnidadMedida))
            self.graph.add((unit_uri, RDFS.label, Literal(unit_name)))
        
        return unit_uri
    
    def _get_or_create_ingredient(self, ingredient_name):
        """Obtiene o crea un ingrediente"""
        ing_uri = RECETARIO[ingredient_name.lower().replace(' ', '_')]
        
        if not (ing_uri, RDF.type, RECETARIO.Ingrediente) in self.graph:
            self.graph.add((ing_uri, RDF.type, RECETARIO.Ingrediente))
            self.graph.add((ing_uri, RDFS.label, Literal(ingredient_name)))
        
        return ing_uri
    
    def _get_or_create_utensil(self, utensil_name):
        """Obtiene o crea un utensilio"""
        utensil_uri = RECETARIO[utensil_name.lower().replace(' ', '')]
        
        if not (utensil_uri, RDF.type, RECETARIO.Utensilio) in self.graph:
            self.graph.add((utensil_uri, RDF.type, RECETARIO.Utensilio))
            self.graph.add((utensil_uri, RDFS.label, Literal(utensil_name)))
        
        return utensil_uri
    
    def modify_recipe(self, original_name, new_recipe_data):
        """Modifica una receta existente"""
        # Primero eliminar la receta original
        self.delete_recipe(original_name)
        # Luego agregar la nueva versión
        self.add_recipe(new_recipe_data)
    
    def delete_recipe(self, recipe_name):
        """Elimina una receta de la ontología"""
        recipe_uri = RECETARIO[recipe_name.lower().replace(' ', '_')]
        
        # Consulta SPARQL para eliminar toda la información relacionada con la receta
        delete_query = """
        PREFIX rec: <http://www.semanticweb.org/recetario#>
        DELETE {
            ?recipe ?p ?o .
            ?ingReceta ?ip ?io .
            ?paso ?pp ?po .
            ?recipe rec:usaUtensilio ?utensilio .
        }
        WHERE {
            ?recipe rec:nombre "%s" .
            ?recipe ?p ?o .
            OPTIONAL {
                ?recipe rec:tieneIngrediente ?ingReceta .
                ?ingReceta ?ip ?io .
            }
            OPTIONAL {
                ?recipe rec:tienePaso ?paso .
                ?paso ?pp ?po .
            }
            OPTIONAL {
                ?recipe rec:usaUtensilio ?utensilio .
            }
        }
        """ % recipe_name
        
        try:
            self.graph.update(delete_query)
        except:
            # Fallback: eliminar triples manualmente
            for s, p, o in self.graph.triples((recipe_uri, None, None)):
                self.graph.remove((s, p, o))
            
            # Eliminar ingredientes relacionados
            for ing in self.graph.subjects(RECETARIO.tieneIngrediente, recipe_uri):
                for si, pi, oi in self.graph.triples((ing, None, None)):
                    self.graph.remove((si, pi, oi))
            
            # Eliminar pasos relacionados
            for paso in self.graph.subjects(RECETARIO.tienePaso, recipe_uri):
                for sp, pp, op in self.graph.triples((paso, None, None)):
                    self.graph.remove((sp, pp, op))
            
            # Eliminar relaciones con utensilios
            for utensilio in self.graph.objects(recipe_uri, RECETARIO.usaUtensilio):
                self.graph.remove((recipe_uri, RECETARIO.usaUtensilio, utensilio))
from lxml import etree
import os
from django.conf import settings

class Recetario:
    def __init__(self, path=None):
        if path is None:
            # Path to use file in djagno project
            path = os.path.join(settings.BASE_DIR, 'xml_files', 'recetario.xml')
        self.path = path
        self.tree = etree.parse(path)
        self.root = self.tree.getroot()

    def extract_recipes_to_dict(self):
        recipes_dict = {}
        for recipe in self.root.xpath("//receta"):
            recipe_name = recipe.get('nombre')
            
            # Ingredients
            ingredients = []
            ingredientes_node = recipe.find('ingredientes')
            if ingredientes_node is not None:
                for ingrediente in ingredientes_node.findall('ingrediente'):
                    ingredients.append({
                        'nombre': ingrediente.text.strip() if ingrediente.text else '',
                        'cantidad': ingrediente.get('cantidad', ''),
                        'unidad': ingrediente.get('unidad', '')
                    })

            # Procedure
            procedure = []
            procedimiento_node = recipe.find('procedimiento')
            if procedimiento_node is not None:
                for paso in procedimiento_node.findall('paso'):
                    if paso.text:
                        procedure.append(paso.text.strip())

            # Details
            details = {}
            detalles_node = recipe.find('detalles')
            if detalles_node is not None:
                duracion = detalles_node.find('duracion')
                if duracion is not None and duracion.text:
                    details['duracion'] = duracion.text.strip()
                porciones = detalles_node.find('porciones')
                if porciones is not None:
                    details['porciones'] = {
                        'cantidad': porciones.text.strip() if porciones.text else '',
                        'unidad': porciones.get('unidad', '')
                    }

            recipes_dict[recipe_name] = {
                'ingredientes': ingredients,
                'procedimiento': procedure,
                'detalles': details
            }
        return recipes_dict

    def add_receta(self, data):
        # Verify if already exists
        if self.root.xpath(f"//receta[@nombre='{data['nombre']}']"):
            raise ValueError(f"La receta '{data['nombre']}' ya existe.")

        receta_el = etree.SubElement(self.root, "receta", nombre=data['nombre'])
        
        # Ingredients
        ing_el = etree.SubElement(receta_el, "ingredientes")
        for ing in data.get('ingredientes', []):
            ingrediente_el = etree.SubElement(
                ing_el, "ingrediente",
                cantidad=str(ing.get('cantidad', '')),
                unidad=str(ing.get('unidad', ''))
            )
            ingrediente_el.text = ing.get('nombre', '')

        # Procedure
        proc_el = etree.SubElement(receta_el, "procedimiento")
        for paso in data.get('procedimiento', []):
            paso_el = etree.SubElement(proc_el, "paso")
            paso_el.text = paso

        # Details
        det_el = etree.SubElement(receta_el, "detalles")
        if 'duracion' in data.get('detalles', {}):
            duracion_el = etree.SubElement(det_el, "duracion")
            duracion_el.text = data['detalles']['duracion']
        if 'porciones' in data.get('detalles', {}):
            por = data['detalles']['porciones']
            por_el = etree.SubElement(det_el, "porciones", unidad=por.get('unidad', ''))
            por_el.text = str(por.get('cantidad', ''))

    def delete_receta(self, nombre):
        receta = self.root.xpath(f"//receta[@nombre='{nombre}']")
        if not receta:
            raise ValueError(f"No se encontró la receta '{nombre}'.")
        self.root.remove(receta[0])

    def modify_receta(self, nombre, new_data):
        receta = self.root.xpath(f"//receta[@nombre='{nombre}']")
        if not receta:
            raise ValueError(f"No se encontró la receta '{nombre}' para modificar.")

        self.delete_receta(nombre)
        self.add_receta(new_data)

    def save(self, path=None):
        if path is None:
            path = self.path
        self.tree.write(path, pretty_print=True, xml_declaration=True, encoding="UTF-8")
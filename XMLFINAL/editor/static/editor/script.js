 // Dynamic form elements
function addIngredient() {
    const container = document.getElementById('ingredients-container');
    const newRow = document.createElement('div');
    newRow.className = 'ingredient-row';
    newRow.innerHTML = `
        <input type="text" name="ingrediente_nombre[]" placeholder="Nombre" class="form-control">
        <input type="text" name="ingrediente_cantidad[]" placeholder="Cantidad" class="form-control">
        <select name="ingrediente_unidad[]" class="form-control">
            <option value="ml">ml</option>
            <option value="gr">gr</option>
            <option value="unidad">unidad</option>
        </select>
        <button type="button" class="btn-remove" onclick="removeIngredient(this)"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(newRow);
}

function removeIngredient(button) {
    if (document.querySelectorAll('.ingredient-row').length > 1) {
        button.parentElement.remove();
    }
}

function addStep() {
    const container = document.getElementById('steps-container');
    const newRow = document.createElement('div');
    newRow.className = 'step-row';
    newRow.innerHTML = `
        <textarea name="paso[]" placeholder="Paso a paso..." class="form-control"></textarea>
        <button type="button" class="btn-remove" onclick="removeStep(this)"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(newRow);
}

function removeStep(button) {
    if (document.querySelectorAll('.step-row').length > 1) {
        button.parentElement.remove();
    }
}

// Clear form function
function clearForm() {
    if (confirm('¿Está seguro de que desea limpiar el formulario? Se perderán todos los datos no guardados.')) {
        document.getElementById('recipe-form').reset();
        
        // Clear dynamic fields but keep one of each
        const ingredientsContainer = document.getElementById('ingredients-container');
        const stepsContainer = document.getElementById('steps-container');
        
        // Keep only first ingredient row
        while (ingredientsContainer.children.length > 1) {
            ingredientsContainer.removeChild(ingredientsContainer.lastChild);
        }
        
        // Keep only first step row
        while (stepsContainer.children.length > 1) {
            stepsContainer.removeChild(stepsContainer.lastChild);
        }
        
        // Clear the first rows
        const firstIngredient = ingredientsContainer.querySelector('.ingredient-row');
        firstIngredient.querySelectorAll('input').forEach(input => input.value = '');
        firstIngredient.querySelector('select').selectedIndex = 0;
        
        const firstStep = stepsContainer.querySelector('.step-row');
        firstStep.querySelector('textarea').value = '';
        
        // Reset hidden fields for new recipe
        document.querySelector('input[name="action"]').value = 'add';
        const nombreOriginal = document.querySelector('input[name="nombre_original"]');
        if (nombreOriginal) {
            nombreOriginal.remove();
        }
        
        // Update form title
        document.getElementById('form-title').innerHTML = '<i class="fas fa-plus-circle"></i> Agregar Nueva Receta';
        const submitButton = document.querySelector('.btn-primary');
        const icon = submitButton.querySelector('i');
        icon.nextSibling.textContent = ' Guardar Receta';
    }
}

// Auto-focus on recipe name when editing
document.addEventListener('DOMContentLoaded', function() {
    const editingRecipeName = document.getElementById('editing-recipe-name');
    if (editingRecipeName) {
        editingRecipeName.focus();
    }
});

// Confirm before leaving if form has changes
let formInitialState = '';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('recipe-form');
    formInitialState = serializeForm(form);
    
    form.addEventListener('change', function() {
        window.onbeforeunload = function() {
            const currentState = serializeForm(form);
            if (currentState !== formInitialState) {
                return 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
            }
        };
    });
    
    form.addEventListener('submit', function() {
        window.onbeforeunload = null;
    });
});

function serializeForm(form) {
    return new FormData(form).toString();
}
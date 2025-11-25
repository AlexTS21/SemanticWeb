// Dynamic form elements
function addIngredient() {
    const container = document.getElementById('ingredients-container');
    const newRow = document.createElement('div');
    newRow.className = 'ingredient-row';
    newRow.innerHTML = `
        <input type="text" name="ingrediente_nombre[]" placeholder="Nombre del ingrediente" class="form-control" required>
        <input type="number" name="ingrediente_cantidad[]" placeholder="Cantidad" class="form-control" step="0.1" min="0" required>
        <select name="ingrediente_unidad[]" class="form-control" required>
            <option value="gramo">gramo</option>
            <option value="kilogramo">kilogramo</option>
            <option value="litro">litro</option>
            <option value="mililitro">mililitro</option>
            <option value="cucharada">cucharada</option>
            <option value="cucharadita">cucharadita</option>
            <option value="taza">taza</option>
            <option value="unidad">unidad</option>
            <option value="rebanada">rebanada</option>
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
        <textarea name="paso[]" placeholder="Descripción del paso..." class="form-control" required></textarea>
        <button type="button" class="btn-remove" onclick="removeStep(this)"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(newRow);
}

function removeStep(button) {
    if (document.querySelectorAll('.step-row').length > 1) {
        button.parentElement.remove();
    }
}

function addUtensil() {
    const container = document.getElementById('utensils-container');
    const newRow = document.createElement('div');
    newRow.className = 'utensil-row';
    newRow.innerHTML = `
        <select name="utensilio[]" class="form-control" required>
            <option value="">Seleccione un utensilio</option>
            <option value="sartén">Sartén</option>
            <option value="cuchillo">Cuchillo</option>
            <option value="tabla de cortar">Tabla de cortar</option>
            <option value="batidora">Batidora</option>
            <option value="bol">Bol</option>
            <option value="espátula">Espátula</option>
            <option value="tostadora">Tostadora</option>
            <option value="plato">Plato</option>
            <option value="olla">Olla</option>
            <option value="cuchara">Cuchara</option>
            <option value="tenedor">Tenedor</option>
        </select>
        <button type="button" class="btn-remove" onclick="removeUtensil(this)"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(newRow);
}

function removeUtensil(button) {
    // No permitir eliminar si solo queda un utensilio
    if (document.querySelectorAll('.utensil-row').length > 1) {
        button.parentElement.remove();
    } else {
        alert('Debe tener al menos un utensilio seleccionado');
    }
}

// Validación personalizada para utensilios
function validateUtensils() {
    const utensilSelects = document.querySelectorAll('select[name="utensilio[]"]');
    let hasValidUtensil = false;
    
    utensilSelects.forEach(select => {
        if (select.value !== '') {
            hasValidUtensil = true;
        }
    });
    
    if (!hasValidUtensil) {
        alert('Por favor, seleccione al menos un utensilio');
        return false;
    }
    return true;
}

// Validación general del formulario
function validateForm() {
    // Validar nombre de receta
    const recipeName = document.querySelector('input[name="nombre"]').value.trim();
    if (!recipeName) {
        alert('Por favor, ingrese el nombre de la receta');
        return false;
    }
    
    // Validar ingredientes
    const ingredientNames = document.querySelectorAll('input[name="ingrediente_nombre[]"]');
    let validIngredients = false;
    ingredientNames.forEach(input => {
        if (input.value.trim()) {
            validIngredients = true;
        }
    });
    if (!validIngredients) {
        alert('Por favor, ingrese al menos un ingrediente');
        return false;
    }
    
    // Validar procedimiento
    const steps = document.querySelectorAll('textarea[name="paso[]"]');
    let validSteps = false;
    steps.forEach(textarea => {
        if (textarea.value.trim()) {
            validSteps = true;
        }
    });
    if (!validSteps) {
        alert('Por favor, ingrese al menos un paso del procedimiento');
        return false;
    }
    
    // Validar duración
    const duration = document.querySelector('input[name="duracion"]').value;
    if (!duration || duration < 1) {
        alert('Por favor, ingrese una duración válida (mínimo 1 minuto)');
        return false;
    }
    
    // Validar utensilios
    return validateUtensils();
}

// Clear form function
function clearForm() {
    if (confirm('¿Está seguro de que desea limpiar el formulario? Se perderán todos los datos no guardados.')) {
        document.getElementById('recipe-form').reset();
        
        // Clear dynamic fields but keep one of each
        const ingredientsContainer = document.getElementById('ingredients-container');
        const stepsContainer = document.getElementById('steps-container');
        const utensilsContainer = document.getElementById('utensils-container');
        
        // Keep only first ingredient row
        while (ingredientsContainer.children.length > 1) {
            ingredientsContainer.removeChild(ingredientsContainer.lastChild);
        }
        
        // Keep only first step row
        while (stepsContainer.children.length > 1) {
            stepsContainer.removeChild(stepsContainer.lastChild);
        }
        
        // Keep only first utensil row (no eliminar porque es requerido)
        while (utensilsContainer.children.length > 1) {
            utensilsContainer.removeChild(utensilsContainer.lastChild);
        }
        
        // Clear the first rows
        const firstIngredient = ingredientsContainer.querySelector('.ingredient-row');
        firstIngredient.querySelectorAll('input').forEach(input => input.value = '');
        firstIngredient.querySelector('select').selectedIndex = 0;
        
        const firstStep = stepsContainer.querySelector('.step-row');
        firstStep.querySelector('textarea').value = '';
        
        const firstUtensil = utensilsContainer.querySelector('.utensil-row');
        firstUtensil.querySelector('select').selectedIndex = 0;
        
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
        
        // Reset form state tracking
        formInitialState = serializeForm(document.getElementById('recipe-form'));
    }
}

// Auto-focus on recipe name when editing
document.addEventListener('DOMContentLoaded', function() {
    const editingRecipeName = document.getElementById('editing-recipe-name');
    if (editingRecipeName) {
        editingRecipeName.focus();
    }
    
    // Add form submit validation
    const form = document.getElementById('recipe-form');
    form.addEventListener('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault();
            return false;
        }
    });
    
    // Initialize form state tracking
    formInitialState = serializeForm(form);
    
    // Track form changes for beforeunload warning
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

// Form state tracking for beforeunload warning
let formInitialState = '';

function serializeForm(form) {
    const formData = new FormData(form);
    let serialized = '';
    for (let [key, value] of formData.entries()) {
        serialized += key + '=' + value + '&';
    }
    return serialized;
}

// Auto-remove empty utensil selects when they lose focus
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('change', function(e) {
        if (e.target.name === 'utensilio[]' && e.target.value === '' && 
            document.querySelectorAll('.utensil-row').length > 1) {
            // Check if this is the only empty utensil row
            const utensilRows = document.querySelectorAll('.utensil-row');
            let emptyRows = 0;
            utensilRows.forEach(row => {
                const select = row.querySelector('select');
                if (select.value === '') {
                    emptyRows++;
                }
            });
            
            // If there are multiple empty rows and this one just became empty, remove it
            if (emptyRows > 1) {
                e.target.closest('.utensil-row').remove();
            }
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + Enter to submit form
    if (e.ctrlKey && e.key === 'Enter') {
        const form = document.getElementById('recipe-form');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to clear form (only when not editing)
    if (e.key === 'Escape' && !document.querySelector('input[name="nombre_original"]')) {
        if (confirm('¿Limpiar formulario?')) {
            clearForm();
        }
    }
});

// Auto-save draft functionality (optional)
let autoSaveTimer;
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('recipe-form');
    
    form.addEventListener('input', function() {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(function() {
            // Save form state to localStorage
            const formData = new FormData(form);
            const formState = {};
            for (let [key, value] of formData.entries()) {
                if (!formState[key]) {
                    formState[key] = [];
                }
                formState[key].push(value);
            }
            localStorage.setItem('recipeDraft', JSON.stringify(formState));
            console.log('Borrador guardado automáticamente');
        }, 2000);
    });
});

// Load draft function (optional)
function loadDraft() {
    const draft = localStorage.getItem('recipeDraft');
    if (draft && confirm('¿Cargar borrador guardado?')) {
        const formState = JSON.parse(draft);
        
        // Clear current form
        clearForm();
        
        // Load values (this would need more complex implementation)
        console.log('Cargando borrador:', formState);
        // Implementation would depend on your specific form structure
    }
}

// Initialize draft loading on page load if no existing data
document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('input[name="nombre_original"]') && 
        !document.querySelector('input[name="nombre"]').value) {
        // Check if there's a draft after a short delay
        setTimeout(loadDraft, 1000);
    }
});
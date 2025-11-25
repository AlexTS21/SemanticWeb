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

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const clearSearch = document.getElementById('clear-search');
    const resultCount = document.getElementById('result-count');
    const recipesGrid = document.getElementById('recipes-grid');
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    if (!searchInput) return;
    
    const totalRecipes = recipeCards.length;
    
    // Update result count
    function updateResultCount(visibleCount) {
        if (resultCount) {
            if (visibleCount === 0) {
                resultCount.textContent = 'No se encontraron recetas';
                resultCount.style.color = '#ff4757';
            } else {
                resultCount.textContent = `${visibleCount} de ${totalRecipes} recetas encontradas`;
                resultCount.style.color = '#6c757d';
            }
        }
    }
    
    // Clear search
    function clearSearchHandler() {
        searchInput.value = '';
        filterRecipes('');
        clearSearch.classList.add('hidden');
        searchInput.focus();
    }
    
    // Filter recipes based on search term
    function filterRecipes(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        let visibleCount = 0;
        
        recipeCards.forEach(card => {
            const recipeName = card.getAttribute('data-recipe-name');
            const recipeNameElement = card.querySelector('h3');
            const originalName = recipeNameElement.textContent;
            
            if (term === '' || recipeName.includes(term)) {
                card.style.display = 'block';
                card.classList.remove('hidden', 'fade-out');
                
                // Remove previous highlights
                const highlighted = card.querySelector('.highlight');
                if (highlighted) {
                    recipeNameElement.innerHTML = originalName;
                }
                
                visibleCount++;
            } else {
                card.classList.add('fade-out');
                setTimeout(() => {
                    card.style.display = 'none';
                    card.classList.add('hidden');
                }, 300);
            }
        });
        
        updateResultCount(visibleCount);
        
        // Show no results message if needed
        showNoResultsMessage(visibleCount === 0 && term !== '');
    }
    
    // Show no results message
    function showNoResultsMessage(show) {
        let noResults = document.getElementById('no-results-message');
        
        if (show && !noResults) {
            noResults = document.createElement('div');
            noResults.id = 'no-results-message';
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <i class="fas fa-search fa-3x"></i>
                <h3>No se encontraron recetas</h3>
                <p>Intenta con otros términos de búsqueda</p>
            `;
            recipesGrid.appendChild(noResults);
        } else if (!show && noResults) {
            noResults.remove();
        }
    }
    
    // Event listeners
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value;
        
        if (searchTerm.length > 0) {
            clearSearch.classList.remove('hidden');
        } else {
            clearSearch.classList.add('hidden');
        }
        
        filterRecipes(searchTerm);
    });
    
    clearSearch.addEventListener('click', clearSearchHandler);
    
    // Keyboard shortcuts for search
    searchInput.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + F to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
        
        // Escape to clear search
        if (e.key === 'Escape' && searchInput.value.length > 0) {
            e.preventDefault();
            clearSearchHandler();
        }
    });
    
    // Initialize
    updateResultCount(totalRecipes);
}

// Enhanced search with debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    
    // Add search tips
    const searchInfo = document.getElementById('search-info');
    if (searchInfo) {
        const searchTips = document.createElement('div');
        searchTips.className = 'search-tips';
        searchTips.textContent = '💡 Escribe el nombre de la receta para buscar';
        searchInfo.appendChild(searchTips);
        
        // Remove tips after 5 seconds
        setTimeout(() => {
            searchTips.style.opacity = '0';
            setTimeout(() => {
                if (searchTips.parentNode) {
                    searchTips.remove();
                }
            }, 300);
        }, 5000);
    }
});

// Advanced search function (optional - for future enhancements)
function advancedSearch(recipes, searchTerm) {
    const term = searchTerm.toLowerCase();
    
    return recipes.filter(recipe => {
        // Search in recipe name
        if (recipe.name.toLowerCase().includes(term)) {
            return true;
        }
        
        // Search in ingredients
        if (recipe.ingredients.some(ing => 
            ing.nombre.toLowerCase().includes(term))) {
            return true;
        }
        
        // Search in procedure steps
        if (recipe.procedure.some(step => 
            step.toLowerCase().includes(term))) {
            return true;
        }
        
        return false;
    });
}
// Dynamic form elements
function addIngredient() {
    const container = document.getElementById('ingredients-container');
    const newRow = document.createElement('div');
    newRow.className = 'ingredient-row';
    newRow.innerHTML = `
        <input type="text" name="ingrediente_nombre[]" placeholder="Nombre del ingrediente" class="form-control">
        <input type="number" name="ingrediente_cantidad[]" placeholder="Cantidad" class="form-control" step="0.1" min="0">
        <select name="ingrediente_unidad[]" class="form-control">
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
        <textarea name="paso[]" placeholder="Descripción del paso..." class="form-control"></textarea>
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
        <select name="utensilio[]" class="form-control">
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
    if (document.querySelectorAll('.utensil-row').length > 1) {
        button.parentElement.remove();
    }
}

// Validación del formulario
function validateForm() {
    let isValid = true;
    let errorMessage = '';
    
    // Validar nombre de receta
    const recipeName = document.querySelector('input[name="nombre"]').value.trim();
    if (!recipeName) {
        errorMessage = 'Por favor, ingrese el nombre de la receta';
        isValid = false;
    }
    
    // Validar ingredientes
    if (isValid) {
        const ingredientNames = document.querySelectorAll('input[name="ingrediente_nombre[]"]');
        let hasValidIngredients = false;
        let emptyIngredientCount = 0;
        
        ingredientNames.forEach(input => {
            if (input.value.trim()) {
                hasValidIngredients = true;
            } else {
                emptyIngredientCount++;
            }
        });
        
        if (!hasValidIngredients) {
            errorMessage = 'Por favor, ingrese al menos un ingrediente';
            isValid = false;
        } else if (emptyIngredientCount === ingredientNames.length) {
            errorMessage = 'Por favor, ingrese al menos un ingrediente';
            isValid = false;
        }
    }
    
    // Validar procedimiento
    if (isValid) {
        const steps = document.querySelectorAll('textarea[name="paso[]"]');
        let hasValidSteps = false;
        let emptyStepCount = 0;
        
        steps.forEach(textarea => {
            if (textarea.value.trim()) {
                hasValidSteps = true;
            } else {
                emptyStepCount++;
            }
        });
        
        if (!hasValidSteps) {
            errorMessage = 'Por favor, ingrese al menos un paso del procedimiento';
            isValid = false;
        } else if (emptyStepCount === steps.length) {
            errorMessage = 'Por favor, ingrese al menos un paso del procedimiento';
            isValid = false;
        }
    }
    
    // Validar duración
    if (isValid) {
        const duration = document.querySelector('input[name="duracion"]').value;
        if (!duration || duration < 1) {
            errorMessage = 'Por favor, ingrese una duración válida (mínimo 1 minuto)';
            isValid = false;
        }
    }
    
    // Validar utensilios
    if (isValid) {
        const utensilSelects = document.querySelectorAll('select[name="utensilio[]"]');
        let hasValidUtensil = false;
        let emptyUtensilCount = 0;
        
        utensilSelects.forEach(select => {
            if (select.value !== '') {
                hasValidUtensil = true;
            } else {
                emptyUtensilCount++;
            }
        });
        
        if (!hasValidUtensil) {
            errorMessage = 'Por favor, seleccione al menos un utensilio';
            isValid = false;
        } else if (emptyUtensilCount === utensilSelects.length) {
            errorMessage = 'Por favor, seleccione al menos un utensilio';
            isValid = false;
        }
    }
    
    if (!isValid && errorMessage) {
        alert(errorMessage);
        return false;
    }
    
    return true;
}

// Clear form function 
function clearForm() {
    if (confirm('¿Está seguro de que desea limpiar el formulario? Se perderán todos los datos no guardados.')) {
        const form = document.getElementById('recipe-form');
        
        // Reset del formulario
        form.reset();
        
        // Limpiar campos dinámicos pero mantener uno de cada
        const ingredientsContainer = document.getElementById('ingredients-container');
        const stepsContainer = document.getElementById('steps-container');
        const utensilsContainer = document.getElementById('utensils-container');
        
        // Mantener solo la primera fila de ingredientes
        while (ingredientsContainer.children.length > 1) {
            ingredientsContainer.removeChild(ingredientsContainer.lastChild);
        }
        
        // Mantener solo la primera fila de pasos
        while (stepsContainer.children.length > 1) {
            stepsContainer.removeChild(stepsContainer.lastChild);
        }
        
        // Mantener solo la primera fila de utensilios
        while (utensilsContainer.children.length > 1) {
            utensilsContainer.removeChild(utensilsContainer.lastChild);
        }
        
        // Limpiar las primeras filas
        const firstIngredient = ingredientsContainer.querySelector('.ingredient-row');
        if (firstIngredient) {
            firstIngredient.querySelectorAll('input').forEach(input => input.value = '');
            const select = firstIngredient.querySelector('select');
            if (select) select.selectedIndex = 0;
        }
        
        const firstStep = stepsContainer.querySelector('.step-row');
        if (firstStep) {
            firstStep.querySelector('textarea').value = '';
        }
        
        const firstUtensil = utensilsContainer.querySelector('.utensil-row');
        if (firstUtensil) {
            firstUtensil.querySelector('select').selectedIndex = 0;
        }
        
        // Resetear campos ocultos para nueva receta
        document.querySelector('input[name="action"]').value = 'add';
        const nombreOriginal = document.querySelector('input[name="nombre_original"]');
        if (nombreOriginal) {
            nombreOriginal.remove();
        }
        
        // Actualizar título del formulario
        const formTitle = document.getElementById('form-title');
        if (formTitle) {
            formTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Agregar Nueva Receta';
        }
        
        const submitButton = document.querySelector('.btn-primary');
        if (submitButton) {
            const icon = submitButton.querySelector('i');
            if (icon && icon.nextSibling) {
                icon.nextSibling.textContent = ' Guardar Receta';
            }
        }
        
        // Resetear seguimiento del estado del formulario
        formInitialState = serializeForm(form);
        
        // Limpiar localStorage del borrador
        localStorage.removeItem('recipeDraft');
    }
}

// Auto-focus on recipe name when editing
document.addEventListener('DOMContentLoaded', function() {
    const editingRecipeName = document.getElementById('editing-recipe-name');
    if (editingRecipeName) {
        editingRecipeName.focus();
    }
    
    // Manejar envío del formulario
    const form = document.getElementById('recipe-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            // Prevenir la validación HTML5 nativa
            e.preventDefault();
            
            // Usar nuestra validación personalizada
            if (validateForm()) {
                // Si la validación pasa, enviar el formulario
                this.submit();
            }
        });
        
        // Inicializar seguimiento del estado del formulario
        formInitialState = serializeForm(form);
        
        // Seguir cambios para advertencia beforeunload
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
    }
});

// Form state tracking for beforeunload warning
let formInitialState = '';

function serializeForm(form) {
    const formData = new FormData(form);
    let serialized = '';
    for (let [key, value] of formData.entries()) {
        serialized += key + '=' + encodeURIComponent(value) + '&';
    }
    return serialized;
}



// Funcionalidad de auto-guardado de borrador
let autoSaveTimer;
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('recipe-form');
    
    if (form) {
        form.addEventListener('input', function() {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(function() {
                // Guardar estado del formulario en localStorage
                const formData = new FormData(form);
                const formState = {};
                for (let [key, value] of formData.entries()) {
                    if (!formState[key]) {
                        formState[key] = [];
                    }
                    formState[key].push(value);
                }
                localStorage.setItem('recipeDraft', JSON.stringify(formState));
            }, 2000);
        });
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

/* Enhanced search with debouncing
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
}*/

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
});


document.addEventListener("DOMContentLoaded", () => {
    // Retrieve safely encoded JSON
    const recetas = JSON.parse(document.getElementById("recetas-data").textContent);
    console.log(recetas);

    const slider = document.getElementById("recipeSlider");
    const dotsContainer = document.getElementById("dotsContainer");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    let currentSlide = 0;

    // Create recipe cards
    for (const nombre in recetas) {
        const recipe = recetas[nombre];
        
        const card = document.createElement("div");
        card.className = "recipe-card";
        
        card.innerHTML = `
            <div class="recipe-header">
                <h2 class="recipe-title">${nombre}</h2>
                <span class="recipe-category">${recipe.category || 'General'}</span>
            </div>
            <div class="recipe-content">
                <div class="ingredients">
                    <h3>Ingredients</h3>
                    <ul>
                        ${Array.isArray(recipe.ingredientes) ? 
                          recipe.ingredientes.map(ingredient => `<li>${ingredient}</li>`).join('') : 
                          '<li>No ingredients listed</li>'}
                    </ul>
                </div>
                <div class="instructions">
                    <h3>Instructions</h3>
                    <ol>
                        ${Array.isArray(recipe.instrucciones) ? 
                          recipe.instrucciones.map(instruction => `<li>${instruction}</li>`).join('') : 
                          '<li>No instructions available</li>'}
                    </ol>
                </div>
            </div>
            <div class="recipe-meta">
                <span>Prep time: ${recipe.prepTime || 'Not specified'}</span>
                <span>Cook time: ${recipe.cookTime || 'Not specified'}</span>
            </div>
        `;
        
        slider.appendChild(card);
        
        // Create dot for this recipe
        const dot = document.createElement("div");
        dot.className = "dot";
        dot.addEventListener("click", () => {
            goToSlide(Object.keys(recetas).indexOf(nombre));
        });
        dotsContainer.appendChild(dot);
    }

    // Initialize first dot as active
    if (dotsContainer.children.length > 0) {
        dotsContainer.children[0].classList.add("active");
    }

    // Navigation functions
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update active dot
        Array.from(dotsContainer.children).forEach((dot, index) => {
            dot.classList.toggle("active", index === currentSlide);
        });
    }

    function nextSlide() {
        if (currentSlide < Object.keys(recetas).length - 1) {
            goToSlide(currentSlide + 1);
        } else {
            goToSlide(0); // Loop back to first
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        } else {
            goToSlide(Object.keys(recetas).length - 1); // Loop to last
        }
    }

    // Event listeners
    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    // Optional: Add keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") nextSlide();
        if (e.key === "ArrowLeft") prevSlide();
    });

    // Optional: Add swipe functionality for touch devices
    let startX = 0;
    let endX = 0;

    slider.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    slider.addEventListener("touchend", (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const diff = startX - endX;
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
});
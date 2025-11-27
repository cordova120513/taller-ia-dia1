document.addEventListener('DOMContentLoaded', () => {
    
    // ------------------------------------------------------------------
    // 1. Desplazamiento Suave (Smooth Scroll)
    // ------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Desplazamiento nativo suave entre secciones
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });


    // ------------------------------------------------------------------
    // 2. Animaciones de Aparición (Intersection Observer)
    // ------------------------------------------------------------------
    
    const elementsToAnimate = document.querySelectorAll('[data-animation]');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Aparecer cuando el 10% del elemento sea visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Añade la clase 'animated' para disparar el CSS Transition
                entry.target.classList.add('animated');
                // Deja de observar el elemento una vez que ha aparecido
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observa todos los elementos con el atributo data-animation
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
});
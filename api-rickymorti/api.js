const API_URL = 'https://rickandmortyapi.com/api/character';
const container = document.getElementById('container');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Función para obtener los personajes
async function fetchCharacters(name = '') {
    try {
        let url = API_URL;
        if (name) {
            url += `?name=${name}`;
        }

        container.innerHTML = '<div style="color: var(--neon-green); grid-column: 1/-1; text-align: center; font-size: 1.5rem; text-shadow: 0 0 10px var(--neon-green);">Cargando datos del multiverso...</div>';

        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                container.innerHTML = '<p style="text-align: center; grid-column: 1/-1; font-size: 1.5rem; color: #fff; text-shadow: 0 0 10px red;">No se encontraron formas de vida con ese nombre.</p>';
                return;
            }
            throw new Error('Error al obtener los datos');
        }

        const data = await response.json();
        renderCharacters(data.results);
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: red; font-size: 1.5rem;">Error crítico en el sistema de portal.</p>';
    }
}

// Función para renderizar las tarjetas
function renderCharacters(characters) {
    container.innerHTML = ''; // Limpiar contenedor

    characters.forEach((character, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        // Staggered animation delay
        card.style.animationDelay = `${index * 0.1}s`;

        // Determinar color del estado
        let statusColorClass = 'status-unknown';
        if (character.status === 'Alive') statusColorClass = 'status-alive';
        else if (character.status === 'Dead') statusColorClass = 'status-dead';

        // Calculate extra info
        const episodeCount = character.episode.length;
        const type = character.type || 'Desconocido';

        card.innerHTML = `
            <div class="card-image-container">
                <img src="${character.image}" alt="${character.name}">
            </div>
            <div class="card-content">
                <h2>${character.name}</h2>
                
                <div class="status">
                    <span class="status-indicator ${statusColorClass}"></span>
                    <span>${character.status} - ${character.species}</span>
                </div>

                <div class="data-row">
                    <span class="label">Última ubicación:</span>
                    <span class="value">${character.location.name}</span>
                </div>

                <div class="data-row">
                    <span class="label">Origen:</span>
                    <span class="value">${character.origin.name}</span>
                </div>

                <div class="data-row">
                    <span class="label">Género:</span>
                    <span class="value">${character.gender}</span>
                </div>

                <div class="data-row">
                    <span class="label">Apariciones:</span>
                    <span class="value">${episodeCount} episodios</span>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    fetchCharacters(searchTerm);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchTerm = searchInput.value.trim();
        fetchCharacters(searchTerm);
    }
});

// Cargar personajes al inicio
fetchCharacters();

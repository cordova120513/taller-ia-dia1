const searchBtn = document.getElementById('searchBtn');
const pokemonInput = document.getElementById('pokemonInput');
const pokemonCard = document.getElementById('pokemonCard');
const errorMsg = document.getElementById('errorMsg');

// DOM Elements for Pokemon Data
const searchBtn = document.getElementById('searchBtn');
const pokemonInput = document.getElementById('pokemonInput');
const pokemonCard = document.getElementById('pokemonCard');
const errorMsg = document.getElementById('errorMsg');

// DOM Elements for Pokemon Data
const pokeImg = document.getElementById('pokeImg');
const pokeName = document.getElementById('pokeName');
const pokeId = document.getElementById('pokeId');
const pokeTypes = document.getElementById('pokeTypes');
const pokeHeight = document.getElementById('pokeHeight');
const pokeWeight = document.getElementById('pokeWeight');
const pokeAbilities = document.getElementById('pokeAbilities');

// Stats Elements
const statHP = document.getElementById('statHP');
const statAtk = document.getElementById('statAtk');
const statDef = document.getElementById('statDef');
const statSpd = document.getElementById('statSpd');

// Audio Elements
const bgMusic = document.getElementById('bgMusic');
const pokeCry = document.getElementById('pokeCry');
const musicBtn = document.getElementById('musicBtn');

let isMusicPlaying = false;

const fetchPokemon = async (query) => {
    if (!query) return;

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);

        if (!response.ok) {
            throw new Error('Pokemon not found');
        }

        const data = await response.json();
        renderPokemon(data);
        playCry(data.cries.latest);
        errorMsg.style.display = 'none';

        // Try to start music on first successful search if not already playing (user interaction requirement)
        if (!isMusicPlaying) {
            toggleMusic();
        }
    } catch (error) {
        console.error(error);
        showError();
    }
};

const renderPokemon = (data) => {
    // Image
    pokeImg.src = data.sprites.other.home.front_default || data.sprites.front_default;

    // Name & ID
    pokeName.textContent = data.name;
    pokeId.textContent = `#${data.id.toString().padStart(3, '0')}`;

    // Types
    pokeTypes.innerHTML = '';
    data.types.forEach(typeInfo => {
        const badge = document.createElement('span');
        badge.classList.add('type-badge');
        badge.textContent = typeInfo.type.name;
        pokeTypes.appendChild(badge);
    });

    // Physical Stats
    pokeHeight.textContent = `${data.height / 10} m`;
    pokeWeight.textContent = `${data.weight / 10} kg`;

    // Abilities
    pokeAbilities.innerHTML = '';
    data.abilities.forEach(abilityInfo => {
        const badge = document.createElement('span');
        badge.classList.add('ability-badge');
        badge.textContent = abilityInfo.ability.name.replace('-', ' ');
        pokeAbilities.appendChild(badge);
    });

    // Battle Stats
    const getStat = (name) => data.stats.find(s => s.stat.name === name)?.base_stat || 0;
    statHP.textContent = getStat('hp');
    statAtk.textContent = getStat('attack');
    statDef.textContent = getStat('defense');
    statSpd.textContent = getStat('speed');

    // Show Card
    pokemonCard.classList.add('active');
};

const playCry = (url) => {
    if (url) {
        pokeCry.src = url;
        pokeCry.volume = 0.5;
        pokeCry.play().catch(e => console.log('Audio play failed:', e));
    }
};

const toggleMusic = () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicBtn.textContent = '♪'; // Music Off icon state
        musicBtn.style.opacity = '0.7';
    } else {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(e => console.log('Music autoplay blocked:', e));
        musicBtn.textContent = '♫'; // Music On icon state
        musicBtn.style.opacity = '1';
    }
    isMusicPlaying = !isMusicPlaying;
};

const showError = () => {
    pokemonCard.classList.remove('active');
    errorMsg.style.display = 'block';
};

// Event Listeners
searchBtn.addEventListener('click', () => {
    fetchPokemon(pokemonInput.value);
});

pokemonInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchPokemon(pokemonInput.value);
    }
});

musicBtn.addEventListener('click', toggleMusic);

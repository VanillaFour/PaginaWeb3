// index.js (ACTUALIZADO PARA AÑADIR HISTORIAS A LAS EXISTENTES EN EL HTML)

document.addEventListener('DOMContentLoaded', () => {

    // Esta función ahora solo se usa para calcular el ranking de "Top Historias"
    function getExampleStories() {
        return [
            { id: 'example_1', title: 'El Misterio de la Luna Silenciosa', likedBy: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7'] },
            { id: 'example_2', title: 'Crónicas de un Viajero del Tiempo', likedBy: ['userA', 'userB', 'userC', 'userD', 'userE', 'userF', 'userG', 'userH', 'userI'] },
            { id: 'example_3', title: 'El Corazón del Bosque Encantado', likedBy: ['userX', 'userY', 'userZ'] }
        ];
    }

    // 1. OBTENER SOLO LAS HISTORIAS DEL USUARIO
    const userStories = JSON.parse(localStorage.getItem('my-stories')) || [];
    const latestGrid = document.getElementById('latest-stories-grid');

    // 2. AÑADIR LAS HISTORIAS DEL USUARIO AL GRID (SIN BORRAR LAS DE EJEMPLO)
    if (latestGrid && userStories.length > 0) {
        // Se revierte para mostrar primero la más nueva
        userStories.slice().reverse().forEach(story => {
            const storyHtml = `
                <div class="story-card">
                    <div class="story-card-content">
                        <h3><a href="leer-historia.html?id=${story.id}&chapter=0">${story.title}</a></h3>
                        <p class="author">Por: ${story.authorUsername}</p>
                        <p class="genre">${story.chapters.length} cap. • ❤️ ${story.likedBy.length}</p>
                        <a href="leer-historia.html?id=${story.id}&chapter=0" class="read-more">Leer Más</a>
                    </div>
                </div>
            `;
            // Usamos insertAdjacentHTML para añadir al final sin borrar el contenido existente
            latestGrid.insertAdjacentHTML('beforeend', storyHtml);
        });
    }

    // 3. LÓGICA PARA "TOP HISTORIAS" (COMBINA DATOS DE EJEMPLO Y DE USUARIO)
    const topStoriesContainer = document.getElementById('top-stories-container');
    if (topStoriesContainer) {
        const exampleStoriesForRanking = getExampleStories();
        const allStoriesForRanking = exampleStoriesForRanking.concat(userStories);

        const sortedByLikes = allStoriesForRanking.sort((a, b) => b.likedBy.length - a.likedBy.length);
        const top5 = sortedByLikes.slice(0, 5);

        topStoriesContainer.innerHTML = ''; // Limpiamos solo esta sección
        if (top5.length > 0 && top5.some(story => story.likedBy.length > 0)) {
            top5.forEach((story, index) => {
                topStoriesContainer.innerHTML += `
                    <div class="top-story-item">
                        <span class="top-story-rank">#${index + 1}</span>
                        <div class="top-story-info">
                            <a href="leer-historia.html?id=${story.id}&chapter=0" class="top-story-title">${story.title}</a>
                            <span class="top-story-likes">❤️ ${story.likedBy.length} Me gusta</span>
                        </div>
                    </div>
                `;
            });
        } else {
            topStoriesContainer.innerHTML = '<p>¡Vota por tus historias favoritas para que aparezcan en el ranking!</p>';
        }
    }

    // 4. LÓGICA DE BÚSQUEDA (permanece igual y funciona con todas las tarjetas)
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const allCards = document.querySelectorAll('.story-card');

        allCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const author = card.querySelector('.author').textContent.toLowerCase();

            if (title.includes(searchTerm) || author.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
    }
});
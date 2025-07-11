// perfil.js (ACTUALIZADO CON ESTADÍSTICAS)

document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem('plataforma-session'));
    if (!session) {
        alert('Debes iniciar sesión para ver tu perfil.');
        window.location.href = 'iniciar-sesion.html';
        return;
    }

    // --- Cargar información básica del perfil ---
    document.getElementById('profile-username').textContent = session.username;

    // --- Cargar historias y calcular estadísticas ---
    const allStories = JSON.parse(localStorage.getItem('my-stories')) || [];
    const myStories = allStories.filter(story => story.authorUsername === session.username);
    
    const grid = document.getElementById('user-stories-grid');
    if (myStories.length === 0) {
        document.getElementById('no-stories-msg').style.display = 'block';
    } else {
        // Rellenar grid de historias
        grid.innerHTML = '';
        myStories.forEach(story => {
            grid.innerHTML += `
                <div class="story-card">
                    <div class="story-card-content">
                       <h3><a href="leer-historia.html?id=${story.id}&chapter=0">${story.title}</a></h3>
                       <p class="genre">Género: ${story.genre}</p>
                       <p class="author">${story.chapters.length} capítulo(s)</p>
                    </div>
                </div>
            `;
        });

        // Calcular y mostrar estadísticas
        const totalChapters = myStories.reduce((sum, story) => sum + story.chapters.length, 0);
        const genreCounts = myStories.reduce((counts, story) => {
            counts[story.genre] = (counts[story.genre] || 0) + 1;
            return counts;
        }, {});
        const favoriteGenre = Object.keys(genreCounts).length > 0
            ? Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b)
            : 'N/A';

        document.getElementById('stats-stories').textContent = myStories.length;
        document.getElementById('stats-chapters').textContent = totalChapters;
        document.getElementById('stats-genre').textContent = favoriteGenre;
    }
});
// script-historia.js (VERSIÓN COMPLETA Y FUNCIONAL)

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const storyId = params.get('id');
    const chapterIndex = parseInt(params.get('chapter') || '0');

    if (!storyId) {
        document.body.innerHTML = '<h1>Error: No se especificó un ID de historia.</h1>';
        return;
    }

    const allStories = getAllStories();
    const story = allStories.find(s => s.id === storyId);

    if (!story) {
        document.body.innerHTML = '<h1>404 - Historia no encontrada</h1>';
        return;
    }

    const chapter = story.chapters[chapterIndex];
    if (!chapter) {
        document.body.innerHTML = '<h1>Error: Capítulo no encontrado.</h1>';
        return;
    }

    document.getElementById('story-title').textContent = `${story.title}: ${chapter.title}`;
    document.getElementById('story-author').textContent = `Por: ${story.authorUsername}`;
    document.getElementById('story-content').textContent = chapter.content;
    document.title = `${story.title} | MiPlataforma`;
    
    setupLikeButton(story, allStories);
    setupChapterNavigation(story, chapterIndex);
    setupAddChapterForm(story, allStories);
});

function getAllStories() {
    const userStories = JSON.parse(localStorage.getItem('my-stories')) || [];
    const exampleStory = {
        id: '1',
        title: 'Un Nuevo Amanecer',
        authorUsername: 'MiPlataforma',
        genre: 'Ejemplo',
        chapters: [{ title: 'El Comienzo', content: 'Esta es una historia de ejemplo. ¡Sube la tuya para verla aquí!' }],
        likedBy: []
    };
    if (!userStories.find(story => story.id === exampleStory.id)) {
        userStories.push(exampleStory);
    }
    return userStories;
}

function setupLikeButton(story, allStories) {
    const likeBtn = document.getElementById('like-btn');
    const likeCount = document.getElementById('like-count');
    if (!likeBtn || !likeCount) return;

    const session = getSession();

    const updateLikeState = () => {
        likeCount.textContent = story.likedBy.length;
        likeBtn.classList.toggle('liked', session && story.likedBy.includes(session.username));
    };

    likeBtn.addEventListener('click', () => {
        if (!session) {
            alert('Debes iniciar sesión para dar "Me gusta".');
            return;
        }
        const userIndex = story.likedBy.indexOf(session.username);
        if (userIndex > -1) {
            story.likedBy.splice(userIndex, 1);
        } else {
            story.likedBy.push(session.username);
        }
        const storiesToSave = allStories.filter(s => s.id !== '1');
        localStorage.setItem('my-stories', JSON.stringify(storiesToSave));
        updateLikeState();
    });

    updateLikeState();
}

function setupChapterNavigation(story, chapterIndex) {
    const actions = document.querySelector('.story-actions');
    if (!actions) return;
    actions.innerHTML = '';
    if (chapterIndex > 0) {
        actions.innerHTML += `<a href="leer-historia.html?id=${story.id}&chapter=${chapterIndex - 1}" class="btn-nav">Capítulo Anterior</a>`;
    }
    if (chapterIndex < story.chapters.length - 1) {
        actions.innerHTML += `<a href="leer-historia.html?id=${story.id}&chapter=${chapterIndex + 1}" class="btn-nav">Capítulo Siguiente</a>`;
    }
}

function setupAddChapterForm(story, allStories) {
    const container = document.getElementById('add-chapter-container');
    if (!container) return;

    const session = getSession();
    if (session && session.username === story.authorUsername) {
        container.style.display = 'block';

        const form = document.getElementById('add-chapter-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newChapter = {
                title: document.getElementById('chapter-title').value,
                content: document.getElementById('chapter-content').value,
            };
            const storyToUpdate = allStories.find(s => s.id === story.id);
            storyToUpdate.chapters.push(newChapter);
            
            const storiesToSave = allStories.filter(s => s.id !== '1');
            localStorage.setItem('my-stories', JSON.stringify(storiesToSave));
            alert('¡Nuevo capítulo añadido!');
            window.location.reload();
        });
    }
}
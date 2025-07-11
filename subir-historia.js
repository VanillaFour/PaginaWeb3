// subir-historia.js
document.addEventListener('DOMContentLoaded', () => {
    // Se asegura de que auth.js (y getSession) esté disponible
    if (typeof getSession !== 'function') {
        console.error("Error: La función getSession() de auth.js no está disponible.");
        return;
    }

    const session = getSession();
    if (!session) {
        alert('Debes iniciar sesión para subir una historia.');
        window.location.href = 'iniciar-sesion.html';
        return; // Detiene la ejecución si no hay sesión
    }

    const uploadForm = document.getElementById('upload-form');
    // Si el formulario existe en la página actual, le asignamos la lógica
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(event) {
            // Prevenimos que el formulario se envíe y recargue la página
            event.preventDefault(); 
            
            const newStory = {
                id: 'story_' + Date.now(),
                title: document.getElementById('title').value,
                genre: document.getElementById('genre').value,
                authorUsername: session.username,
                chapters: [{
                    title: 'Capítulo 1',
                    content: document.getElementById('content').value
                }],
                likedBy: []
            };

            const stories = JSON.parse(localStorage.getItem('my-stories')) || [];
            stories.push(newStory);
            localStorage.setItem('my-stories', JSON.stringify(stories));

            alert('¡Tu historia ha sido publicada con éxito!');
            window.location.href = 'index.html';
        });
    }
});
// auth.js - GESTOR DE SESIÓN Y NAVEGACIÓN
function getSession() {
    return JSON.parse(localStorage.getItem('plataforma-session'));
}

function logout() {
    localStorage.removeItem('plataforma-session');
    alert('Has cerrado la sesión.');
    window.location.href = 'index.html';
}

function updateNavigation() {
    const navContainer = document.querySelector('.main-nav ul');
    if (!navContainer) return;
    const session = getSession();
    let navHTML = `<li><a href="index.html">Inicio</a></li><li><a href="#">Explorar</a></li>`;
    if (session) {
        navHTML += `<li><a href="subir-historia.html">Subir Historia</a></li><li><a href="perfil.html">Mi Perfil</a></li><li><a href="#" id="logout-btn">Cerrar Sesión</a></li>`;
    } else {
        navHTML += `<li><a href="iniciar-sesion.html">Iniciar Sesión</a></li><li><a href="registro.html">Registrarse</a></li>`;
    }
    navContainer.innerHTML = navHTML;
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = btoa(document.getElementById('password').value);
            const users = JSON.parse(localStorage.getItem('plataforma-users')) || [];
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                localStorage.setItem('plataforma-session', JSON.stringify({ username: user.username }));
                alert(`¡Bienvenido, ${user.username}!`);
                window.location.href = 'index.html';
            } else {
                alert('Usuario o contraseña incorrectos.');
            }
        });
    }
    const registroForm = document.getElementById('registro-form');
    if (registroForm) {
        registroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = btoa(document.getElementById('password').value);
            const users = JSON.parse(localStorage.getItem('plataforma-users')) || [];
            if (users.find(user => user.username === username)) {
                alert('El nombre de usuario ya existe.');
                return;
            }
            users.push({ username, password });
            localStorage.setItem('plataforma-users', JSON.stringify(users));
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            window.location.href = 'iniciar-sesion.html';
        });
    }
});
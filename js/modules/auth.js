import { showNotification } from './ui-modal.js';

export function checkAuthAndRedirect() {
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/');
    
    firebase.auth().onAuthStateChanged((user) => {
        if (!user && !isLoginPage) {
            window.location.href = 'index.html';
        } else if (user && isLoginPage) {
            window.location.href = 'anthon-code.html';
        }
    });
}

export async function handleLogout() {
    try {
        await firebase.auth().signOut();
        showNotification('Sesión cerrada', 'success');
        setTimeout(() => window.location.href = 'index.html', 500);
    } catch (error) {
        showNotification('Error al cerrar sesión', 'error');
    }
}

export function setupLogoutButton() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
}

let inactivityTimer;
export function setupInactivityMonitoring() {
    const resetTimer = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            firebase.auth().signOut().then(() => {
                showNotification('Sesión cerrada por inactividad', 'info');
                window.location.href = 'index.html';
            });
        }, 30 * 60 * 1000);
    };
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => document.addEventListener(event, resetTimer));
    resetTimer();
}
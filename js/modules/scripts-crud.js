import { getScriptsRef } from './firebase-init.js';
import { showNotification, showConfirmationModal } from './ui-modal.js';
import { loadScripts } from './ui-scripts.js';

// Variables globales
let currentCategory = 'all';
let isShowingFavorites = false;

// Función para actualizar el estado del filtro
export function updateFilterState(category, showFavorites) {
    currentCategory = category;
    isShowingFavorites = showFavorites;
}

export async function addNewScript(title, author, notes, category, content, folder = 'General') {
    const scriptsRef = getScriptsRef();
    try {
        await scriptsRef.add({
            title,
            author: author || '',
            notes: notes || '',
            category,
            content,
            folder: folder || 'General',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error al agregar script:', error);
        throw error;
    }
}

export async function updateScript(id, title, author, notes, category, content, folder = 'General') {
    const scriptsRef = getScriptsRef();
    try {
        await scriptsRef.doc(id).update({
            title,
            author: author || '',
            notes: notes || '',
            category,
            content,
            folder: folder || 'General',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error al actualizar script:', error);
        throw error;
    }
}

export async function deleteScript(id) {
    const scriptsRef = getScriptsRef();
    try {
        await scriptsRef.doc(id).delete();
        
        // Actualizar favoritos en localStorage
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        localStorage.setItem('favorites', JSON.stringify(favorites.filter(fid => fid !== id)));
        
        // Cerrar modal
        document.getElementById('script-modal').style.display = 'none';
        
        // ========== RECARGAR MANTENIENDO LA VISTA ACTUAL ==========
        // Usar window.reloadScripts que mantiene la carpeta actual
        if (typeof window.reloadScripts === 'function') {
            window.reloadScripts();
        } else {
            // Fallback: recargar scripts normales
            loadScripts();
        }
        
        return true;
    } catch (error) {
        console.error('Error al eliminar script:', error);
        throw error;
    }
}

export async function cloneScript(id, script) {
    const scriptsRef = getScriptsRef();
    try {
        await scriptsRef.add({
            title: `${script.title} (copia)`,
            author: script.author || '',
            notes: script.notes || '',
            category: script.category,
            content: script.content,
            folder: script.folder || 'General',  // <-- NUEVO: mantener la carpeta
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        
        // ========== RECARGAR MANTENIENDO LA VISTA ACTUAL ==========
        if (typeof window.reloadScripts === 'function') {
            window.reloadScripts();
        } else {
            loadScripts();
        }
        
        return true;
    } catch (error) {
        console.error('Error al clonar script:', error);
        showNotification('Error al clonar', 'error');
        throw error;
    }
}
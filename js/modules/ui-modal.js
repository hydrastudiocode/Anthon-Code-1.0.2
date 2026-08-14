import { deleteScript, cloneScript } from './scripts-crud.js';
import { loadScriptForEditing } from './editor-codemirror.js';
import { getModalViewerEditor, getModeFromCategory } from './editor-codemirror.js';
import { downloadScript } from './download.js';

let currentScriptId = null;
let currentScriptData = null;

// ========== FUNCIÓN ESCAPE HTML ==========
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function showNotification(message, type = 'info') {
    //const existing = document.querySelector('.custom-notification');
    //if (existing) existing.remove();
    
   // const notification = document.createElement('div');
    //notification.className = `custom-notification ${type}`;
    //notification.textContent = message;
    //document.body.appendChild(notification);
    //setTimeout(() => notification.classList.add('show'), 10);
    //setTimeout(() => {
     //   notification.classList.remove('show');
       // setTimeout(() => notification.remove(), 300);
    //}, 3000);
}

export function showConfirmationModal(message, callback) {
    const modal = document.createElement('div');
    modal.className = 'custom-confirm-modal';
    modal.innerHTML = `
        <div class="confirm-content">
            <p>${message}</p>
            <div class="confirm-buttons">
                <button class="confirm-btn confirm-no">Cancelar</button>
                <button class="confirm-btn confirm-yes">Eliminar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    modal.querySelector('.confirm-no').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.querySelector('.confirm-yes').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            callback();
        }, 300);
    });
}

// Función para cerrar el modal de visualización
function closeViewModal() {
    document.getElementById('script-modal').style.display = 'none';
}

export async function showScriptModal(id, script) {
    currentScriptId = id;
    currentScriptData = script;
    
    // ========== OBTENER DATOS DEL SCRIPT ==========
    const folder = script.folder || 'General';
    const category = script.category || 'Sin categoría';
    const author = script.author || 'No especificado';
    const notes = script.notes || 'No hay observaciones';
    
    // ========== TÍTULO ==========
    document.getElementById('modal-title').textContent = script.title;
    
    // ========== AUTOR + CARPETA + CATEGORÍA ==========
   
    
    // ========== NOTAS ==========
    const notesEl = document.getElementById('modal-notes');
    if (notesEl) {
        notesEl.textContent = notes;
    }
    
    // ========== EDITOR DE CÓDIGO ==========
    const modalEditor = getModalViewerEditor();
    if (modalEditor) {
        modalEditor.setValue(script.content || '');
        modalEditor.setOption('mode', getModeFromCategory(script.category));
        setTimeout(() => modalEditor.refresh(), 100);
    }
    
    // ========== MOSTRAR MODAL ==========
    document.getElementById('script-modal').style.display = 'block';
    
    // ========== BOTÓN COPIAR ==========
    document.getElementById('copy-btn').onclick = () => {
        navigator.clipboard.writeText(script.content || '');
        showNotification('¡Copiado!', 'success');
    };
    
    // ========== BOTÓN CLONAR ==========
    document.getElementById('clone-btn').onclick = async () => {
        await cloneScript(id, script);
        closeViewModal();
        const event = new CustomEvent('scriptsReload');
        document.dispatchEvent(event);
    };
    
    // ========== BOTÓN EDITAR ==========
    document.getElementById('edit-btn').onclick = () => {
        closeViewModal();
        if (typeof window.showEditModal === 'function') {
            window.showEditModal(currentScriptId, currentScriptData);
        } else {
            console.error('showEditModal no está definida');
            showNotification('Error: Editor no disponible', 'error');
        }
    };
    
    // ========== BOTÓN DESCARGAR ==========
    document.getElementById('download-btn').onclick = () => {
        downloadScript(script.content, script.title, script.category);
    };
    
    // ========== BOTÓN ELIMINAR ==========
    document.getElementById('modal-delete-btn').onclick = () => {
        showConfirmationModal('¿Borrar este Script?', async () => {
            await deleteScript(id);
            closeViewModal();
            const event = new CustomEvent('scriptsReload');
            document.dispatchEvent(event);
        });
    };
    
    // ========== BOTÓN FAVORITO ==========
   
}

// ========== CERRAR MODAL CON LA X ==========
document.querySelector('#script-modal .close')?.addEventListener('click', closeViewModal);

// ========== CERRAR MODAL HACIENDO CLIC FUERA ==========
window.addEventListener('click', (e) => {
    const modal = document.getElementById('script-modal');
    if (e.target === modal) {
        closeViewModal();
    }
});

// ========== CERRAR CON TECLA ESC ==========
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('script-modal');
        if (modal && modal.style.display === 'block') {
            closeViewModal();
        }
    }
});
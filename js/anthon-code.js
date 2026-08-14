import { initializeFirebase, initFirestoreRefs } from './modules/firebase-init.js';
import { checkAuthAndRedirect, setupLogoutButton, setupInactivityMonitoring } from './modules/auth.js';
import { loadScripts } from './modules/ui-scripts.js';
import { updateScript } from './modules/scripts-crud.js';
import { initCodeMirror, initModalViewer, getContentEditor, getEditEditor } from './modules/editor-codemirror.js';
import { setupExpandEditor } from './modules/editor-expand.js';
import { showNotification } from './modules/ui-modal.js';
import { getScriptsRef } from './modules/firebase-init.js';

// ========== ESTADO ==========
let currentFolder = null;

// ========== FUNCIÓN ESCAPE HTML ==========
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== ACTUALIZAR BOTÓN DE AGREGAR ==========
function updateAddButton() {
    const addBtn = document.getElementById('add-script-link');
    if (!addBtn) return;
    
    let icon = addBtn.querySelector('i');
    let textSpan = addBtn.querySelector('#add-btn-text');
    
    if (!textSpan) {
        textSpan = document.createElement('span');
        textSpan.id = 'add-btn-text';
        if (!icon) {
            icon = document.createElement('i');
            addBtn.appendChild(icon);
        }
        addBtn.appendChild(textSpan);
    }
    
    if (currentFolder && currentFolder !== 'General' && currentFolder !== 'Sin categoría') {
        icon.className = 'fas fa-plus-circle';
        textSpan.textContent = 'Agregar Script';
        addBtn.title = `Agregar script a "${currentFolder}"`;
    } else {
        icon.className = 'fas fa-folder-plus';
        textSpan.textContent = 'Agregar Carpeta';
        addBtn.title = 'Crear nueva carpeta';
    }
}

// Exponer globalmente
window.updateAddButton = updateAddButton;

// ========== ACTUALIZAR NAVEGACIÓN DE CARPETA EN SIDEBAR ==========
function updateFolderNavigation(folder) {
    const navSection = document.getElementById('folder-nav-section');
    const folderNameEl = document.getElementById('current-folder-name');
    const backBtn = document.getElementById('folder-back-btn-sidebar');
    const emptyMessageEl = document.getElementById('empty-folder-message-sidebar');
    
    if (folder && folder !== 'General' && folder !== 'Sin categoría') {
        if (navSection) navSection.style.display = 'block';
        if (folderNameEl) folderNameEl.textContent = folder;
        if (emptyMessageEl) emptyMessageEl.style.display = 'none';
        
        if (backBtn) {
            const newBackBtn = backBtn.cloneNode(true);
            backBtn.parentNode.replaceChild(newBackBtn, backBtn);
            newBackBtn.addEventListener('click', () => {
                currentFolder = null;
                window.currentFolder = null;
                updateAddButton();
                updateFolderNavigation(null);
                updateSearchNavigation(null, 0);
                loadScripts();
            });
        }
    } else {
        if (navSection) navSection.style.display = 'none';
        if (emptyMessageEl) emptyMessageEl.style.display = 'none';
    }
}

// Exponer globalmente
window.updateFolderNavigation = updateFolderNavigation;

// ========== ACTUALIZAR NAVEGACIÓN DE BÚSQUEDA EN SIDEBAR ==========
function updateSearchNavigation(searchTerm, resultsCount) {
    const navSection = document.getElementById('search-nav-section');
    const searchTermEl = document.getElementById('current-search-term');
    const countEl = document.getElementById('search-count-number');
    const emptyMessageEl = document.getElementById('empty-search-message-sidebar');
    const backBtn = document.getElementById('search-back-btn-sidebar');
    
    if (searchTerm && searchTerm.trim() !== '') {
        // Mostrar la navegación de búsqueda
        if (navSection) navSection.style.display = 'block';
        if (searchTermEl) searchTermEl.textContent = `"${escapeHtml(searchTerm)}"`;
        if (countEl) countEl.textContent = resultsCount || 0;
        
        // Mostrar/ocultar mensaje de vacío
        if (emptyMessageEl) {
            if (resultsCount === 0) {
                emptyMessageEl.style.display = 'flex';
            } else {
                emptyMessageEl.style.display = 'none';
            }
        }
        
        // Evento para volver
        if (backBtn) {
            const newBackBtn = backBtn.cloneNode(true);
            backBtn.parentNode.replaceChild(newBackBtn, backBtn);
            newBackBtn.addEventListener('click', () => {
                // Limpiar búsqueda
                const searchInput = document.getElementById('search-input');
                if (searchInput) searchInput.value = '';
                currentFolder = null;
                window.currentFolder = null;
                updateAddButton();
                updateFolderNavigation(null);
                updateSearchNavigation(null, 0);
                loadScripts();
            });
        }
    } else {
        // Ocultar la navegación de búsqueda
        if (navSection) navSection.style.display = 'none';
    }
}

// Exponer globalmente
window.updateSearchNavigation = updateSearchNavigation;

// ========== MOSTRAR MODAL DE AGREGAR CARPETA ==========
window.showAddFolderModal = function() {
    if (document.getElementById('add-folder-modal')) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'add-folder-modal';
    modal.style.display = 'block';
    modal.style.zIndex = '1002';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 450px; padding: 30px; position: relative;">
            <span class="close" id="close-folder-modal" style="position: absolute; right: 20px; top: 15px; font-size: 28px; cursor: pointer; color: var(--text-secondary);">&times;</span>
            <h2 style="text-align: center; color: #fff; margin-bottom: 20px;">
                <i class="fas fa-folder-plus" style="color: var(--accent-primary);"></i> Nueva Carpeta
            </h2>
            <form id="add-folder-form">
                <div class="form-group">
                    <label for="new-folder-name"><i class="fas fa-folder"></i> Nombre de la carpeta:</label>
                    <input type="text" id="new-folder-name" placeholder="Ej: Frontend, Backend, Utilidades..." required autofocus>
                </div>
                <div class="step-buttons" style="justify-content: center; margin-top: 20px; gap: 12px;">
                    <button type="submit" class="btn-primary" id="create-folder-btn" style="padding: 10px 30px;">
                        <i class="fas fa-plus"></i> Crear Carpeta
                    </button>
                    <button type="button" class="btn-secondary" id="cancel-folder-btn" style="padding: 10px 20px;">Cancelar</button>
                </div>
                <p id="folder-form-status" style="margin-top: 10px; text-align: center;"></p>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    setTimeout(() => {
        const input = document.getElementById('new-folder-name');
        if (input) input.focus();
    }, 100);
    
    const closeModal = () => {
        const modalEl = document.getElementById('add-folder-modal');
        if (modalEl) modalEl.remove();
        const btn = document.getElementById('create-folder-btn');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-plus"></i> Crear Carpeta';
        }
    };
    
    document.getElementById('close-folder-modal').onclick = closeModal;
    document.getElementById('cancel-folder-btn').onclick = closeModal;
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    document.getElementById('add-folder-form').onsubmit = async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('create-folder-btn');
        const input = document.getElementById('new-folder-name');
        const status = document.getElementById('folder-form-status');
        const folderName = input.value.trim();
        
        if (submitBtn.disabled) return;
        
        if (!folderName) {
            status.textContent = '❌ Por favor ingresa un nombre';
            status.style.color = '#f44336';
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';
        
        try {
            const scriptsRef = getScriptsRef();
            const snapshot = await scriptsRef.where('folder', '==', folderName).get();
            
            if (!snapshot.empty) {
                status.textContent = '❌ Ya existe una carpeta con ese nombre';
                status.style.color = '#f44336';
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-plus"></i> Crear Carpeta';
                return;
            }
            
            const newId = `folder_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
            await scriptsRef.doc(newId).set({
                title: `📁 ${folderName}`,
                author: 'Sistema',
                category: 'Carpeta',
                content: `// Carpeta: ${folderName}\n// Creada el ${new Date().toLocaleDateString()}\n// Agrega tus scripts aquí`,
                notes: `Carpeta creada para organizar scripts de ${folderName}`,
                folder: folderName,
                isFolder: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            setTimeout(() => {
                closeModal();
                if (typeof window.reloadScripts === 'function') {
                    window.reloadScripts();
                } else {
                    loadScripts();
                }
                showNotification(`Carpeta "${folderName}" creada`, 'success');
            }, 800);
            
        } catch (error) {
            console.error('Error creando carpeta:', error);
            status.textContent = 'Error al crear la carpeta';
            status.style.color = '#f44336';
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-plus"></i> Crear Carpeta';
        }
    };
};

// ========== MOSTRAR MODAL PARA ELIMINAR CARPETA ==========
window.showDeleteFolderModal = function(folderName) {
    if (document.getElementById('delete-folder-modal')) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'delete-folder-modal';
    modal.style.display = 'block';
    modal.style.zIndex = '1002';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px; padding: 30px; position: relative;">
            <span class="close" id="close-delete-modal" style="position: absolute; right: 20px; top: 15px; font-size: 28px; cursor: pointer; color: var(--text-secondary);">&times;</span>
            <h2 style="text-align: center; color: #fff; margin-bottom: 15px;">
                <i class="fas fa-exclamation-triangle" style="color: #f44336;"></i> Eliminar Carpeta
            </h2>
            <p style="text-align: center; color: var(--text-secondary); margin-bottom: 20px;">
                Esta accion eliminara todos los scripts dentro de 
                <strong style="color: #fff;">"${escapeHtml(folderName)}"</strong>.<br>
            </p>
            <div class="form-group">
                <label for="confirm-folder-delete">
                    Escribe el nombre de la carpeta para confirmar
                </label>
                <input type="text" id="confirm-folder-delete" placeholder="${escapeHtml(folderName)}" autofocus>
            </div>
            <div class="step-buttons" style="justify-content: center; margin-top: 20px; gap: 15px;">
                <button type="button" class="btn-secondary" id="cancel-delete-btn" style="padding: 10px 20px;">Cancelar</button>
                <button type="button" class="delete-btn" id="confirm-delete-btn" disabled style="padding: 10px 30px; background: #f44336; color: #fff; border: none; border-radius: 6px; cursor: pointer; opacity: 0.5;">
                    <i class="fas fa-trash"></i> Eliminar Carpeta
                </button>
            </div>
            <p id="delete-folder-status" style="margin-top: 10px; text-align: center;"></p>
        </div>
    `;
    document.body.appendChild(modal);
    
    const input = document.getElementById('confirm-folder-delete');
    const confirmBtn = document.getElementById('confirm-delete-btn');
    const status = document.getElementById('delete-folder-status');
    
    setTimeout(() => input?.focus(), 100);
    
    input.addEventListener('input', () => {
        if (input.value.trim() === folderName) {
            confirmBtn.disabled = false;
            confirmBtn.style.opacity = '1';
            status.textContent = '';
        } else {
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.5';
        }
    });
    
    const closeModal = () => {
        const modalEl = document.getElementById('delete-folder-modal');
        if (modalEl) modalEl.remove();
        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.innerHTML = '<i class="fas fa-trash"></i> Eliminar Carpeta';
            confirmBtn.style.opacity = '0.5';
        }
    };
    
    document.getElementById('close-delete-modal').onclick = closeModal;
    document.getElementById('cancel-delete-btn').onclick = closeModal;
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    confirmBtn.addEventListener('click', async () => {
        if (confirmBtn.disabled) return;
        
        if (input.value.trim() !== folderName) {
            status.textContent = 'El nombre no coincide';
            status.style.color = '#f44336';
            return;
        }
        
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Eliminando...';
        
        try {
            const scriptsRef = getScriptsRef();
            const snapshot = await scriptsRef.where('folder', '==', folderName).get();
            
            if (snapshot.empty) {
                status.textContent = 'No hay scripts en esta carpeta';
                status.style.color = '#ff9800';
                setTimeout(closeModal, 1000);
                return;
            }
            
            const batch = firebase.firestore().batch();
            snapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();
            
            setTimeout(() => {
                closeModal();
                currentFolder = null;
                window.currentFolder = null;
                updateAddButton();
                updateFolderNavigation(null);
                updateSearchNavigation(null, 0);
                if (typeof window.reloadScripts === 'function') {
                    window.reloadScripts();
                } else {
                    loadScripts();
                }
            }, 800);
            
        } catch (error) {
            console.error('Error eliminando carpeta:', error);
            status.textContent = 'Error al eliminar la carpeta';
            status.style.color = '#f44336';
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = '<i class="fas fa-trash"></i> Eliminar Carpeta';
        }
    });
};

// ========== INICIALIZACIÓN ==========
function init() {
    initializeFirebase();
    initFirestoreRefs();
    checkAuthAndRedirect();
    setupLogoutButton();
    
    initCodeMirror();
    initModalViewer();
    
    const contentEditor = getContentEditor();
    if (contentEditor) {
        setupExpandEditor(contentEditor, 'code-mirror-container', 'expand-editor-btn');
    }
    
    setupNavigation();
    setupFormSubmits();
    setupModalClose();
    setupSearch();
    setupAddButton();
    
    // Inicializar navegaciones
    updateFolderNavigation(null);
    updateSearchNavigation(null, 0);
    
    loadScripts();
    updateAddButton();
    
    if (!window.location.pathname.includes('index.html')) {
        setupInactivityMonitoring();
    }
}

// ========== CONFIGURAR BOTÓN DE AGREGAR ==========
function setupAddButton() {
    const addBtn = document.getElementById('add-script-link');
    if (!addBtn) return;
    
    addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (currentFolder && currentFolder !== 'General' && currentFolder !== 'Sin categoría') {
            if (typeof window.showAddModal === 'function') {
                window.showAddModal(currentFolder);
            } else {
                console.error('showAddModal no está definida');
                showNotification('Error: Módulo de agregar no cargado', 'error');
            }
        } else {
            window.showAddFolderModal();
        }
    });
}

// ========== NAVEGACIÓN ==========
function setupNavigation() {
    const viewScriptsLink = document.getElementById('view-scripts-link');
    
    if (viewScriptsLink) {
        viewScriptsLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentFolder = null;
            window.currentFolder = null;
            const searchInput = document.getElementById('search-input');
            if (searchInput) searchInput.value = '';
            updateAddButton();
            updateFolderNavigation(null);
            updateSearchNavigation(null, 0);
            loadScripts();
        });
    }
}

// ========== CONFIGURAR BÚSQUEDA ==========
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const term = e.target.value.trim();
            
            searchTimeout = setTimeout(() => {
                if (term.length >= 2) {
                    // Mostrar resultados de búsqueda
                    loadScripts(term);
                } else if (term.length === 0) {
                    // Limpiar búsqueda y volver a carpetas
                    currentFolder = null;
                    window.currentFolder = null;
                    updateAddButton();
                    updateFolderNavigation(null);
                    updateSearchNavigation(null, 0);
                    loadScripts();
                }
            }, 300);
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                currentFolder = null;
                window.currentFolder = null;
                updateAddButton();
                updateFolderNavigation(null);
                updateSearchNavigation(null, 0);
                loadScripts();
                searchInput.blur();
            }
        });
    }
}

// ========== CONFIGURAR FORMULARIOS ==========
function setupFormSubmits() {
    const editForm = document.getElementById('edit-script-form');
    if (editForm) {
        editForm.addEventListener('submit', handleEditSubmit);
    }
    setupStepNavigation();
}

// ========== MANEJAR ENVÍO DE EDICIÓN ==========
async function handleEditSubmit(e) {
    e.preventDefault();
    const submitBtn = document.querySelector('#edit-script-form button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
    
    const id = document.getElementById('edit-script-id').value;
    const title = document.getElementById('edit-script-title').value.trim();
    const author = document.getElementById('edit-script-author').value.trim();
    const notes = document.getElementById('edit-script-notes').value.trim();
    const category = document.getElementById('edit-script-category').value;
    const folder = document.getElementById('edit-script-folder').value || 'General';
    const editEditor = getEditEditor();
    const content = editEditor ? editEditor.getValue() : document.getElementById('edit-script-content').value.trim();
    const status = document.getElementById('edit-form-status');
    
    if (!title || !category || !content) {
        if (status) {
            status.textContent = 'Completa los campos obligatorios';
            status.className = 'error';
        }
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        return;
    }
    
    try {
        await updateScript(id, title, author, notes, category, content, folder);
        if (status) {
            status.textContent = '✅ Script actualizado correctamente';
            status.className = 'success';
        }
        showNotification('Script actualizado correctamente', 'success');
        
        if (currentFolder) {
            loadScripts('', currentFolder);
        } else {
            loadScripts();
        }
        
        setTimeout(() => {
            const modal = document.getElementById('edit-script-modal');
            if (modal) modal.style.display = 'none';
            if (status) {
                status.textContent = '';
                status.className = '';
            }
        }, 1500);
    } catch (error) {
        console.error('Error al actualizar:', error);
        if (status) {
            status.textContent = '❌ Error al actualizar el script';
            status.className = 'error';
        }
        showNotification('Error al actualizar el script', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ========== NAVEGACIÓN DE PASOS ==========
function setupStepNavigation() {
    document.querySelectorAll('.btn-next-step').forEach(btn => {
        btn.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const nextStepNum = parseInt(this.dataset.next);
            const form = this.closest('form');
            const indicators = form.querySelectorAll('.step-indicator');
            
            currentStep.classList.remove('active');
            indicators.forEach(ind => ind.classList.remove('active'));
            
            const nextStep = form.querySelector(`#edit-step-${nextStepNum}`);
            if (nextStep) {
                nextStep.classList.add('active');
                const indicator = form.querySelector(`.step-indicator[data-step="${nextStepNum}"]`);
                if (indicator) indicator.classList.add('active');
            }
        });
    });
    
    document.querySelectorAll('.btn-prev-step').forEach(btn => {
        btn.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const prevStepNum = parseInt(this.dataset.prev);
            const form = this.closest('form');
            const indicators = form.querySelectorAll('.step-indicator');
            
            currentStep.classList.remove('active');
            indicators.forEach(ind => ind.classList.remove('active'));
            
            const prevStep = form.querySelector(`#edit-step-${prevStepNum}`);
            if (prevStep) {
                prevStep.classList.add('active');
                const indicator = form.querySelector(`.step-indicator[data-step="${prevStepNum}"]`);
                if (indicator) indicator.classList.add('active');
            }
        });
    });
    
    document.querySelectorAll('.btn-cancel-edit').forEach(btn => {
        btn.addEventListener('click', closeEditModal);
    });
    
    document.querySelectorAll('.btn-cancel-add').forEach(btn => {
        btn.addEventListener('click', closeAddModal);
    });
    
    document.querySelectorAll('.btn-next-step-add').forEach(btn => {
        btn.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const nextStepNum = parseInt(this.dataset.next);
            const form = this.closest('form');
            const indicators = form.querySelectorAll('.add-step-indicator');
            
            if (nextStepNum === 2) {
                const editor = getContentEditor();
                const content = editor ? editor.getValue() : document.getElementById('add-script-content').value.trim();
                if (!content) {
                    showNotification('Por favor, escribe el código antes de continuar', 'error');
                    return;
                }
            }
            
            currentStep.classList.remove('active');
            indicators.forEach(ind => ind.classList.remove('active'));
            
            const nextStep = form.querySelector(`#add-step-${nextStepNum}`);
            if (nextStep) {
                nextStep.classList.add('active');
                const indicator = form.querySelector(`.add-step-indicator[data-step="${nextStepNum}"]`);
                if (indicator) indicator.classList.add('active');
            }
        });
    });
    
    document.querySelectorAll('.btn-prev-step-add').forEach(btn => {
        btn.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const prevStepNum = parseInt(this.dataset.prev);
            const form = this.closest('form');
            const indicators = form.querySelectorAll('.add-step-indicator');
            
            currentStep.classList.remove('active');
            indicators.forEach(ind => ind.classList.remove('active'));
            
            const prevStep = form.querySelector(`#add-step-${prevStepNum}`);
            if (prevStep) {
                prevStep.classList.add('active');
                const indicator = form.querySelector(`.add-step-indicator[data-step="${prevStepNum}"]`);
                if (indicator) indicator.classList.add('active');
            }
        });
    });
}

// ========== FUNCIONES PARA CERRAR MODALES ==========
function closeEditModal() {
    const modal = document.getElementById('edit-script-modal');
    if (modal) {
        modal.style.display = 'none';
        const form = document.getElementById('edit-script-form');
        if (form) form.reset();
        const status = document.getElementById('edit-form-status');
        if (status) {
            status.textContent = '';
            status.className = '';
        }
        const steps = form.querySelectorAll('.form-step');
        const indicators = form.querySelectorAll('.step-indicator');
        steps.forEach(step => step.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        const firstStep = form.querySelector('#edit-step-1');
        const firstIndicator = form.querySelector('.step-indicator[data-step="1"]');
        if (firstStep) firstStep.classList.add('active');
        if (firstIndicator) firstIndicator.classList.add('active');
    }
}

function closeAddModal() {
    const modal = document.getElementById('add-script-modal');
    if (modal) {
        modal.style.display = 'none';
        const form = document.getElementById('add-script-form');
        if (form) form.reset();
        const status = document.getElementById('add-form-status');
        if (status) {
            status.textContent = '';
            status.className = '';
        }
        const steps = form.querySelectorAll('.form-step');
        const indicators = form.querySelectorAll('.add-step-indicator');
        steps.forEach(step => step.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        const firstStep = form.querySelector('#add-step-1');
        const firstIndicator = form.querySelector('.add-step-indicator[data-step="1"]');
        if (firstStep) firstStep.classList.add('active');
        if (firstIndicator) firstIndicator.classList.add('active');
    }
}

// Exportar funciones globales
window.closeEditModal = closeEditModal;
window.closeAddModal = closeAddModal;

// ========== NAVEGAR A CARPETA ==========
window.navigateToFolder = function(folder) {
    currentFolder = folder;
    window.currentFolder = folder;
    updateAddButton();
    updateFolderNavigation(folder);
    updateSearchNavigation(null, 0);
    loadScripts('', folder);
};

// ========== CONFIGURAR CIERRE DE MODALES ==========
function setupModalClose() {
    const modal = document.getElementById('script-modal');
    const closeBtn = document.querySelector('#script-modal .close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }
    
    const editModal = document.getElementById('edit-script-modal');
    const editCloseBtn = document.querySelector('#edit-script-modal .edit-close');
    if (editCloseBtn) {
        editCloseBtn.addEventListener('click', closeEditModal);
    }
    
    const addModal = document.getElementById('add-script-modal');
    const addCloseBtn = document.querySelector('#add-script-modal .add-close');
    if (addCloseBtn) {
        addCloseBtn.addEventListener('click', closeAddModal);
    }
    
    window.addEventListener('click', (e) => {
        if (modal && e.target === modal) modal.style.display = 'none';
        if (editModal && e.target === editModal) closeEditModal();
        if (addModal && e.target === addModal) closeAddModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal && modal.style.display === 'block') modal.style.display = 'none';
            if (editModal && editModal.style.display === 'block') closeEditModal();
            if (addModal && addModal.style.display === 'block') closeAddModal();
            
            const folderModal = document.getElementById('add-folder-modal');
            if (folderModal) folderModal.remove();
            const deleteModal = document.getElementById('delete-folder-modal');
            if (deleteModal) deleteModal.remove();
        }
    });
}

// ========== FUNCIÓN GLOBAL PARA RECARGAR SCRIPTS ==========
window.reloadScripts = function() {
    const folder = window.currentFolder || currentFolder;
    if (folder) {
        loadScripts('', folder);
    } else {
        loadScripts();
    }
    updateAddButton();
    updateFolderNavigation(folder);
    updateSearchNavigation(null, 0);
};

// ========== INICIAR ==========
document.addEventListener('DOMContentLoaded', init);
// Variables del modal de edición
const editModal = document.getElementById('edit-script-modal');
let currentEditScriptId = null;
let currentEditScriptData = null;
let isEditorExpanded = false;
let isSubmitting = false;

// Obtener referencia de Firebase
function getFirestoreRef() {
    if (typeof firebase !== 'undefined' && firebase.firestore) {
        return firebase.firestore();
    }
    if (typeof window.firebase !== 'undefined' && window.firebase.firestore) {
        return window.firebase.firestore();
    }
    if (typeof db !== 'undefined') {
        return db;
    }
    throw new Error('Firebase no está inicializado');
}

// Función para salir del modo expandido
function exitExpandMode() {
    const wrapper = document.querySelector('#edit-step-1 .code-mirror-wrapper');
    if (wrapper && wrapper.classList.contains('expanded')) {
        wrapper.classList.remove('expanded');
        isEditorExpanded = false;
        const exitBtn = wrapper.querySelector('.expand-exit-btn');
        if (exitBtn) exitBtn.remove();
        setTimeout(() => {
            if (window.editEditor) window.editEditor.refresh();
        }, 100);
    }
}

// Función para resetear el formulario
function resetEditForm() {
    exitExpandMode();
    showEditStep(1);
    const statusEl = document.getElementById('edit-form-status');
    if (statusEl) {
        statusEl.textContent = '';
        statusEl.style.cssText = '';
        statusEl.style.display = 'none';
    }
}

// Función para cerrar el modal
function closeEditModal() {
    exitExpandMode();
    if (editModal) editModal.style.display = 'none';
    currentEditScriptId = null;
    currentEditScriptData = null;
    isSubmitting = false;
    
    // Limpiar el formulario
    const form = document.getElementById('edit-script-form');
    if (form) form.reset();
    if (window.editEditor) window.editEditor.setValue('');
    
    // Limpiar mensajes de estado
    const statusEl = document.getElementById('edit-form-status');
    if (statusEl) {
        statusEl.textContent = '';
        statusEl.style.cssText = '';
        statusEl.style.display = 'none';
    }
    
    // Restaurar botón de submit si estaba bloqueado
    const submitBtn = document.querySelector('#edit-script-form button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar Script';
        submitBtn.disabled = false;
    }
}

// Función para recargar los scripts (sin recargar página)
function reloadScripts() {
    // Disparar evento personalizado
    const event = new CustomEvent('scriptsReload');
    document.dispatchEvent(event);
    
    // Intentar diferentes formas de recargar
    setTimeout(() => {
        if (typeof window.loadScripts === 'function') {
            window.loadScripts();
        } else if (typeof loadScripts === 'function') {
            loadScripts();
        }
        // No recargar la página automáticamente
    }, 300);
}

// Función para mostrar el modal de edición
window.showEditModal = function(scriptId, scriptData) {
    // Resetear estado antes de abrir
    resetEditForm();
    isSubmitting = false;
    
    // Restaurar botón de submit
    const submitBtn = document.querySelector('#edit-script-form button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar Script';
        submitBtn.disabled = false;
    }
    
    currentEditScriptId = scriptId;
    currentEditScriptData = scriptData;
    
    // Limpiar mensajes de error
    const statusEl = document.getElementById('edit-form-status');
    if (statusEl) {
        statusEl.textContent = '';
        statusEl.style.cssText = '';
        statusEl.style.display = 'none';
    }
    
    // Resetear al paso 1
    showEditStep(1);
    
    // Llenar campos
    document.getElementById('edit-script-id').value = scriptId;
    document.getElementById('edit-script-title').value = scriptData.title || '';
    document.getElementById('edit-script-author').value = scriptData.author || '';
    document.getElementById('edit-script-category').value = scriptData.category || '';
    document.getElementById('edit-script-notes').value = scriptData.notes || '';
    
    // Configurar CodeMirror
    const textarea = document.getElementById('edit-script-content');
    if (window.editEditor) {
        window.editEditor.setValue(scriptData.content || '');
        window.editEditor.setSize(null, null);
        window.editEditor.setOption('mode', getModeFromCategory(scriptData.category));
    } else {
        window.editEditor = CodeMirror.fromTextArea(textarea, {
            lineNumbers: true,
            mode: getModeFromCategory(scriptData.category),
            theme: 'dracula',
            lineWrapping: true,
            autoCloseBrackets: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
        });
        window.editEditor.setValue(scriptData.content || '');
    }
    
    // Mostrar modal
    editModal.style.display = 'block';
    
    // Refrescar editor
    setTimeout(() => {
        if (window.editEditor) window.editEditor.refresh();
    }, 100);
};

// Botón expandir editor
document.getElementById('expand-edit-editor-btn')?.addEventListener('click', () => {
    const wrapper = document.querySelector('#edit-step-1 .code-mirror-wrapper');
    
    if (!wrapper.classList.contains('expanded')) {
        wrapper.classList.add('expanded');
        isEditorExpanded = true;
        
        const exitBtn = document.createElement('button');
        exitBtn.className = 'expand-exit-btn';
        exitBtn.innerHTML = '<i class="fas fa-compress"></i> Salir';
        exitBtn.onclick = (e) => {
            e.stopPropagation();
            exitExpandMode();
        };
        wrapper.appendChild(exitBtn);
    } else {
        exitExpandMode();
    }
    
    setTimeout(() => {
        if (window.editEditor) window.editEditor.refresh();
    }, 100);
});

// Función para cambiar de paso
function showEditStep(stepNumber) {
    const step1 = document.getElementById('edit-step-1');
    const step2 = document.getElementById('edit-step-2');
    const indicators = document.querySelectorAll('.step-indicator');
    
    exitExpandMode();
    
    if (stepNumber === 1) {
        if (step1) step1.classList.add('active');
        if (step2) step2.classList.remove('active');
        setTimeout(() => window.editEditor?.refresh(), 100);
    } else {
        if (step1) step1.classList.remove('active');
        if (step2) step2.classList.add('active');
    }
    
    indicators.forEach(indicator => {
        const step = parseInt(indicator.getAttribute('data-step'));
        if (step === stepNumber) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Función para mostrar SOLO mensajes de éxito o error
function showEditStatus(message, type) {
    const statusEl = document.getElementById('edit-form-status');
    if (!statusEl) return;
    
    statusEl.textContent = message;
    statusEl.style.display = 'block';
    statusEl.style.padding = '10px';
    statusEl.style.borderRadius = '8px';
    statusEl.style.marginTop = '15px';
    statusEl.style.textAlign = 'center';
    
    if (type === 'success') {
        statusEl.style.color = '#4caf50';
        statusEl.style.background = 'rgba(76, 175, 80, 0.1)';
        statusEl.style.border = '1px solid #4caf50';
        // Limpiar mensaje de éxito después de 2 segundos
        setTimeout(() => {
            if (statusEl.textContent === message) {
                statusEl.style.display = 'none';
            }
        }, 2000);
    } else if (type === 'error') {
        statusEl.style.color = '#f44336';
        statusEl.style.background = 'rgba(244, 67, 54, 0.1)';
        statusEl.style.border = '1px solid #f44336';
        // Limpiar mensaje de error después de 3 segundos
        setTimeout(() => {
            if (statusEl.textContent === message) {
                statusEl.style.display = 'none';
            }
        }, 3000);
    }
}

// ========== SUBMIT DEL FORMULARIO CORREGIDO ==========
document.getElementById('edit-script-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Prevenir envíos múltiples
    if (isSubmitting) {
        return; // Silenciosamente ignorar
    }
    
    const scriptId = document.getElementById('edit-script-id').value;
    if (!scriptId) {
        showEditStatus('Error: ID del script no encontrado', 'error');
        return;
    }
    
    // Obtener valores (sin validación de campos requeridos para no mostrar mensajes innecesarios)
    const title = document.getElementById('edit-script-title').value.trim();
    const category = document.getElementById('edit-script-category').value;
    
    // Validación silenciosa - solo prevenir envío sin mostrar mensajes
    if (!title || !category) {
        // No mostrar mensaje, solo evitar envío
        return;
    }
    
    const updatedData = {
        title: title,
        author: document.getElementById('edit-script-author').value.trim() || 'Anonimo',
        category: category,
        content: window.editEditor ? window.editEditor.getValue() : document.getElementById('edit-script-content').value,
        notes: document.getElementById('edit-script-notes').value || '',
        updatedAt: new Date()
    };
    
    // Bloquear botón
    isSubmitting = true;
    const submitBtn = document.querySelector('#edit-script-form button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
    submitBtn.disabled = true;
    
    try {
        // Obtener referencia a Firestore
        let scriptsRef;
        try {
            const db = getFirestoreRef();
            scriptsRef = db.collection('scripts');
        } catch (err) {
            throw new Error('Firebase no está inicializado');
        }
        
        // Actualizar en Firebase
        await scriptsRef.doc(scriptId).update(updatedData);
        
        // Mostrar mensaje de éxito
        showEditStatus('Script actualizado', 'success');
        
        // Cerrar modal después de éxito
        setTimeout(() => {
            closeEditModal();
            // Recargar scripts sin recargar página
            reloadScripts();
        }, 1500);
        
    } catch (error) {
        console.error('Error al actualizar:', error);
        
        let errorMsg = 'Error al actualizar el script';
        if (error.message) {
            if (error.message.includes('permission')) {
                errorMsg = 'Sin permisos para editar este script';
            } else if (error.message.includes('network')) {
                errorMsg = 'Error de red. Revisa tu conexión';
            }
        }
        
        showEditStatus(errorMsg, 'error');
        
        // Restaurar botón después del error
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        isSubmitting = false;
    }
});

// Eventos del modal
document.querySelectorAll('.edit-close, .btn-cancel-edit').forEach(btn => {
    btn.addEventListener('click', closeEditModal);
});

// Cerrar al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        closeEditModal();
    }
});

// Botones de navegación
document.querySelectorAll('.btn-next-step').forEach(btn => {
    btn.addEventListener('click', () => showEditStep(2));
});

document.querySelectorAll('.btn-prev-step').forEach(btn => {
    btn.addEventListener('click', () => showEditStep(1));
});

// Clic en indicadores
document.querySelectorAll('.step-indicator').forEach(indicator => {
    indicator.addEventListener('click', () => {
        const step = parseInt(indicator.getAttribute('data-step'));
        showEditStep(step);
    });
});

// Función auxiliar para obtener modo de syntax
function getModeFromCategory(category) {
    const modes = {
        'JavaScript': 'javascript',
        'Python': 'python',
        'PHP': 'php',
        'C': 'text/x-csrc',
        'C++': 'text/x-c++src',
        'C#': 'text/x-csharp',
        'HTML': 'htmlmixed',
        'CSS': 'css',
        'JSON': 'application/json',
        'TypeScript': 'javascript',
        'Java': 'text/x-java',
        'Ruby': 'ruby',
        'Bash': 'shell',
        'GdScript': 'javascript'
    };
    return modes[category] || 'javascript';
}

// Exportar funciones
window.showEditModal = showEditModal;
window.closeEditModal = closeEditModal;

console.log('Editor de scripts cargado correctamente');
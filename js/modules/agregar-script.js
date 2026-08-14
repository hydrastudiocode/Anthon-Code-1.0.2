import { getScriptsRef } from './firebase-init.js';
import { loadScripts } from './ui-scripts.js';
// Variables del modal de agregar
const addModal = document.getElementById('add-script-modal');
let isAddEditorExpanded = false;
let isAdding = false;
let preselectedFolder = null;

// Función para salir del modo expandido (versión para agregar)
function exitAddExpandMode() {
    const wrapper = document.querySelector('#add-step-1 .code-mirror-wrapper');
    if (wrapper && wrapper.classList.contains('expanded')) {
        wrapper.classList.remove('expanded');
        isAddEditorExpanded = false;
        const exitBtn = wrapper.querySelector('.expand-exit-btn');
        if (exitBtn) exitBtn.remove();
        setTimeout(() => {
            if (window.addEditor) window.addEditor.refresh();
        }, 100);
    }
}

// Función para resetear el formulario de agregar
function resetAddForm() {
    exitAddExpandMode();
    showAddStep(1);
    const statusEl = document.getElementById('add-form-status');
    if (statusEl) {
        statusEl.textContent = '';
        statusEl.style.cssText = '';
        statusEl.style.display = 'none';
    }
    preselectedFolder = null;
}

// Función para cerrar el modal de agregar
function closeAddModal() {
    exitAddExpandMode();
    if (addModal) addModal.style.display = 'none';
    isAdding = false;
    preselectedFolder = null;
    
    const form = document.getElementById('add-script-form');
    if (form) form.reset();
    if (window.addEditor) window.addEditor.setValue('');
    
    const statusEl = document.getElementById('add-form-status');
    if (statusEl) {
        statusEl.textContent = '';
        statusEl.style.cssText = '';
        statusEl.style.display = 'none';
    }
    
    const submitBtn = document.querySelector('#add-script-form button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Script';
        submitBtn.disabled = false;
    }
}

// Función para mostrar el modal de agregar
window.showAddModal = function(folder) {
    resetAddForm();
    isAdding = false;
    preselectedFolder = folder || null;
    
    const submitBtn = document.querySelector('#add-script-form button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Script';
        submitBtn.disabled = false;
    }
    
    const statusEl = document.getElementById('add-form-status');
    if (statusEl) {
        statusEl.textContent = '';
        statusEl.style.cssText = '';
        statusEl.style.display = 'none';
    }
    
    showAddStep(1);
    
    const newId = generateScriptId();
    document.getElementById('add-script-id').value = newId;
    
    document.getElementById('add-script-title').value = '';
    document.getElementById('add-script-author').value = '';
    document.getElementById('add-script-category').value = '';
    document.getElementById('add-script-notes').value = '';
    
    const folderInput = document.getElementById('add-script-folder');
    if (folderInput) {
        if (preselectedFolder && preselectedFolder !== 'General') {
            folderInput.value = preselectedFolder;
        } else {
            folderInput.value = '';
        }
    }
    
    const textarea = document.getElementById('add-script-content');
    if (window.addEditor) {
        window.addEditor.setValue('');
        window.addEditor.setSize(null, null);
        window.addEditor.setOption('mode', 'javascript');
    } else {
        window.addEditor = CodeMirror.fromTextArea(textarea, {
            lineNumbers: true,
            mode: 'javascript',
            theme: 'dracula',
            lineWrapping: true,
            autoCloseBrackets: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
        });
    }
    
    addModal.style.display = 'block';
    
    setTimeout(() => {
        if (window.addEditor) window.addEditor.refresh();
    }, 100);
};

// Función para generar ID único
function generateScriptId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `script_${timestamp}_${random}`;
}

// Botón expandir editor para agregar
document.getElementById('expand-add-editor-btn')?.addEventListener('click', () => {
    const wrapper = document.querySelector('#add-step-1 .code-mirror-wrapper');
    
    if (!wrapper.classList.contains('expanded')) {
        wrapper.classList.add('expanded');
        isAddEditorExpanded = true;
        
        const exitBtn = document.createElement('button');
        exitBtn.className = 'expand-exit-btn';
        exitBtn.innerHTML = '<i class="fas fa-compress"></i> Salir';
        exitBtn.onclick = (e) => {
            e.stopPropagation();
            exitAddExpandMode();
        };
        wrapper.appendChild(exitBtn);
    } else {
        exitAddExpandMode();
    }
    
    setTimeout(() => {
        if (window.addEditor) window.addEditor.refresh();
    }, 100);
});

// Función para cambiar de paso (versión agregar)
function showAddStep(stepNumber) {
    const step1 = document.getElementById('add-step-1');
    const step2 = document.getElementById('add-step-2');
    const indicators = document.querySelectorAll('.add-step-indicator');
    
    exitAddExpandMode();
    
    if (stepNumber === 1) {
        if (step1) step1.classList.add('active');
        if (step2) step2.classList.remove('active');
        setTimeout(() => window.addEditor?.refresh(), 100);
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

// Función para mostrar mensajes de estado (versión agregar)
// ELIMINADA - ya no se usa

// Función para actualizar modo de syntax según categoría
window.updateAddEditorMode = function(category) {
    if (window.addEditor) {
        const mode = getModeFromCategory(category);
        window.addEditor.setOption('mode', mode);
    }
};

// Helper para obtener modo de syntax
function getModeFromCategory(category) {
    const modes = {
        'JavaScript': 'javascript',
        'Python': 'python',
        'PHP': 'php',
        'HTML': 'htmlmixed',
        'CSS': 'css',
        'JSON': 'javascript',
        'TypeScript': 'javascript',
        'C': 'clike',
        'C#': 'clike',
        'C++': 'clike',
        'Java': 'clike',
        'GdScript': 'javascript',
        'Dart': 'javascript',
        'Bash': 'shell',
        'Powershell': 'shell'
    };
    return modes[category] || 'javascript';
}

// ============================================================
// SUBMIT DEL FORMULARIO DE AGREGAR - CORREGIDO (SIN MENSAJES)
// ============================================================
document.getElementById('add-script-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (isAdding) return;
    
    const scriptId = document.getElementById('add-script-id').value;
    const title = document.getElementById('add-script-title').value.trim();
    const category = document.getElementById('add-script-category').value;
    const author = document.getElementById('add-script-author').value.trim();
    const content = window.addEditor ? window.addEditor.getValue() : document.getElementById('add-script-content').value;
    const notes = document.getElementById('add-script-notes').value || '';
    const folder = document.getElementById('add-script-folder').value.trim() || 'General';
    
    if (!title || !category || !content || !content.trim()) {
        // Solo mostrar error en la consola, no en pantalla
        console.warn('Campos requeridos faltantes');
        return;
    }
    
    const newScript = {
        title,
        author: author || 'Anónimo',
        category,
        content,
        notes,
        folder,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    
    isAdding = true;
    const submitBtn = document.querySelector('#add-script-form button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    submitBtn.disabled = true;
    
    try {
        const scriptsRef = getScriptsRef();
        await scriptsRef.doc(scriptId).set(newScript);
        
        setTimeout(() => {
            closeAddModal();
            if (typeof window.reloadScripts === 'function') {
                window.reloadScripts();
            }
        }, 1500);
        
    } catch (error) {
        console.error('Error al agregar:', error);
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        isAdding = false;
    }
});

// Eventos del modal de agregar
document.querySelectorAll('.add-close, .btn-cancel-add').forEach(btn => {
    btn.addEventListener('click', closeAddModal);
});

// Cerrar al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target === addModal) {
        closeAddModal();
    }
});

// Botones de navegación para agregar
document.querySelectorAll('.btn-next-step-add').forEach(btn => {
    btn.addEventListener('click', () => showAddStep(2));
});

document.querySelectorAll('.btn-prev-step-add').forEach(btn => {
    btn.addEventListener('click', () => showAddStep(1));
});

// Clic en indicadores para agregar
document.querySelectorAll('.add-step-indicator').forEach(indicator => {
    indicator.addEventListener('click', () => {
        const step = parseInt(indicator.getAttribute('data-step'));
        showAddStep(step);
    });
});

// Actualizar modo del editor cuando cambia la categoría
document.getElementById('add-script-category')?.addEventListener('change', (e) => {
    window.updateAddEditorMode(e.target.value);
});

// Función para obtener carpetas existentes (autocompletado)
async function getExistingFolders() {
    try {
        const scriptsRef = getScriptsRef();
        const snapshot = await scriptsRef.get();
        const folders = new Set();
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.folder) {
                folders.add(data.folder);
            }
        });
        return Array.from(folders).sort();
    } catch (error) {
        console.error('Error obteniendo carpetas:', error);
        return [];
    }
}

// Autocompletado para el campo de carpeta
document.getElementById('add-script-folder')?.addEventListener('focus', async function() {
    let datalist = document.getElementById('folder-suggestions');
    if (!datalist) {
        datalist = document.createElement('datalist');
        datalist.id = 'folder-suggestions';
        this.setAttribute('list', 'folder-suggestions');
        document.body.appendChild(datalist);
    }
    
    const folders = await getExistingFolders();
    datalist.innerHTML = folders.map(f => `<option value="${f}">`).join('');
});

console.log('Agregador de scripts cargado correctamente');
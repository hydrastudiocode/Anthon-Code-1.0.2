// ========== EDITOR CODEMIRROR 5 OPTIMIZADO ==========
let contentEditor = null;
let editEditor = null;
let modalViewerEditor = null;

// Configuración BASE optimizada (reutilizable)
const baseOptimizedConfig = {
    // === RENDIMIENTO CRÍTICO ===
    lineWrapping: false,           // Desactiva salto de línea (mejora MUCHO el rendimiento)
    viewportMargin: 20,            // Reduce renderizado (Infinity = lento, 20 = rápido)
    foldGutter: false,             // Desactiva plegado de código
    highlightSelectionMatches: false, // Desactiva resaltado de coincidencias
    autocomplete: false,           // Desactiva autocompletado
    
    // === GUTTERS (solo números de línea) ===
    gutters: ["CodeMirror-linenumbers"],
    
    // === ESENCIALES ===
    lineNumbers: true,
    theme: 'dracula',
    autoCloseBrackets: true,
    indentUnit: 4,
    tabSize: 4,
    matchBrackets: true,
    dragDrop: false,               // Desactiva drag & drop
    scrollbarStyle: 'native',      // Usa scrollbar nativo (más rápido)
    
    // === OPTIMIZACIONES ADICIONALES ===
    electricChars: false,          // Desactiva auto-indentación compleja
    smartIndent: false,            // Desactiva indentación inteligente
    showCursorWhenSelecting: false,
    styleActiveLine: false,        // Desactiva línea activa
    extraKeys: {}
};

// Configuración para EDITAR (con Ctrl+S)
const editableConfig = {
    ...baseOptimizedConfig,
    extraKeys: { 
        "Ctrl-S": (cm) => {
            const form = cm.getTextArea().closest('form');
            if (form) form.dispatchEvent(new Event('submit'));
        }
    }
};

// Configuración para SOLO LECTURA (modal)
const readOnlyConfig = {
    ...baseOptimizedConfig,
    readOnly: true,
    viewportMargin: 10,            // Aún más agresivo para el modal
    gutters: ["CodeMirror-linenumbers"]
};

export function getModeFromCategory(category) {
    const modes = {
        'JavaScript': 'javascript', 'Python': 'python', 'PHP': 'php',
        'C': 'text/x-csrc', 'C++': 'text/x-c++src', 'C#': 'text/x-csharp',
        'HTML': 'htmlmixed', 'CSS': 'css', 'FireBase': 'application/json',
        'GdScript': 'python', 'Otro': 'javascript'
    };
    return modes[category] || 'javascript';
}

// Función para aplicar modo de lenguaje con throttling
let pendingModeChange = null;
function applyModeWithDelay(editor, mode, delay = 100) {
    if (pendingModeChange) clearTimeout(pendingModeChange);
    pendingModeChange = setTimeout(() => {
        if (editor) editor.setOption('mode', mode);
        pendingModeChange = null;
    }, delay);
}

// Inicializar editor para AGREGAR script
export function initCodeMirror() {
    const textarea = document.getElementById('script-content');
    if (textarea && !contentEditor) {
        contentEditor = CodeMirror.fromTextArea(textarea, editableConfig);
        
        const categorySelect = document.getElementById('script-category');
        if (categorySelect) {
            categorySelect.addEventListener('change', () => {
                const mode = getModeFromCategory(categorySelect.value);
                applyModeWithDelay(contentEditor, mode);
            });
        }
    }
    return contentEditor;
}

// Inicializar editor para EDITAR script
export function initEditCodeMirror() {
    const editTextarea = document.getElementById('edit-script-content');
    if (editTextarea && !editEditor) {
        editEditor = CodeMirror.fromTextArea(editTextarea, editableConfig);
        
        const editCategory = document.getElementById('edit-script-category');
        if (editCategory) {
            editCategory.addEventListener('change', () => {
                const mode = getModeFromCategory(editCategory.value);
                applyModeWithDelay(editEditor, mode);
            });
        }
    }
    return editEditor;
}

// Inicializar editor para MODAL (solo lectura)
export function initModalViewer() {
    const container = document.getElementById('modal-editor-container');
    if (container && !modalViewerEditor) {
        modalViewerEditor = CodeMirror(container, readOnlyConfig);
    }
    return modalViewerEditor;
}

// Getters
export function getContentEditor() { return contentEditor; }
export function getEditEditor() { return editEditor; }
export function getModalViewerEditor() { return modalViewerEditor; }

// Función para actualizar el modo de lenguaje (útil si cambia dinámicamente)
export function updateEditorMode(editor, category) {
    if (editor) {
        const mode = getModeFromCategory(category);
        applyModeWithDelay(editor, mode);
    }
}

// Función para refrescar el editor (útil después de cambios de tamaño)
export function refreshEditor(editor) {
    if (editor) {
        setTimeout(() => editor.refresh(), 50);
    }
}

// Función optimizada para limpiar el editor
export function clearEditor(editor) {
    if (editor) {
        editor.setValue('');
        editor.clearHistory();  // Limpia el historial de deshacer
    }
}

// Cargar script para editar
export function loadScriptForEditing(id, script) {
    const editSection = document.getElementById('edit-script-section');
    if (editSection) editSection.style.display = 'block';
    
    const idField = document.getElementById('edit-script-id');
    const titleField = document.getElementById('edit-script-title');
    const authorField = document.getElementById('edit-script-author');
    const notesField = document.getElementById('edit-script-notes');
    const categoryField = document.getElementById('edit-script-category');
    
    if (idField) idField.value = id;
    if (titleField) titleField.value = script.title;
    if (authorField) authorField.value = script.author || '';
    if (notesField) notesField.value = script.notes || '';
    if (categoryField) categoryField.value = script.category;
    
    if (!editEditor) initEditCodeMirror();
    
    // Usar requestAnimationFrame para mejor rendimiento
    requestAnimationFrame(() => {
        if (editEditor) {
            editEditor.setValue(script.content || '');
            const mode = getModeFromCategory(script.category);
            editEditor.setOption('mode', mode);
            // Refrescar después de cambiar contenido
            setTimeout(() => editEditor.refresh(), 10);
        }
    });
}
import { getScriptsRef } from './firebase-init.js';
import { showScriptModal, showNotification } from './ui-modal.js';

// ============================================================
// FUNCIONES UTILITARIAS
// ============================================================

function getLanguageLogo(language) {
    const logos = {
        'JavaScript': 'assets/javaScript.png',
        'Python': 'assets/python.png',
        'PHP': 'assets/php.png',
        'C': 'assets/c.png',
        'C#': 'assets/c2.png',
        'C++': 'assets/c3.png',
        'HTML': 'assets/html.png',
        'CSS': 'assets/css.png',
        'JSON': 'assets/json.svg',
        'TypeScript': 'assets/typescript.svg',
        'Java': 'assets/java.svg',
        'GdScript': 'assets/gd.png',
        'Bash': 'assets/bash.svg',
        'Docker': 'assets/docker.svg',
        'React': 'assets/react.svg',
        'Vue': 'assets/vue.svg',
        'Angular': 'assets/angular.svg',
        'GitHub': 'assets/github3.svg',
        'Git': 'assets/git.svg',
        'Google': 'assets/google.svg',
        'Microsoft': 'assets/microsoft.svg',
        'Meta': 'assets/meta.svg',
        'Spotify': 'assets/spotify.svg',
        'Discord': 'assets/discord.svg',
        'Slack': 'assets/slack.svg',
        'Figma': 'assets/figma.svg',
        'Stripe': 'assets/stripe.svg',
        'Vercel': 'assets/vercel.svg',
        'Next.js': 'assets/nextjs.svg',
        'Rust': 'assets/rust.svg',
        'Supabase': 'assets/supabase.svg',
        'PostgreSQL': 'assets/postgresql.svg',
        'MongoDB': 'assets/mongodb.svg',
        'Redis': 'assets/redis.svg',
        'Linux': 'assets/linux.svg',
        'AWS': 'assets/aws.svg',
        'Cloudfare': 'assets/cloudfare.svg',
        'Swift': 'assets/swift.svg',
        'Android': 'assets/android.svg',
        'AndroidStudio': 'assets/androidstudio.svg',
        'DotEnv': 'assets/dotenv.svg',
        'Apache': 'assets/apache.svg',
        'Astro': 'assets/astro.svg',
        'Django': 'assets/django.svg',
        'N8N': 'assets/n8n2.svg',
        'FastApi': 'assets/fastapi.svg',
        'Flutter': 'assets/flutter.svg',
        'AssemblyScript': 'assets/assemblyscript.svg',
        'Css-New': 'assets/css-new.svg',
        'Dart': 'assets/dart.svg',
        'Kotlin': 'assets/kotlin.svg',
        'Ocaml': 'assets/ocaml.svg',
        'Perl': 'assets/perl.svg',
        'Powershell': 'assets/powershell.svg',
        'Windows': 'assets/windows.svg',
        'Ruby': 'assets/ruby.svg',
        'SVG': 'assets/svg.svg',
        'Cobol': 'assets/cobol.svg',
        '.NET': 'assets/microsoft-dotnet.svg',
        'Otro': 'assets/logowar.png'
    };
    return logos[language] || logos['Otro'];
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getSafeFileName(title, category) {
    const cleanTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const extension = getFileExtension(category);
    return `${cleanTitle}.${extension}`;
}

function getFileExtension(category) {
    const extensions = {
        'JavaScript': 'js', 'Python': 'py', 'PHP': 'php', 'C': 'c', 'C#': 'cs',
        'C++': 'cpp', 'HTML': 'html', 'CSS': 'css', 'JSON': 'json', 'TypeScript': 'ts',
        'Java': 'java', 'Kotlin': 'kt', 'Ruby': 'rb', 'Swift': 'swift', 'Rust': 'rs',
        'Bash': 'sh', 'Powershell': 'ps1', 'Dart': 'dart', 'GdScript': 'gd'
    };
    return extensions[category] || 'txt';
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'download-toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--accent-primary);
        color: #000;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 500;
        z-index: 9999;
        animation: fadeInOut 2s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

async function copyScriptContent(script) {
    const content = script.content || '';
    try {
        await navigator.clipboard.writeText(content);
        showToast('Copiado: ' + script.title);
    } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = content;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Copiado: ' + script.title);
    }
}

function downloadScriptFile(script) {
    const fileName = getSafeFileName(script.title, script.category);
    const content = script.content || '';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Descargar: ' + script.title);
}

// ============================================================
// MOSTRAR SPINNER DE CARGA
// ============================================================

function showLoadingSpinner(container) {
    if (!container) return;
    container.innerHTML = `
        <div class="loading-spinner-container">
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Cargando...</p>
            </div>
        </div>
    `;
}

// ============================================================
// CREAR ELEMENTO DE SCRIPT
// ============================================================

async function createScriptElement(id, script) {
    const scriptElement = document.createElement('div');
    scriptElement.className = 'script-card';
    scriptElement.setAttribute('data-id', id);
    
    const title = escapeHtml(script.title);
    const author = script.author ? escapeHtml(script.author) : 'Autor no especificado';
    const category = escapeHtml(script.category);
    const logoUrl = getLanguageLogo(script.category);
    
    scriptElement.innerHTML = `
        <img src="${logoUrl}" alt="${category}" class="script-card-logo">
        <h3 class="script-card-title">${title}</h3>
        <div class="script-card-author">${author}</div>
        <div class="script-card-category">${category}</div>
        <div class="script-card-actions">
            <button class="script-action-btn view-btn" data-id="${id}" title="Ver código">
                <i class="fas fa-eye"></i>
            </button>
            <button class="script-action-btn copy-btn" data-id="${id}" title="Copiar código">
                <i class="fas fa-copy"></i>
            </button>
            <button class="script-action-btn download-btn" data-id="${id}" title="Descargar">
                <i class="fas fa-download"></i>
            </button>
        </div>
    `;
    
    const viewBtn = scriptElement.querySelector('.view-btn');
    viewBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await showScriptModal(id, script);
    });
    
    const copyBtn = scriptElement.querySelector('.copy-btn');
    copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyScriptContent(script);
    });
    
    const downloadBtn = scriptElement.querySelector('.download-btn');
    downloadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        downloadScriptFile(script);
    });
    
    scriptElement.addEventListener('click', async () => {
        await showScriptModal(id, script);
    });
    
    return scriptElement;
}

// ============================================================
// RENDERIZAR CARPETAS - USA folders-container
// ============================================================

export async function renderFolders() {
    const foldersContainer = document.getElementById('folders-container');
    const scriptsContainer = document.getElementById('scripts-container');
    
    if (!foldersContainer) {
        console.error('folders-container no encontrado');
        return;
    }
    
    // Ocultar scripts-container, mostrar folders-container
    if (scriptsContainer) scriptsContainer.style.display = 'none';
    foldersContainer.style.display = 'grid';
    
    // Mostrar spinner
    showLoadingSpinner(foldersContainer);
    
    const scriptsRef = getScriptsRef();
    
    try {
        const snapshot = await scriptsRef.get();
        const folderMap = new Map();
        const allFolders = new Set();
        
        snapshot.forEach(doc => {
            const data = doc.data();
            const folder = data.folder || 'General';
            
            if (data.category === 'Carpeta' && folder !== 'General' && folder !== 'Sin categoría') {
                allFolders.add(folder);
            }
            
            if (data.category !== 'Carpeta' && folder !== 'General' && folder !== 'Sin categoría') {
                if (!folderMap.has(folder)) {
                    folderMap.set(folder, 0);
                }
                folderMap.set(folder, folderMap.get(folder) + 1);
                allFolders.add(folder);
            }
        });
        
        const folders = Array.from(allFolders).sort();
        
        // Limpiar contenedor
        foldersContainer.innerHTML = '';
        
        if (folders.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-folder-message';
            emptyDiv.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);';
            emptyDiv.innerHTML = `
                <i class="fas fa-folder-open" style="font-size: 3rem; display: block; margin-bottom: 16px;"></i>
                <p style="font-size: 1rem; margin-bottom: 16px;">No hay carpetas disponibles</p>
             
            `;
            foldersContainer.appendChild(emptyDiv);
            return;
        }
        
        // Crear tarjetas de carpetas
        for (const folder of folders) {
            const count = folderMap.get(folder) || 0;
            
            const folderCard = document.createElement('div');
            folderCard.className = 'folder-card';
            folderCard.dataset.folder = folder;
            
            folderCard.innerHTML = `
                <div class="folder-icon">
                    <i class="fas fa-folder"></i>
                </div>
                <div class="folder-info">
                    <h3 class="folder-name">${escapeHtml(folder)}</h3>
                    <span class="folder-count">${count} script${count !== 1 ? 's' : ''}</span>
                </div>
                <button class="folder-delete-btn" data-folder="${escapeHtml(folder)}" title="Eliminar carpeta">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            folderCard.addEventListener('click', (e) => {
                if (e.target.closest('.folder-delete-btn')) return;
                if (typeof window.navigateToFolder === 'function') {
                    window.navigateToFolder(folder);
                }
            });
            
            const deleteBtn = folderCard.querySelector('.folder-delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (typeof window.showDeleteFolderModal === 'function') {
                        window.showDeleteFolderModal(folder);
                    }
                });
            }
            
            foldersContainer.appendChild(folderCard);
        }
        
    } catch (error) {
        console.error('Error cargando carpetas:', error);
        foldersContainer.innerHTML = '<p class="error-message">Error al cargar las carpetas</p>';
    }
}

// ============================================================
// CARGAR SCRIPTS EN CARPETA - USA scripts-container
// ============================================================

export async function loadScriptsInFolder(folder) {
    const scriptsRef = getScriptsRef();
    const scriptsContainer = document.getElementById('scripts-container');
    const foldersContainer = document.getElementById('folders-container');
    const folderNameEl = document.getElementById('current-folder-name');
    const emptyMessageEl = document.getElementById('empty-folder-message-sidebar');
    
    if (!scriptsContainer) return;
    
    // Ocultar folders-container, mostrar scripts-container
    if (foldersContainer) foldersContainer.style.display = 'none';
    scriptsContainer.style.display = 'grid';
    
    // Mostrar spinner
    showLoadingSpinner(scriptsContainer);
    
    if (folderNameEl) folderNameEl.textContent = folder;
    
    try {
        const allSnapshot = await scriptsRef.get();
        const folderScripts = [];
        
        allSnapshot.forEach(doc => {
            const data = doc.data();
            if ((data.folder || 'General') === folder && data.category !== 'Carpeta') {
                folderScripts.push({ id: doc.id, ...data });
            }
        });
        
        folderScripts.sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(0);
            const dateB = b.createdAt?.toDate?.() || new Date(0);
            return dateB - dateA;
        });
        
        if (emptyMessageEl) {
            emptyMessageEl.style.display = folderScripts.length === 0 ? 'flex' : 'none';
        }
        
        // Limpiar contenedor
        scriptsContainer.innerHTML = '';
        
        if (folderScripts.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-folder-message';
            emptyDiv.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);';
            emptyDiv.innerHTML = `
                <i class="fas fa-folder-open" style="font-size: 3rem; display: block; margin-bottom: 16px;"></i>
                <p style="font-size: 1rem; margin-bottom: 16px;">Esta carpeta esta vacia</p>
            
            `;
            scriptsContainer.appendChild(emptyDiv);
            return;
        }
        
        // Agregar scripts directamente al contenedor
        for (const script of folderScripts) {
            const element = await createScriptElement(script.id, script);
            scriptsContainer.appendChild(element);
        }
        
    } catch (error) {
        console.error('Error cargando scripts de carpeta:', error);
        scriptsContainer.innerHTML = '<p class="error-message">Error al cargar scripts de esta carpeta</p>';
        if (emptyMessageEl) emptyMessageEl.style.display = 'none';
    }
}

// ============================================================
// LOAD SCRIPTS PRINCIPAL
// ============================================================

export async function loadScripts(searchTerm = '', folder = null) {
    // Si hay una carpeta específica, cargar scripts de esa carpeta
    if (folder) {
        await loadScriptsInFolder(folder);
        return;
    }
    
    // Si se está buscando
    if (searchTerm && searchTerm.trim() !== '') {
        await loadSearchResults(searchTerm);
        return;
    }
    
    // Por defecto: mostrar carpetas
    await renderFolders();
}

// ============================================================
// BÚSQUEDA - USA scripts-container
// ============================================================

// ============================================================
// BÚSQUEDA - USA scripts-container
// ============================================================

async function loadSearchResults(searchTerm) {
    const scriptsRef = getScriptsRef();
    const scriptsContainer = document.getElementById('scripts-container');
    const foldersContainer = document.getElementById('folders-container');
    
    if (!scriptsContainer) return;
    
    // Ocultar folders-container, mostrar scripts-container
    if (foldersContainer) foldersContainer.style.display = 'none';
    scriptsContainer.style.display = 'grid';
    
    // Mostrar spinner
    showLoadingSpinner(scriptsContainer);
    
    try {
        const snapshot = await scriptsRef.get();
        const results = [];
        const term = searchTerm.toLowerCase();
        
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.category === 'Carpeta') return;
            
            const matches = data.title.toLowerCase().includes(term) ||
                           (data.author && data.author.toLowerCase().includes(term)) ||
                           (data.content && data.content.toLowerCase().includes(term));
            
            if (matches) {
                results.push({ id: doc.id, ...data });
            }
        });
        
        // ACTUALIZAR SIDEBAR CON RESULTADOS DE BÚSQUEDA
        if (typeof window.updateSearchNavigation === 'function') {
            window.updateSearchNavigation(searchTerm, results.length);
        }
        
        scriptsContainer.innerHTML = '';
        
        if (results.length === 0) {
            // Solo mostrar mensaje en el main (el sidebar ya muestra el mensaje)
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-search-message';
            emptyDiv.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);';
            emptyDiv.innerHTML = `
                <i class="fas fa-search" style="font-size: 3rem; display: block; margin-bottom: 16px;"></i>
                <p style="font-size: 1rem; margin-bottom: 16px;">No se encontraron resultados</p>
            `;
            scriptsContainer.appendChild(emptyDiv);
            return;
        }
        
        // Ya no mostramos el header en el main, solo los resultados
        // Agregar scripts directamente
        for (const script of results) {
            const element = await createScriptElement(script.id, script);
            scriptsContainer.appendChild(element);
        }
        
    } catch (error) {
        console.error('Error en búsqueda:', error);
        scriptsContainer.innerHTML = '<p class="error-message">Error al buscar</p>';
        if (typeof window.updateSearchNavigation === 'function') {
            window.updateSearchNavigation(null, 0);
        }
    }
}

// ============================================================
// ELIMINAR CARPETA
// ============================================================

export async function deleteFolder(folderName) {
    const scriptsRef = getScriptsRef();
    try {
        const snapshot = await scriptsRef.where('folder', '==', folderName).get();
        
        if (snapshot.empty) {
            showNotification('No hay scripts en esta carpeta', 'info');
            return false;
        }
        
        const batch = firebase.firestore().batch();
        snapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        
        await batch.commit();
        
        return true;
    } catch (error) {
        console.error('Error eliminando carpeta:', error);
        showNotification('Error al eliminar la carpeta', 'error');
        throw error;
    }
}

// ============================================================
// EXPORTAR FUNCIONES GLOBALES
// ============================================================

window.navigateToFolder = function(folder) {
    window.currentFolder = folder;
    if (typeof window.updateAddButton === 'function') {
        window.updateAddButton();
    }
    loadScripts('', folder);
};

window.reloadScripts = function() {
    const folder = window.currentFolder;
    if (folder) {
        loadScripts('', folder);
    } else {
        loadScripts();
    }
    if (typeof window.updateAddButton === 'function') {
        window.updateAddButton();
    }
};
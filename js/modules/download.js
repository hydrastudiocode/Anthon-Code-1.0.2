import { showNotification } from './ui-modal.js';

function getFileExtension(category) {
    const extensions = {
        'C': 'c', 'C#': 'cs', 'C++': 'cpp', 'JavaScript': 'js',
        'FireBase': 'json', 'Python': 'py', 'PHP': 'php',
        'GdScript': 'gd', 'HTML': 'html', 'CSS': 'css', 'Otro': 'txt'
    };
    return extensions[category] || 'txt';
}

export function downloadScript(content, title, category) {
    const extension = getFileExtension(category);
    const cleanTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `${cleanTitle}.${extension}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification(`Descargado: ${fileName}`, 'success');
}
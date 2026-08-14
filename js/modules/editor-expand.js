export function setupExpandEditor(editor, containerId, buttonId) {
    const expandBtn = document.getElementById(buttonId);
    if (!expandBtn || !editor) return;
    
    let isExpanded = false;
    
    expandBtn.addEventListener('click', () => {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        if (!isExpanded) {
            container.classList.add('expanded');
            expandBtn.innerHTML = '<i class="fas fa-compress"></i> Contraer';
            isExpanded = true;
            
            const exitBtn = document.createElement('button');
            exitBtn.id = 'exit-expand-btn';
            exitBtn.className = 'expand-exit-btn';
            exitBtn.innerHTML = '<i class="fas fa-times"></i> Salir';
            exitBtn.onclick = () => {
                container.classList.remove('expanded');
                expandBtn.innerHTML = '<i class="fas fa-expand"></i> Expandir editor';
                isExpanded = false;
                exitBtn.remove();
                editor.refresh();
            };
            document.body.appendChild(exitBtn);
        } else {
            container.classList.remove('expanded');
            expandBtn.innerHTML = '<i class="fas fa-expand"></i> Expandir editor';
            isExpanded = false;
            const exitBtn = document.getElementById('exit-expand-btn');
            if (exitBtn) exitBtn.remove();
        }
        setTimeout(() => editor.refresh(), 100);
    });
}
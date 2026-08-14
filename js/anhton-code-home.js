document.addEventListener('DOMContentLoaded', function() {
const languages = [
    // ==================== LENGUAJES ====================
    { id: 'all', name: 'General', icon: 'assets/logowar.png', color: '#f8cb02', isImage: true, category: 'lenguajes' },
    { id: 'JavaScript', name: 'JavaScript', icon: 'assets/JavaScript.png', color: '#f7df1e', isImage: true, category: 'lenguajes' },
    { id: 'TypeScript', name: 'TypeScript', icon: 'assets/typescript.svg', color: '#3178C6', isImage: true, category: 'lenguajes' },
    { id: 'Python', name: 'Python', icon: 'assets/python.png', color: '#3776AB', isImage: true, category: 'lenguajes' },
    { id: 'PHP', name: 'PHP', icon: 'assets/php.png', color: '#777BB4', isImage: true, category: 'lenguajes' },
    { id: 'Java', name: 'Java', icon: 'assets/java.svg', color: '#007396', isImage: true, category: 'lenguajes' },
    { id: 'C', name: 'C', icon: 'assets/c.png', color: '#00599C', isImage: true, category: 'lenguajes' },
    { id: 'C++', name: 'C++', icon: 'assets/c3.png', color: '#00599C', isImage: true, category: 'lenguajes' },
    { id: 'C#', name: 'C#', icon: 'assets/c2.png', color: '#68217A', isImage: true, category: 'lenguajes' },
    { id: 'Rust', name: 'Rust', icon: 'assets/rust.svg', color: '#ffffff', isImage: true, category: 'lenguajes' },
    { id: 'Ruby', name: 'Ruby', icon: 'assets/ruby.svg', color: '#CC342D', isImage: true, category: 'lenguajes' },
    { id: 'Swift', name: 'Swift', icon: 'assets/swift.svg', color: '#F05138', isImage: true, category: 'lenguajes' },
    { id: 'Kotlin', name: 'Kotlin', icon: 'assets/kotlin.svg', color: '#740dd4', isImage: true, category: 'lenguajes' },
    { id: 'Dart', name: 'Dart', icon: 'assets/dart.svg', color: '#00B4AB', isImage: true, category: 'lenguajes' },
    { id: 'Go', name: 'Go', icon: 'assets/go.svg', color: '#dff0f5', isImage: true, category: 'lenguajes' },
    { id: 'Cobol', name: 'Cobol', icon: 'assets/cobol.svg', color: '#007694', isImage: true, category: 'lenguajes' },
    { id: 'GdScript', name: 'GdScript', icon: 'assets/gd.png', color: '#478CBF', isImage: true, category: 'lenguajes' },
    { id: 'HTML', name: 'HTML', icon: 'assets/html.png', color: '#E34F26', isImage: true, category: 'lenguajes' },
    { id: 'CSS', name: 'CSS', icon: 'assets/css.png', color: '#1572B6', isImage: true, category: 'lenguajes' },
    { id: 'Bash', name: 'Bash', icon: 'assets/bash.svg', color: '#4EAA25', isImage: true, category: 'lenguajes' },
    { id: 'Powershell', name: 'Powershell', icon: 'assets/powershell.svg', color: '#5391FE', isImage: true, category: 'lenguajes' },
    { id: 'Perl', name: 'Perl', icon: 'assets/perl.svg', color: '#39457E', isImage: true, category: 'lenguajes' },
    { id: 'Ocaml', name: 'Ocaml', icon: 'assets/ocaml.svg', color: '#EC6813', isImage: true, category: 'lenguajes' },
    { id: 'AssemblyScript', name: 'AssemblyScript', icon: 'assets/assemblyscript.svg', color: '#007AAC', isImage: true, category: 'lenguajes' },
    { id: 'JSON', name: 'JSON', icon: 'assets/format-json-online.svg', color: '#00aa25', isImage: true, category: 'lenguajes' },
    { id: 'SVG', name: 'SVG', icon: 'assets/svg.svg', color: '#FFB13B', isImage: true, category: 'lenguajes' },
    
    // ==================== FRAMEWORKS ====================
    { id: 'React', name: 'React', icon: 'assets/react.svg', color: '#61DAFB', isImage: true, category: 'frameworks' },
    { id: 'Next.js', name: 'Next.js', icon: 'assets/nextdotjs.svg', color: '#000000', isImage: true, category: 'frameworks' },
    { id: 'Vue', name: 'Vue', icon: 'assets/vue.svg', color: '#4FC08D', isImage: true, category: 'frameworks' },
    { id: 'Angular', name: 'Angular', icon: 'assets/angular.svg', color: '#DD0031', isImage: true, category: 'frameworks' },
    { id: 'Django', name: 'Django', icon: 'assets/django.svg', color: '#00aa25', isImage: true, category: 'frameworks' },
    { id: 'Flutter', name: 'Flutter', icon: 'assets/flutter.svg', color: '#02569B', isImage: true, category: 'frameworks' },
    { id: 'FastApi', name: 'FastApi', icon: 'assets/fastapi.svg', color: '#009688', isImage: true, category: 'frameworks' },
    { id: 'Net', name: '.NET', icon: 'assets/microsoft-dotnet.svg', color: '#512BD4', isImage: true, category: 'frameworks' },
    { id: 'N8N', name: 'N8N', icon: 'assets/n8n.svg', color: '#df270f', isImage: true, category: 'frameworks' },
    { id: 'Bootstrap', name: 'Bootstrap', icon: 'assets/bootstrap.svg', color: '#7952B3', isImage: true, category: 'frameworks' },
    { id: 'Astro', name: 'Astro', icon: 'assets/astro.svg', color: '#FF5D01', isImage: true, category: 'frameworks' },
    { id: 'Blitz', name: 'Blitz', icon: 'assets/blitz.svg', color: '#6700EB', isImage: true, category: 'frameworks' },
    
    // ==================== HERRAMIENTAS ====================
    { id: 'Git', name: 'Git', icon: 'assets/git.svg', color: '#F05032', isImage: true, category: 'herramientas' },
    { id: 'GitHub', name: 'GitHub', icon: 'assets/github3.svg', color: '#ffffff', isImage: true, category: 'herramientas' },
    { id: 'Docker', name: 'Docker', icon: 'assets/docker.svg', color: '#2496ED', isImage: true, category: 'herramientas' },
    { id: 'Figma', name: 'Figma', icon: 'assets/figma.svg', color: '#F24E1E', isImage: true, category: 'herramientas' },
    { id: 'Vercel', name: 'Vercel', icon: 'assets/vercel.svg', color: '#ffffff', isImage: true, category: 'herramientas' },
    { id: 'AndroidStudio', name: 'Android Studio', icon: 'assets/android-studio.svg', color: '#3DDC84', isImage: true, category: 'herramientas' },
    { id: 'Apache', name: 'Apache', icon: 'assets/apache.svg', color: '#D22128', isImage: true, category: 'herramientas' },
    { id: 'Linux', name: 'Linux', icon: 'assets/linux.svg', color: '#FCC624', isImage: true, category: 'herramientas' },
    { id: 'Windows', name: 'Windows', icon: 'assets/windows.svg', color: '#0078D4', isImage: true, category: 'herramientas' },
    { id: 'Android', name: 'Android', icon: 'assets/android.svg', color: '#3DDC84', isImage: true, category: 'herramientas' },
    { id: 'DotEnv', name: 'DotEnv', icon: 'assets/dotenv.svg', color: '#ECD53F', isImage: true, category: 'herramientas' },
    { id: 'Css-New', name: 'CSS New', icon: 'assets/css-new.svg', color: '#1572B6', isImage: true, category: 'herramientas' },
    
    // ==================== UTILIDADES / SERVICIOS ====================
    { id: 'FireBase', name: 'FireBase', icon: 'assets/fire.png', color: '#FFCA28', isImage: true, category: 'utilidades' },
    { id: 'Supabase', name: 'Supabase', icon: 'assets/supabase.svg', color: '#3ECF8E', isImage: true, category: 'utilidades' },
    { id: 'MongoDB', name: 'MongoDB', icon: 'assets/mongodb.svg', color: '#47A248', isImage: true, category: 'utilidades' },
    { id: 'PostgreSQL', name: 'PostgreSQL', icon: 'assets/postgresql.svg', color: '#4169E1', isImage: true, category: 'utilidades' },
    { id: 'Redis', name: 'Redis', icon: 'assets/redis.svg', color: '#DC382D', isImage: true, category: 'utilidades' },
    { id: 'AWS', name: 'AWS', icon: 'assets/aws.svg', color: '#FF9900', isImage: true, category: 'utilidades' },
    { id: 'Cloudflare', name: 'Cloudflare', icon: 'assets/cloudflare.svg', color: '#F38020', isImage: true, category: 'utilidades' },
    { id: 'Google', name: 'Google', icon: 'assets/google.svg', color: '#4285F4', isImage: true, category: 'utilidades' },
    { id: 'Microsoft', name: 'Microsoft', icon: 'assets/microsoft.svg', color: '#5E5E5E', isImage: true, category: 'utilidades' },
    { id: 'Meta', name: 'Meta', icon: 'assets/meta.svg', color: '#0064E1', isImage: true, category: 'utilidades' },
    { id: 'Spotify', name: 'Spotify', icon: 'assets/spotify.svg', color: '#1DB954', isImage: true, category: 'utilidades' },
    { id: 'Discord', name: 'Discord', icon: 'assets/Discord.svg', color: '#5865F2', isImage: true, category: 'utilidades' },
    { id: 'Slack', name: 'Slack', icon: 'assets/slack.svg', color: '#4A154B', isImage: true, category: 'utilidades' },
    { id: 'Stripe', name: 'Stripe', icon: 'assets/stripe.svg', color: '#008CDD', isImage: true, category: 'utilidades' },
    { id: 'Claude', name: 'Claude', icon: 'assets/claude.svg', color: '#D97757', isImage: true, category: 'utilidades' },
    
    // ==================== OTROS ====================
    { id: 'Otro', name: 'Apuntes', icon: 'assets/logowar.png', color: '#f8cb02', isImage: true, category: 'otros' }
];

                // ========== GENERAR BOTONES DE FILTRO ==========
    const filterButtonsContainer = document.getElementById('filter-buttons');
    function generateFilterButtons() {
    filterButtonsContainer.innerHTML = '';
    languages.forEach(lang => {
        const btn = document.createElement('button');
        btn.className = 'filter-lang-btn';
        btn.setAttribute('data-lang', lang.id);
        // Establece el color del borde izquierdo
        btn.style.borderLeftColor = lang.color;
        
        // Guarda el color en un dataset para usarlo en hover
        btn.setAttribute('data-color', lang.color);
        
        if (lang.isImage) {
            btn.innerHTML = `
                <img src="${lang.icon}" alt="${lang.name}">
                <span>${lang.name}</span>
            `;
        } else {
            btn.innerHTML = `
                <i class="${lang.icon}" style="color: ${lang.color};"></i>
                <span>${lang.name}</span>
            `;
        }
        
        // Efecto hover con el color específico
        btn.addEventListener('mouseenter', function() {
            const color = this.getAttribute('data-color');
            this.style.boxShadow = `0 2px 12px ${color}40`; // 40 es transparencia
            this.style.borderLeftColor = color;
            this.style.filter = `drop-shadow(0 0 2px ${color}80)`;
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
            this.style.filter = '';
            // Restaura el color original 
            this.style.borderLeftColor = this.getAttribute('data-color');
        });
        
        btn.addEventListener('click', () => {
            const event = new CustomEvent('filterChange', { detail: { category: lang.id } });
            document.dispatchEvent(event);
            document.getElementById('filter-popup').classList.remove('show');
            document.querySelectorAll('.filter-lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
        
        filterButtonsContainer.appendChild(btn);
    });
}
                generateFilterButtons();

                // ========== POPUP DE FILTROS ==========
                const filterBtn = document.getElementById('filter-btn');
                const filterPopup = document.getElementById('filter-popup');
                const closeFilter = document.getElementById('close-filter');
                
                if (filterBtn) {
                    filterBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        filterPopup.classList.toggle('show');
                    });
                }
                
                if (closeFilter) {
                    closeFilter.addEventListener('click', () => {
                        filterPopup.classList.remove('show');
                    });
                }
                
                // Cerrar popup al hacer clic fuera
                document.addEventListener('click', (e) => {
                    if (!filterPopup.contains(e.target) && !filterBtn.contains(e.target)) {
                        filterPopup.classList.remove('show');
                    }
                });

                // ========== HEADER SCROLL HIDE ==========
                const header = document.getElementById('main-header');
                let lastScrollY = window.scrollY;
                let ticking = false;
                
                window.addEventListener('scroll', () => {
                    if (!ticking) {
                        requestAnimationFrame(() => {
                            if (window.scrollY > lastScrollY && window.scrollY > 80) {
                                header.classList.add('header-hidden');
                            } else if (window.scrollY < lastScrollY || window.scrollY <= 80) {
                                header.classList.remove('header-hidden');
                            }
                            lastScrollY = window.scrollY;
                            ticking = false;
                        });
                        ticking = true;
                    }
                });

                // ========== FILTRO POR LENGUAJE ==========
                const languageFilter = document.getElementById('language-filter');
                if (languageFilter) {
                    document.addEventListener('filterChange', (e) => {
                        languageFilter.value = e.detail.category;
                        languageFilter.dispatchEvent(new Event('change'));
                    });
                }
            });
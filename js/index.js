   import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
    import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
    import { firebaseConfig } from './firebase-config.js';
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const loginPanel = document.getElementById('login-panel');
    const registerPanel = document.getElementById('register-panel');
    const tabs = document.querySelectorAll('.tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const forgotLink = document.getElementById('forgot-password-link');
    

    function showToast(message, type = 'info') {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        
        let iconHtml = '';
        switch (type) {
            case 'success':
                iconHtml = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                iconHtml = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'info':
                iconHtml = '<i class="fas fa-info-circle"></i>';
                break;
            default:
                iconHtml = '<i class="fas fa-bell"></i>';
        }
        
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">${iconHtml}</div>
                <div class="toast-message">${message}</div>
                <div class="toast-close">
                    <i class="fas fa-times"></i>
                </div>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
        
        if (type === 'success') {
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.classList.remove('show');
                    setTimeout(() => {
                        if (toast.parentNode) toast.remove();
                    }, 300);
                }
            }, 5000);
        }
    }
 
    function getFriendlyErrorMessage(errorCode) {
        const errors = {
            'auth/invalid-email': 'Correo electrónico inválido. Verifica el formato.',
            'auth/user-disabled': 'Esta cuenta ha sido deshabilitada. Contacta al soporte.',
            'auth/user-not-found': 'No hay cuenta registrada con este correo electrónico.',
            'auth/wrong-password': 'Contraseña incorrecta. Intenta nuevamente.',
            'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
            'auth/email-already-in-use': 'Este correo electrónico ya está registrado.',
            'auth/weak-password': 'La contraseña es muy débil. Usa al menos 6 caracteres.',
            'auth/operation-not-allowed': 'Registro deshabilitado. Contacta al soporte.',
            'auth/missing-email': 'Ingresa tu correo electrónico.',
            'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
            'auth/internal-error': 'Error interno del servidor. Intenta más tarde.',
            'auth/invalid-credential': 'Credenciales inválidas. Verifica tus datos.'
        };
        
        return errors[errorCode] || `Error: ${errorCode}`;
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            if (targetTab === 'login') {
                loginPanel.classList.add('active-panel');
                registerPanel.classList.remove('active-panel');
            } else {
                registerPanel.classList.add('active-panel');
                loginPanel.classList.remove('active-panel');
            }
        });
    });
    
    function setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<span class="loader"></span> Cargando...';
        } else {
            button.disabled = false;
            button.innerHTML = button.id === 'login-btn' ? 'Iniciar Sesión' : 'Crear Cuenta';
        }
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const loginBtn = document.getElementById('login-btn');
        
        if (!email || !password) {
            showToast('Por favor, completa todos los campos', 'error');
            return;
        }
        
        setButtonLoading(loginBtn, true);
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Usuario logueado:', userCredential.user.email);
            showToast('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
            
            setTimeout(() => {
                window.location.href = 'anthon-code.html';
            }, 1500);
            
        } catch (error) {
            console.error('Error login:', error.code, error.message);
            const friendlyMessage = getFriendlyErrorMessage(error.code);
            showToast(friendlyMessage, 'error');
        } finally {
            setButtonLoading(loginBtn, false);
        }
    });
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const registerBtn = document.getElementById('register-btn');
        
        if (!name || !email || !password || !confirmPassword) {
            showToast('Por favor, completa todos los campos', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showToast('Las contraseñas no coinciden', 'error');
            return;
        }
        
        if (password.length < 6) {
            showToast('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }
        
        setButtonLoading(registerBtn, true);
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            await updateProfile(userCredential.user, {
                displayName: name
            });
            
            console.log('Usuario registrado:', userCredential.user.email);
            showToast('¡Cuenta creada exitosamente! Redirigiendo...', 'success');
            
            setTimeout(() => {
                window.location.href = 'anthon-code.html';
            }, 1500);
            
        } catch (error) {
            console.error('Error registro:', error.code, error.message);
            const friendlyMessage = getFriendlyErrorMessage(error.code);
            showToast(friendlyMessage, 'error');
        } finally {
            setButtonLoading(registerBtn, false);
        }
    });
    
    forgotLink.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        
        if (!email) {
            showToast('Ingresa tu correo electrónico para recuperar la contraseña', 'info');
            return;
        }
        
        try {
            await sendPasswordResetEmail(auth, email);
            showToast(`Se ha enviado un enlace de recuperación a ${email}`, 'success');
        } catch (error) {
            console.error('Error recuperación:', error.code, error.message);
            const friendlyMessage = getFriendlyErrorMessage(error.code);
            showToast(friendlyMessage, 'error');
        }
    });

    auth.onAuthStateChanged((user) => {
        if (user && (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/'))) {
            window.location.href = 'anthon-code.html';
        }
    });
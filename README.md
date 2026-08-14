# Anthon-Code 1.0.1 - Biblioteca de Codigo

![Version](https://img.shields.io/badge/version-1.0.1-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)
![Firebase](https://img.shields.io/badge/Firebase-9.22.0-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)

**Sistema completo de biblioteca de codigo** con gestion de scripts, categorización por lenguajes, resaltado de sintaxis y sistema de autenticación.

---

## 🚀 Caracteristicas

- 🚀 **Gestion completa de scripts** (CRUD)
- 🚀 **Categorizacion por lenguajes** (C, C#, C++, Python, PHP, JavaScript, HTML, CSS, GdScript, Firebase)
- 🚀 **Edita el codigo y agrega tu propio lengauje** configura la lista de leguajes en anthon-code.js
- 🚀 **Autenticacion** con Firebase
- 🚀 **Descarga de scripts** como archivos con extension automatica
- 🚀 **Copiar al portapapeles** con un clic
- 🚀 **Filtrado por lenguaje** en tiempo real
- 🚀 **Diseño responsive** para todos los dispositivos

### 🔐 Funcionalidades

| M0dulo | Descripcion |
|--------|-------------|
| **Ver Scripts** | Grid con todos los scripts guardados |
| **Agregar Script** | Formulario para añadir nuevo codigo |
| **Editar Script** | Modificar scripts existentes |
| **Eliminar Script** | Borrar scripts con confirmacion |
| **Descargar Script** | Exportar como archivo con extension correcta |
| **Copiar Script** | Copiar contenido al portapapeles |
| **Filtro por lenguaje** | Visualizar scripts por categoria |

---

### 📥 Descarga de Scripts

El sistema detecta automaticamente la extension segun el lenguaje:

| Lenguaje | Extension |
|----------|-----------|
| C | `.c` |
| C# | `.cs` |
| C++ | `.cpp` |
| JavaScript | `.js` |
| Python | `.py` |
| PHP | `.php` |
| HTML | `.html` |
| CSS | `.css` |
| GdScript | `.gd` |
| Firebase | `.json` |
| Otro | `.txt` |
| Agrega el Tuyo | `.rar` |

---

## 🛠️ Tecnologias utilizadas

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome 6 - Iconografia
- Highlight.js - Resaltado de sintaxis
- Google Fonts (Google Sans)

### Backend (Firebase)
- Firebase Authentication - Gestion de usuarios
- Cloud Firestore - Base de datos

### Herramientas
- Git & GitHub - Control de versiones
- Netlify / Vercel - Despliegue continuo

---

## 📁 Estructura del Proyecto
- AnthonCode-1.0.1/
- ├── 📄 index.html # Login / Registro de usuarios
- ├── 📄 anthon-code.html # Dashboard principal / Biblioteca
- ├── 📄 LICENCE # Tipo de Licencia del Proyecto
- ├── 📁 assets/
- │ ├── 🖼️ logowar.png # Logo principal
- │ ├── 🖼️ RestodeLogos.png # Resto de Logos e Iconos
- ├── 📁 js/
- │ ├── 📄 firebase-config.js # Configuracion de Firebase
- │ └── 📄 index.js # Logica del Login
- │ └── 📄 Anthon-Code.js # Logica principal del sistema / Aca agrega otros lenguajes
- │ └── 📄 app.js # Futuras Pruebas
- ├── 📁 rules/
- │ ├── 📄 rulesv1.txt # Primera Vers Reglas, Todos los usuarios Auth tieien acceso total
- │ ├── 📄 rulesv1.txt # Segunda Ver Reglas, Solo algunos usuarios tienen control total
- └── 📄 README.md # Este archivo

---

## 🔧 Instalacion y Configuracion para Nuevos Usuarios

### Requisitos Previos

1. Una cuenta de [Firebase](https://firebase.google.com/)
2. Un proyecto creado en Firebase Console
3. Git instalado (opcional, para clonar)

### Paso 1: Clonar o descargar el proyecto

git clone https://github.com/tuusuario/AnthonCode-1.0.1.git

### Paso 2: Configurar Firebase
2.1 Crear proyecto en Firebase
Ve a Firebase Console

Haz clic en "Crear proyecto"
Asigna un nombre (ej: "anthon-code")
Haz clic en "Crear proyecto"

### 2.2 Habilitar Authentication
En el menu izquierdo, ve a "Build" → "Authentication"

Haz clic en "Empezar"
Ve a la pestaña "Sign-in method"
Habilita "Email/Password"
Guarda los cambios

### 2.3 Crear Firestore Database
Ve a "Build" → "Firestore Database"

Haz clic en "Crear base de datos"
Selecciona "Iniciar en modo de prueba" (luego cambiaras las reglas)
Selecciona la region mas cercana
Haz clic en "Habilitar"

### 2.4 Configurar Reglas de Firestore
En la pestaña "Rules" de Firestore Database, pega las reglas segun la seguridad que desees implementar:
 -  [Reglas V.1](Rulesv1.txt)
 -  [Reglas V.2](Rulesv2.txt)

### 2.5 Obtener configuracion de Firebase
Ve a "Project Overview" (icono de ajustes ⚙️)

Haz clic en el ícono "</>" (Agregar Firebase a tu app web)
Registra la app con un nombre (ej: "anthon-code")
Copia el objeto firebaseConfig que se muestra 

### Paso 3: Configurar el archivo firebase-config.js
Abre js/firebase-config.js y reemplaza con TU configuracion:

- const firebaseConfig = {
-  apiKey: "TU_API_KEY",
-  authDomain: "TU_PROYECTO.firebaseapp.com",
-  projectId: "TU_PROYECTO",
-  storageBucket: "TU_PROYECTO.firebasestorage.app",
-  messagingSenderId: "TU_SENDER_ID",
-  appId: "TU_APP_ID",
-  measurementId: "TU_MEASUREMENT_ID"

### Paso 4: Probar localmente y Desplegar
Debido a los módulos ES6, necesitas un servidor local: Live Server, Python, Nodejs
-  python -m http.server 8000

### Abre http://localhost:8000
Luego de todas las verificaciones desplega en Netlify, Vercel o GitHub.

Muchas Gracias! sigan  [Hydra Studio Code](https://github.com/hydrastudiocode)

/* ==========================================================================
   GESTIÓN DE TEMAS (MODO OSCURO/CLARO)
   ========================================================================== */

const Theme = {
    /**
     * Inicializa la detección del tema del usuario
     */
    init() {
        // Detecta preferencia inicial del usuario
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        }

        // Escucha cambios en la preferencia de color del sistema
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', event => {
                if (event.matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            });
    },

    /**
     * Alterna manualmente entre modo claro y oscuro
     */
    toggle() {
        document.documentElement.classList.toggle('dark');
        
        // Opcional: guardar preferencia en localStorage
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    },

    /**
     * Establece un tema específico
     * @param {string} theme - 'dark' o 'light'
     */
    setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    },

    /**
     * Obtiene el tema actual
     * @returns {string} 'dark' o 'light'
     */
    getCurrentTheme() {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
};

// Inicializar el sistema de temas cuando se carga el script
Theme.init();
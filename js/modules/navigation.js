/* ==========================================================================
   SISTEMA DE NAVEGACIÓN
   ========================================================================== */

const Navigation = {
    /**
     * Inicializa el sistema de navegación
     */
    init() {
        this.setupMobileMenu();
        this.setupEventListeners();
        
        // Solo mostrar inicio si NO estamos en wiki
        const path = window.location.pathname;
        if (path.startsWith('/wiki')) {
            this.showWiki(); // Mostrar sección wiki
        } else {
            this.showHome(); // Mostrar página de inicio por defecto
        }
    },

    /**
     * Muestra la sección de inicio
     */
    showHome() {
        document.getElementById('home-content').classList.remove('hidden');
        document.getElementById('wiki-content').classList.add('hidden');
        
        // Cerrar menús móviles si están abiertos
        this.closeMobileNavMenu();
    },

    /**
     * Muestra la sección wiki
     */
    showWiki() {
        document.getElementById('home-content').classList.add('hidden');
        document.getElementById('wiki-content').classList.remove('hidden');
        
        // Cargar contenido del wiki si no está cargado
        Wiki.init();
        
        // Mostrar página de resumen por defecto
        Wiki.showPage('overview');
        
        // Cerrar menús móviles si están abiertos
        this.closeMobileNavMenu();
    },

    /**
     * Configura el menú móvil
     */
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileNavMenu = document.getElementById('mobile-nav-menu');

        if (mobileMenuBtn && mobileNavMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileNavMenu.classList.toggle('hidden');
            });
        }
    },

    /**
     * Cierra el menú de navegación móvil
     */
    closeMobileNavMenu() {
        const mobileNavMenu = document.getElementById('mobile-nav-menu');
        if (mobileNavMenu) {
            mobileNavMenu.classList.add('hidden');
        }
    },

    /**
     * Configura event listeners globales
     */
    setupEventListeners() {
        // Cerrar menú móvil al hacer click fuera
        document.addEventListener('click', (e) => {
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const mobileNavMenu = document.getElementById('mobile-nav-menu');
            
            if (mobileMenuBtn && mobileNavMenu && 
                !mobileMenuBtn.contains(e.target) && 
                !mobileNavMenu.contains(e.target)) {
                mobileNavMenu.classList.add('hidden');
            }
        });

        // Manejar tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileNavMenu();
                Wiki.closeMobileMenu();
            }
        });
    }
};
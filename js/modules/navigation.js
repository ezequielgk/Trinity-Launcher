/* ==========================================================================
   SISTEMA DE NAVEGACIÓN - VERSIÓN COMPATIBLE
   ========================================================================== */

const Navigation = {
    /**
     * MANTENER ORIGINAL - Para compatibilidad
     */
    init() {
        this.setupMobileMenu();
        this.setupEventListeners();
        
        const path = window.location.pathname;
        if (path.startsWith('/wiki')) {
            this.showWiki();
        } else {
            this.showHome();
        }
    },

    /**
     * MANTENER ORIGINAL - Mostrar inicio
     */
    showHome() {
        document.getElementById('home-content').classList.remove('hidden');
        document.getElementById('wiki-content').classList.add('hidden');
        this.closeMobileNavMenu();
    },

    /**
     * MEJORADO - Pero mantiene compatibilidad
     */
    showWiki() {
        document.getElementById('home-content').classList.add('hidden');
        document.getElementById('wiki-content').classList.remove('hidden');
        
        // Inicializar wiki (versión original)
        Wiki.init();
        
        // Mostrar página por defecto
        Wiki.showPage('overview');
        
        this.closeMobileNavMenu();
    },

    /**
     * MANTENER ORIGINAL - Setup menú móvil
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
     * MANTENER ORIGINAL - Cerrar menú móvil
     */
    closeMobileNavMenu() {
        const mobileNavMenu = document.getElementById('mobile-nav-menu');
        if (mobileNavMenu) {
            mobileNavMenu.classList.add('hidden');
        }
    },

    /**
     * MANTENER ORIGINAL - Event listeners
     */
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const mobileNavMenu = document.getElementById('mobile-nav-menu');
            
            if (mobileMenuBtn && mobileNavMenu && 
                !mobileMenuBtn.contains(e.target) && 
                !mobileNavMenu.contains(e.target)) {
                mobileNavMenu.classList.add('hidden');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileNavMenu();
                Wiki.closeMobileMenu();
            }
        });
    }
};
/* ==========================================================================
   SISTEMA WIKI/DOCUMENTACIÓN - VERSIÓN COMPATIBLE MEJORADA
   ========================================================================== */

const Wiki = {
    currentPage: null,
    pages: {},
    isInitialized: false,
    isLoading: false,

    /**
     * MÉTODO ORIGINAL - Mantener para compatibilidad
     */
    init() {
        if (!this.isInitialized) {
            this.loadWikiStructure();
            this.setupMobileWikiMenu();
            this.loadAllPages();
            this.isInitialized = true;
        }
    },

    /**
     * NUEVO - Método asíncrono mejorado
     */
    async ensureInitialized() {
        if (this.isInitialized) return;
        
        try {
            await this.initAsync();
        } catch (error) {
            console.error('Error inicializando wiki:', error);
            throw error;
        }
    },

    /**
     * NUEVO - Inicialización asíncrona
     */
    async initAsync() {
        if (this.isInitialized || this.isLoading) return;
        
        this.isLoading = true;
        
        try {
            await this.loadWikiStructure();
            this.createNavigation();
            this.setupMobileWikiMenu();
            this.isInitialized = true;
        } finally {
            this.isLoading = false;
        }
    },

    /**
     * MANTENER ORIGINAL - Para compatibilidad con HTML existente
     */
    loadWikiStructure() {
        const wikiContainer = document.getElementById('wiki-container');
        if (!wikiContainer) return;

        wikiContainer.innerHTML = `
            <!-- Mobile Wiki Header -->
            <div class="lg:hidden bg-trinity-dark border-b border-gray-700 p-4">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold text-white">Documentación</h2>
                    <button id="mobile-wiki-menu-btn" class="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-white">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Mobile Overlay -->
            <div id="mobile-wiki-overlay" class="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 hidden"></div>

            <div class="flex min-h-screen bg-trinity-darker">
                <!-- Sidebar -->
                <div id="wiki-sidebar" class="fixed lg:relative inset-y-0 left-0 z-50 w-72 lg:w-64 bg-trinity-dark border-r border-gray-700 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out">
                    <div class="p-4 h-full overflow-y-auto">
                        <!-- Close button for mobile -->
                        <div class="lg:hidden flex items-center justify-between mb-4 pb-4 border-b border-gray-600">
                            <h3 class="font-semibold text-white">Documentación</h3>
                            <button id="close-mobile-wiki-menu" class="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-sidebar-active transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <!-- Desktop title -->
                        <h3 class="hidden lg:block font-semibold text-white mb-4">Documentación</h3>

                        <nav class="space-y-1" id="wiki-navigation">
                            <!-- Navigation será poblada por JavaScript -->
                        </nav>
                    </div>
                </div>

                <!-- Wiki Content -->
                <div class="flex-1 p-4 sm:p-6 lg:p-8 bg-trinity-darker min-w-0">
                    <div id="wiki-page-content" class="wiki-page-content">
                        <!-- Page content será cargado aquí -->
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * MANTENER ORIGINAL - Para compatibilidad
     */
    loadAllPages() {
        this.pages = {};
        this.createNavigation();
    },

    /**
     * MANTENER ORIGINAL - Para compatibilidad con HTML existente
     */
    createNavigation() {
        const nav = document.getElementById('wiki-navigation');
        if (!nav) return;

        const navItems = [
            { id: 'overview', icon: '📋', title: 'Resumen', url: 'resume' },
            { id: 'getting-started', icon: '🚀', title: 'Primeros Pasos', url: 'getting-started' },
            { id: 'installation', icon: '💿', title: 'Instalación', url: 'installation' },
            { id: 'troubleshooting', icon: '🔧', title: 'Solución de Problemas', url: 'troubleshooting' },
            { id: 'faq', icon: '❓', title: 'FAQ', url: 'faq' },
            { id: 'support', icon: '🛠️', title: 'Soporte', url: 'support' }
        ];

        nav.innerHTML = navItems.map(item => `
            <button onclick="Wiki.showPageWithRouting('${item.id}')" 
                    class="wiki-nav-item w-full text-left px-3 py-3 lg:py-2 rounded text-gray-300 hover:bg-sidebar-active hover:text-white transition-colors text-base lg:text-sm" 
                    data-page="${item.id}">
                ${item.icon} ${item.title}
            </button>
        `).join('');
    },

    /**
     * MANTENER ORIGINAL - Para compatibilidad con botones existentes
     */
    showPageWithRouting(pageId) {
        // Simplificado - sin routing complejo por ahora
        this.showPage(pageId, true);
    },

    /**
     * NUEVO - Método seguro para llamadas programáticas
     */
    async showPageSafe(pageId) {
        try {
            await this.showPage(pageId);
        } catch (error) {
            console.error(`Error mostrando página ${pageId}:`, error);
            this.showErrorPage(pageId);
        }
    },

    /**
     * MEJORADO - Pero mantiene la firma original
     */
    async showPage(pageId, updateUrl = true) {
        if (this.currentPage === pageId) return;
        
        try {
            const contentContainer = document.getElementById('wiki-page-content');
            if (!contentContainer) {
                throw new Error('Contenedor de contenido no encontrado');
            }

            // Mostrar estado de carga
            contentContainer.innerHTML = `
                <div class="flex items-center justify-center p-8">
                    <div class="text-center text-white">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-trinity-purple mx-auto mb-4"></div>
                        <p>Cargando página...</p>
                    </div>
                </div>
            `;

            // Cargar contenido
            const content = await WikiLoader.loadPage(pageId);
            
            // Actualizar contenido
            contentContainer.innerHTML = content;

            // Actualizar navegación activa
            this.updateActiveNavigation(pageId);

            // Cerrar menú móvil
            this.closeMobileMenu();

            // Scroll al inicio
            contentContainer.scrollTop = 0;

            this.currentPage = pageId;

            // Actualizar SEO si es necesario
            if (updateUrl) {
                this.updateSEO(pageId);
            }

        } catch (error) {
            console.error(`Error mostrando página '${pageId}':`, error);
            this.showErrorPage(pageId);
        }
    },

    /**
     * NUEVO - Mostrar página de error
     */
    showErrorPage(pageId) {
        const contentContainer = document.getElementById('wiki-page-content');
        if (contentContainer) {
            contentContainer.innerHTML = `
                <div class="wiki-page">
                    <h1>Error al cargar la página</h1>
                    <div class="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded mb-6">
                        <p>No se pudo cargar la página solicitada: <strong>${pageId}</strong></p>
                        <p class="mt-2">Por favor, inténtalo de nuevo más tarde.</p>
                    </div>
                    <button onclick="Wiki.showPageWithRouting('overview')" class="bg-trinity-purple text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                        Volver al inicio
                    </button>
                </div>
            `;
        }
    },

    /**
     * MANTENER ORIGINAL - Actualizar SEO
     */
    updateSEO(pageId) {
        const seoData = {
            'overview': {
                title: 'Resumen - Trinity Launcher Wiki',
                description: 'Resumen completo de Trinity Launcher, el launcher open source para Minecraft Bedrock en Linux.'
            },
            'getting-started': {
                title: 'Primeros Pasos - Trinity Launcher Wiki', 
                description: 'Guía de primeros pasos para configurar Trinity Launcher en tu sistema Linux.'
            },
            'installation': {
                title: 'Instalación - Trinity Launcher Wiki',
                description: 'Guía completa para instalar Trinity Launcher en Linux.'
            },
            'troubleshooting': {
                title: 'Solución de Problemas - Trinity Launcher Wiki',
                description: 'Guía de solución de problemas comunes de Trinity Launcher.'
            },
            'faq': {
                title: 'FAQ - Trinity Launcher Wiki',
                description: 'Preguntas frecuentes sobre Trinity Launcher.'
            },
            'support': {
                title: 'Soporte - Trinity Launcher Wiki',
                description: 'Obtén ayuda técnica para Trinity Launcher.'
            }
        };

        const data = seoData[pageId];
        if (!data) return;

        document.title = data.title;

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', data.description);
        }
    },

    /**
     * MANTENER ORIGINAL - Actualizar navegación activa
     */
    updateActiveNavigation(activePageId) {
        document.querySelectorAll('.wiki-nav-item').forEach(item => {
            item.classList.remove('bg-sidebar-active', 'text-white', 'active');
            item.classList.add('text-gray-300');
        });

        const activeNavItem = document.querySelector(`[data-page="${activePageId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('bg-sidebar-active', 'text-white', 'active');
            activeNavItem.classList.remove('text-gray-300');
        }
    },

    /**
     * MANTENER ORIGINAL - Setup menú móvil
     */
    setupMobileWikiMenu() {
        setTimeout(() => {
            const mobileWikiMenuBtn = document.getElementById('mobile-wiki-menu-btn');
            const closeMobileWikiMenu = document.getElementById('close-mobile-wiki-menu');
            const mobileWikiOverlay = document.getElementById('mobile-wiki-overlay');

            if (mobileWikiMenuBtn) {
                mobileWikiMenuBtn.addEventListener('click', () => this.openMobileMenu());
            }

            if (closeMobileWikiMenu) {
                closeMobileWikiMenu.addEventListener('click', () => this.closeMobileMenu());
            }

            if (mobileWikiOverlay) {
                mobileWikiOverlay.addEventListener('click', () => this.closeMobileMenu());
            }
        }, 100);
    },

    /**
     * MANTENER ORIGINAL - Abrir menú móvil
     */
    openMobileMenu() {
        const wikiSidebar = document.getElementById('wiki-sidebar');
        const mobileWikiOverlay = document.getElementById('mobile-wiki-overlay');
        
        if (wikiSidebar) wikiSidebar.classList.remove('-translate-x-full');
        if (mobileWikiOverlay) mobileWikiOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },

    /**
     * MANTENER ORIGINAL - Cerrar menú móvil
     */
    closeMobileMenu() {
        const wikiSidebar = document.getElementById('wiki-sidebar');
        const mobileWikiOverlay = document.getElementById('mobile-wiki-overlay');
        
        if (wikiSidebar) wikiSidebar.classList.add('-translate-x-full');
        if (mobileWikiOverlay) mobileWikiOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }
};

/* ==========================================================================
   CARGADOR DE PÁGINAS WIKI MEJORADO
   ========================================================================== */

const WikiLoader = {
    cache: new Map(),
    
    async loadPage(pageId) {
        try {
            if (this.cache.has(pageId)) {
                return this.cache.get(pageId);
            }

            const pageFiles = {
                'overview': 'wiki/pages/resumen.html',
                'getting-started': 'wiki/pages/primeros-pasos.html',
                'installation': 'wiki/pages/instalacion.html',
                'troubleshooting': 'wiki/pages/solucion-problemas.html',
                'faq': 'wiki/pages/faq.html',
                'support': 'wiki/pages/soporte.html'
            };

            const filePath = pageFiles[pageId];
            if (!filePath) {
                throw new Error(`Página '${pageId}' no encontrada`);
            }

            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Error loading page: ${response.status}`);
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const content = doc.body.innerHTML;

            this.cache.set(pageId, content);
            return content;
            
        } catch (error) {
            console.error(`Error cargando página ${pageId}:`, error);
            return this.createErrorPage(pageId);
        }
    },

    createErrorPage(pageId) {
        return `
            <div class="wiki-page">
                <h1>Error al cargar la página</h1>
                <div class="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded mb-6">
                    <p>No se pudo cargar la página solicitada: <strong>${pageId}</strong></p>
                    <p class="mt-2">Por favor, inténtalo de nuevo más tarde.</p>
                </div>
                <button onclick="Wiki.showPageWithRouting('overview')" class="bg-trinity-purple text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                    Volver al inicio
                </button>
            </div>
        `;
    },

    clearCache() {
        this.cache.clear();
    }
};
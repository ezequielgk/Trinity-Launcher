/* ==========================================================================
   SISTEMA WIKI/DOCUMENTACIÓN CON ARCHIVOS EXTERNOS - VERSIÓN ACTUALIZADA
   ========================================================================== */

const Wiki = {
    currentPage: 'overview',
    pages: {},
    isInitialized: false,

    /**
     * Inicializa el sistema wiki con routing
     */
    init() {
        if (!this.isInitialized) {
            this.loadWikiStructure();
            this.setupMobileWikiMenu();
            this.loadAllPages();
            this.setupRouting();
            this.handleInitialRoute();
            this.isInitialized = true;
        }
    },

    /**
     * Configurar sistema de routing
     */
    setupRouting() {
        // Manejar cambios de URL (botón atrás/adelante)
        window.addEventListener('popstate', (e) => {
            this.handleRoute();
        });

        // Manejar cambios de hash
        window.addEventListener('hashchange', () => {
            this.handleHashRoute();
        });

        // Interceptar clicks en enlaces wiki
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('/wiki')) {
                e.preventDefault();
                const path = e.target.getAttribute('href');
                this.navigateToPath(path);
            }
        });
    },

    /**
     * Manejar ruta inicial cuando se carga la página
     */
    handleInitialRoute() {
        // Manejar hash inicial si existe
        if (window.location.hash) {
            this.handleHashRoute();
        } else {
            // Página por defecto si no hay hash
            this.showPage('overview', false);
        }
    },

    /**
     * Manejar rutas de wiki
     */
    handleRoute() {
        const path = window.location.pathname;
        let page = 'overview'; // página por defecto
        
        if (path === '/wiki' || path === '/wiki/') {
            page = 'overview'; // página principal del wiki
        } else if (path.startsWith('/wiki/')) {
            const segment = path.replace('/wiki/', '');
            // Mapear URLs a páginas internas
            page = this.mapUrlToPage(segment);
        }
        
        // Siempre intentar mostrar la página (los archivos existen)
        this.showPage(page, false); // false = no actualizar URL
    },

    /**
     * Mapear URLs a páginas internas
     */
    mapUrlToPage(urlSegment) {
        const urlMap = {
            'resume': 'overview',
            'installation': 'installation', 
            'faq': 'faq',
            'support': 'support',
            'troubleshooting': 'troubleshooting',
            'getting-started': 'getting-started'
        };
        
        return urlMap[urlSegment] || 'overview';
    },

    /**
     * Mapear páginas internas a URLs
     */
    mapPageToUrl(pageId) {
        const pageMap = {
            'overview': 'resume',
            'installation': 'installation',
            'faq': 'faq', 
            'support': 'support',
            'troubleshooting': 'troubleshooting',
            'getting-started': 'getting-started'
        };
        
        return pageMap[pageId] || 'resume';
    },

    /**
     * Navegar a una ruta específica
     */
    navigateToPath(path) {
        history.pushState(null, '', path);
        this.handleRoute();
    },

    /**
     * Carga la estructura HTML del wiki - CORREGIDA PARA FONDO OSCURO
     */
    loadWikiStructure() {
        const wikiContainer = document.getElementById('wiki-container');
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
                            <!-- Navigation will be populated by JavaScript -->
                        </nav>
                    </div>
                </div>

                <!-- Wiki Content - FONDO OSCURO FORZADO -->
                <div class="flex-1 p-4 sm:p-6 lg:p-8 bg-trinity-darker min-w-0" style="background-color: #1A1A2E !important;">
                    <div id="wiki-page-content" style="background-color: #1A1A2E !important; color: white !important;">
                        <!-- Page content will be loaded here -->
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Carga todas las páginas del wiki - AHORA USA ARCHIVOS EXTERNOS
     */
    loadAllPages() {
        // Las páginas ahora se cargan dinámicamente desde archivos
        this.pages = {}; // Mantenemos el objeto para compatibilidad
        this.createNavigation();
    },

    /**
     * Crea la navegación del wiki - ACTUALIZADA CON ROUTING
     */
    createNavigation() {
        const nav = document.getElementById('wiki-navigation');
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
     * Mostrar página con hash routing
     */
    showPageWithRouting(pageId) {
        const urlSegment = this.mapPageToUrl(pageId);
        
        // Usar hash routing en lugar de pushState
        window.location.hash = urlSegment;
        
        this.showPage(pageId, false);
        this.updateSEO(pageId);
    },

        /**
     * Manejar rutas con hash
     */
    handleHashRoute() {
        const hash = window.location.hash.substring(1); // quitar el #
        let page = 'overview';
        
        if (hash) {
            page = this.mapUrlToPage(hash);
        }
        
        this.showPage(page, false);
    },

    /**
     * Muestra una página específica del wiki - AHORA CARGA DESDE ARCHIVOS
     * @param {string} pageId - ID de la página a mostrar
     * @param {boolean} updateUrl - Si actualizar la URL (por defecto true)
     */
    async showPage(pageId, updateUrl = true) {
        try {
            // Mostrar indicador de carga
            const contentContainer = document.getElementById('wiki-page-content');
            contentContainer.innerHTML = `
                <div class="flex items-center justify-center p-8" style="background-color: #1A1A2E !important;">
                    <div class="text-center text-white">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-trinity-purple mx-auto mb-4"></div>
                        <p>Cargando página...</p>
                    </div>
                </div>
            `;

            // Cargar contenido desde archivo
            const content = await WikiLoader.loadPage(pageId);
            
            // Actualizar contenido
            contentContainer.innerHTML = content;
            
            // FORZAR FONDO OSCURO DESPUÉS DE CARGAR CONTENIDO
            contentContainer.style.backgroundColor = '#1A1A2E';
            contentContainer.style.color = 'white';

            // Actualizar navegación activa
            this.updateActiveNavigation(pageId);

            // Cerrar menú móvil si está abierto
            this.closeMobileMenu();

            // Scroll al inicio del contenido
            contentContainer.scrollTop = 0;

            this.currentPage = pageId;

            // Actualizar SEO
            if (updateUrl) {
                this.updateSEO(pageId);
            }

        } catch (error) {
            console.error(`Error mostrando página '${pageId}':`, error);
            const contentContainer = document.getElementById('wiki-page-content');
            contentContainer.innerHTML = WikiLoader.createErrorPage(pageId);
            contentContainer.style.backgroundColor = '#1A1A2E';
            contentContainer.style.color = 'white';
        }
    },

    /**
     * Actualizar metadatos SEO dinámicamente
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
                description: 'Guía completa para instalar Trinity Launcher en Linux. Instrucciones para todas las distribuciones.'
            },
            'troubleshooting': {
                title: 'Solución de Problemas - Trinity Launcher Wiki',
                description: 'Guía de solución de problemas comunes de Trinity Launcher en Linux.'
            },
            'faq': {
                title: 'FAQ - Trinity Launcher Wiki',
                description: 'Preguntas frecuentes sobre Trinity Launcher. Resuelve las dudas más comunes.'
            },
            'support': {
                title: 'Soporte - Trinity Launcher Wiki',
                description: 'Obtén ayuda técnica para Trinity Launcher. Canales de soporte y contacto.'
            }
        };

        const data = seoData[pageId];
        if (!data) return;

        // Actualizar título
        document.title = data.title;

        // Actualizar meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', data.description);
        }

        // Actualizar Open Graph
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        const ogUrl = document.querySelector('meta[property="og:url"]');
        
        if (ogTitle) ogTitle.setAttribute('content', data.title);
        if (ogDescription) ogDescription.setAttribute('content', data.description);
        if (ogUrl) {
            const urlSegment = this.mapPageToUrl(pageId);
            const newUrl = `https://trinity-launcher.vercel.app/wiki#${urlSegment}`;
            ogUrl.setAttribute('content', newUrl);
        }

        // Actualizar canonical
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            const urlSegment = this.mapPageToUrl(pageId);
            const newUrl = `https://trinity-launcher.vercel.app/wiki#${urlSegment}`;
            canonical.setAttribute('href', newUrl);
        }
    },

    /**
     * Actualiza la navegación activa
     * @param {string} activePageId - ID de la página activa
     */
    updateActiveNavigation(activePageId) {
        // Remover clase activa de todos los elementos
        document.querySelectorAll('.wiki-nav-item').forEach(item => {
            item.classList.remove('bg-sidebar-active', 'text-white');
            item.classList.add('text-gray-300');
        });

        // Añadir clase activa al elemento seleccionado
        const activeNavItem = document.querySelector(`[data-page="${activePageId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('bg-sidebar-active', 'text-white');
            activeNavItem.classList.remove('text-gray-300');
        }
    },

    /**
     * Configura el menú móvil del wiki
     */
    setupMobileWikiMenu() {
        // Esta función se ejecuta después de que el HTML se ha cargado
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
     * Abre el menú móvil del wiki
     */
    openMobileMenu() {
        const wikiSidebar = document.getElementById('wiki-sidebar');
        const mobileWikiOverlay = document.getElementById('mobile-wiki-overlay');
        
        if (wikiSidebar) wikiSidebar.classList.remove('-translate-x-full');
        if (mobileWikiOverlay) mobileWikiOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },

    /**
     * Cierra el menú móvil del wiki
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
   CARGADOR DE PÁGINAS WIKI - ARCHIVOS EXTERNOS
   ========================================================================== */

const WikiLoader = {
    cache: new Map(),
    
    /**
     * Carga una página wiki desde archivo externo
     */
    async loadPage(pageId) {
        try {
            // Usar caché si existe
            if (this.cache.has(pageId)) {
                return this.cache.get(pageId);
            }

            // Mapear IDs a archivos
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

            // Cargar archivo
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Error loading page: ${response.status}`);
            }

            const html = await response.text();
            
            // Extraer contenido del body
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const content = doc.body.innerHTML;

            // Guardar en caché
            this.cache.set(pageId, content);
            
            return content;
            
        } catch (error) {
            console.error(`Error cargando página ${pageId}:`, error);
            return this.createErrorPage(pageId);
        }
    },

    /**
     * Crear página de error
     */
    createErrorPage(pageId) {
        return `
            <div class="wiki-page" style="background-color: #1A1A2E !important; color: white !important;">
                <h1 style="color: white !important;">Error al cargar la página</h1>
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

    /**
     * Limpiar caché
     */
    clearCache() {
        this.cache.clear();
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar si no está ya inicializado
    if (!Wiki.isInitialized) {
        Wiki.init();
    }
});
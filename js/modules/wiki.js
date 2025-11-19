/* ==========================================================================
   SISTEMA WIKI/DOCUMENTACIÓN CON ROUTING - VERSIÓN MEJORADA
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
        const path = window.location.pathname;
        if (path.startsWith('/wiki')) {
            // Estamos en una página wiki, manejar la ruta
            this.handleRoute();
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
        
        if (this.pages[page]) {
            this.showPage(page, false); // false = no actualizar URL
        } else {
            this.showPage('overview', false);
        }
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
     * Carga todas las páginas del wiki
     */
    loadAllPages() {
        this.pages = {
            'overview': this.createOverviewPage(),
            'getting-started': this.createGettingStartedPage(),
            'installation': this.createInstallationPage(),
            'troubleshooting': this.createTroubleshootingPage(),
            'faq': this.createFaqPage(),
            'support': this.createSupportPage() // Nueva página
        };

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
     * Mostrar página con routing (nueva función)
     */
    showPageWithRouting(pageId) {
        const urlSegment = this.mapPageToUrl(pageId);
        const newPath = `/wiki/${urlSegment}`;
        
        // Actualizar URL y mostrar página
        history.pushState(null, '', newPath);
        this.showPage(pageId, false);
        this.updateSEO(pageId);
    },

    /**
     * Muestra una página específica del wiki (función original mejorada)
     * @param {string} pageId - ID de la página a mostrar
     * @param {boolean} updateUrl - Si actualizar la URL (por defecto true)
     */
    showPage(pageId, updateUrl = true) {
        if (!this.pages[pageId]) {
            console.error(`Página '${pageId}' no encontrada`);
            return;
        }

        // Actualizar contenido
        const contentContainer = document.getElementById('wiki-page-content');
        contentContainer.innerHTML = this.pages[pageId];
        
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
            const newUrl = `https://trinity-launcher.vercel.app/wiki/${urlSegment}`;
            ogUrl.setAttribute('content', newUrl);
        }

        // Actualizar canonical
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            const urlSegment = this.mapPageToUrl(pageId);
            const newUrl = `https://trinity-launcher.vercel.app/wiki/${urlSegment}`;
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
    },

    // ===== PÁGINAS DEL WIKI - TODAS CON ESTILOS OSCUROS =====

    createOverviewPage() {
        return `
            <div class="wiki-page" style="background-color: #1A1A2E !important; color: white !important;">
                <h1 style="color: white !important;">Resumen</h1>
                <p class="text-lg mb-6" style="color: #d1d5db !important;">
                    Trinity Launcher es un launcher open source de Minecraft Bedrock diseñado específicamente para sistemas Linux,
                    con soporte completo para las principales distribuciones que soportan Flatpak.
                </p>
                <div class="info-box" style="background-color: rgba(59, 130, 246, 0.1) !important; border-left: 4px solid #3b82f6; color: #93c5fd !important;">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p style="color: #93c5fd !important;">
                                <strong>Nota:</strong> Trinity Launcher está en desarrollo activo. Algunas características pueden cambiar en futuras versiones.
                            </p>
                        </div>
                    </div>
                </div>
                <h2 style="color: white !important;">Características Principales</h2>
                <ul class="space-y-2 mb-6" style="color: #d1d5db !important;">
                    <li>✅ Soporte nativo para Linux</li>
                    <li>✅ Compatible con Debian, Ubuntu, Arch y Fedora Y cualquier Distro Soportada por Flatpak</li>
                    <li>✅ Gestión de múltiples instancias</li>
                    <li>✅ Instalación automática de modpacks</li>
                    <li>✅ Interfaz moderna e intuitiva</li>
                    <li>✅ Completamente open source</li>
                </ul>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div class="bg-trinity-dark rounded-lg p-6 border border-gray-600 hover:border-trinity-purple transition-colors cursor-pointer" onclick="Wiki.showPageWithRouting('installation')">
                        <h3 class="text-xl font-semibold mb-3 text-white">🚀 Comenzar</h3>
                        <p class="text-gray-300 mb-4">Instala Trinity Launcher en tu sistema</p>
                        <span class="text-trinity-purple hover:underline">Ver Instalación →</span>
                    </div>
                    
                    <div class="bg-trinity-dark rounded-lg p-6 border border-gray-600 hover:border-trinity-purple transition-colors cursor-pointer" onclick="Wiki.showPageWithRouting('support')">
                        <h3 class="text-xl font-semibold mb-3 text-white">🛠️ ¿Necesitas Ayuda?</h3>
                        <p class="text-gray-300 mb-4">Contacta con nuestro equipo</p>
                        <span class="text-trinity-purple hover:underline">Ver Soporte →</span>
                    </div>
                </div>
            </div>
        `;
    },

    createGettingStartedPage() {
        return `
            <div class="wiki-page" style="background-color: #1A1A2E !important; color: white !important;">
                <h1 style="color: white !important;">Primeros Pasos</h1>
                <p class="mb-6" style="color: #d1d5db !important;">Esta guía te ayudará a configurar Trinity Launcher en tu sistema Linux.</p>

                <h2 style="color: white !important;">Requisitos del Sistema</h2>
                <ul class="space-y-2 mb-6" style="color: #d1d5db !important;">
                    <li><strong>OS:</strong> Linux (Debian, Ubuntu, Arch, Fedora o derivadas)</li>
                    <li><strong>RAM:</strong> Mínimo 4GB (8GB recomendados)</li>
                    <li><strong>Espacio:</strong> Al menos 2GB libres</li>
                </ul>

                <h2 style="color: white !important;">Primer Lanzamiento</h2>
                <ol class="list-decimal list-inside space-y-2" style="color: #d1d5db !important;">
                    <li>Abre Trinity Launcher desde el menú de aplicaciones</li>
                    <li>Configura tu Aplicacion de Minecraft Bedrock</li>
                    <li>Selecciona la versión de Minecraft Bedrock que deseas</li>
                    <li>¡Disfruta jugando!</li>
                </ol>
            </div>
        `;
    },

    createInstallationPage() {
        return `
            <div class="wiki-page" style="background-color: #1A1A2E !important; color: white !important;">
                <h1 style="color: white !important;">Instalación</h1>
                
                <div class="coming-soon-container" style="background: linear-gradient(135deg, rgba(139, 127, 214, 0.1) 0%, rgba(139, 127, 214, 0.05) 100%) !important; border: 2px dashed #8B7FD6; border-radius: 12px; padding: 3rem; text-align: center; color: white !important;">
                    <div class="text-7xl mb-6">📦</div>
                    <h2 class="text-4xl font-bold mb-4" style="color: #8B7FD6 !important;">¡PRÓXIMAMENTE!</h2>
                    <p class="text-xl" style="color: #9ca3af !important;">
                        Pronto podrás descargar Trinity Launcher para todas las distribuciones.
                    </p>
                </div>
            </div>
        `;
    },

    createTroubleshootingPage() {
        return `
            <div class="wiki-page" style="background-color: #1A1A2E !important; color: white !important;">
                <h1 style="color: white !important;">Solución de Problemas</h1>
                
                <div class="coming-soon-container" style="background: linear-gradient(135deg, rgba(139, 127, 214, 0.1) 0%, rgba(139, 127, 214, 0.05) 100%) !important; border: 2px dashed #8B7FD6; border-radius: 12px; padding: 3rem; text-align: center; color: white !important;">
                    <div class="text-7xl mb-6">🔧</div>
                    <h2 class="text-4xl font-bold mb-4" style="color: #8B7FD6 !important;">¡PRÓXIMAMENTE!</h2>
                    <p class="text-xl" style="color: #9ca3af !important;">
                        Estamos preparando guías detalladas de solución de problemas.
                    </p>
                </div>
            </div>
        `;
    },

    createFaqPage() {
        return `
            <div class="wiki-page" style="background-color: #1A1A2E !important; color: white !important;">
                <h1 style="color: white !important;">Preguntas Frecuentes (FAQ)</h1>

                <div class="space-y-8">
                    <div>
                        <h3 style="color: #8B7FD6 !important;">¿Trinity Launcher es compatible con Minecraft Java Edition?</h3>
                        <p style="color: #d1d5db !important;">
                            No, Trinity Launcher está diseñado específicamente para Minecraft Bedrock Edition.
                            Para Java Edition recomendamos usar PrismLauncher o MultiMC.
                        </p>
                    </div>

                    <div>
                        <h3 style="color: #8B7FD6 !important;">¿Necesito una licencia de Minecraft?</h3>
                        <p style="color: #d1d5db !important;">
                            Sí, Trinity Launcher "requiere" que tengas una cuenta válida de Microsoft con Minecraft Bedrock Edition.
                            El launcher no incluye el juego, solo proporciona una forma mejor de ejecutarlo en Linux.
                        </p>
                    </div>

                    <div>
                        <h3 style="color: #8B7FD6 !important;">¿Es Trinity Launcher open source?</h3>
                        <p style="color: #d1d5db !important;">
                            Sí, Trinity Launcher es completamente open source bajo licencia GPL v3.
                            Puedes encontrar el código fuente en <a href="https://github.com/" target="_blank" rel="noopener noreferrer" style="color: #8B7FD6 !important; text-decoration: underline;">Github</a>.
                        </p>
                    </div>

                    <div>
                        <h3 style="color: #8B7FD6 !important;">¿Soporta mods?</h3>
                        <p style="color: #d1d5db !important;">
                            Trinity Launcher soporta add-ons y behavior packs de Minecraft Bedrock,
                            así como la instalación automática de modpacks compatibles desde repositorios populares.
                        </p>
                    </div>

                    <div>
                        <h3 style="color: #8B7FD6 !important;">¿Cómo reportar bugs?</h3>
                        <p style="color: #d1d5db !important;">
                            Puedes reportar bugs y solicitar características en nuestro
                            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" style="color: #8B7FD6 !important; text-decoration: underline;">repositorio de Github</a>
                            o unirte a nuestra comunidad en Discord.
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Nueva página de soporte
     */
    createSupportPage() {
        return `
            <div class="wiki-page" style="background-color: #1A1A2E !important; color: white !important;">
                <h1 style="color: white !important;">Soporte Técnico</h1>
                <p class="text-xl mb-8" style="color: #d1d5db !important;">
                    ¿Necesitas ayuda con Trinity Launcher? Estamos aquí para ayudarte.
                </p>
                
                <h2 style="color: white !important;">🚀 Canales de Soporte</h2>
                
                <div class="space-y-6 mb-8">
                    <div class="bg-trinity-dark rounded-lg p-6 border border-gray-600">
                        <h3 class="text-xl font-semibold mb-3 text-white flex items-center">
                            <span class="text-2xl mr-3">💬</span> Discord (Recomendado)
                        </h3>
                        <p class="text-gray-300 mb-4">
                            Únete a nuestra comunidad en Discord para obtener ayuda rápida de otros usuarios y del equipo de desarrollo.
                        </p>
                        <a href="https://discord.gg/uTFUJf6DGP" target="_blank" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center">
                            <span class="mr-2">🎮</span> Unirse al Discord
                        </a>
                    </div>
                    
                    <div class="bg-trinity-dark rounded-lg p-6 border border-gray-600">
                        <h3 class="text-xl font-semibold mb-3 text-white flex items-center">
                            <span class="text-2xl mr-3">🐛</span> GitHub Issues
                        </h3>
                        <p class="text-gray-300 mb-4">
                            Para reportar bugs, solicitar nuevas características o problemas técnicos específicos.
                        </p>
                        <a href="https://github.com/" target="_blank" class="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center">
                            <span class="mr-2">📝</span> Reportar Issue
                        </a>
                    </div>
                </div>
                
                <h2 style="color: white !important;">📋 Antes de Contactar</h2>
                <div class="bg-trinity-dark rounded-lg p-6 border border-gray-600 mb-6">
                    <p class="text-gray-300 mb-4">Para ayudarte mejor, ten lista la siguiente información:</p>
                    <ul class="space-y-2 text-gray-300">
                        <li>• Distribución Linux y versión</li>
                        <li>• Versión de Trinity Launcher</li>
                        <li>• Descripción detallada del problema</li>
                        <li>• Capturas de pantalla si es posible</li>
                    </ul>
                </div>
            </div>
        `;
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar si no está ya inicializado
    if (!Wiki.isInitialized) {
        Wiki.init();
    }
});
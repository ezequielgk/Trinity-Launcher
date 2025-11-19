/* ==========================================================================
   TRINITY LAUNCHER - SCRIPT PRINCIPAL
   ========================================================================== */

/**
 * Clase principal de la aplicación
 */
class TrinityLauncherApp {
    constructor() {
        this.isInitialized = false;
    }

    /**
     * Inicializa la aplicación
     */
    init() {
        if (this.isInitialized) return;

        try {
            // Inicializar módulos en orden
            Theme.init();
            Navigation.init();
            
            // Configurar event listeners globales
            this.setupGlobalEventListeners();
            
            // Marcar como inicializado
            this.isInitialized = true;
            
            console.log('✅ Trinity Launcher App inicializada correctamente');
        } catch (error) {
            console.error('❌ Error al inicializar la aplicación:', error);
        }
    }

    /**
     * Configura event listeners globales
     */
    setupGlobalEventListeners() {
        // Smooth scrolling para enlaces internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Lazy loading para imágenes
        this.setupLazyLoading();

        // Performance optimizations
        this.setupPerformanceOptimizations();
    }

    /**
     * Configura lazy loading para imágenes
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            // Observar todas las imágenes con data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Optimizaciones de rendimiento
     */
    setupPerformanceOptimizations() {
        // Prevenir zoom en iOS para inputs
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (window.innerWidth <= 768) {
                input.style.fontSize = '16px';
            }
        });

        // Optimizar scroll events
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Aquí puedes agregar lógica de scroll si es necesaria
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    /**
     * Métodos de utilidad
     */
    static utils = {
        /**
         * Crea un elemento DOM con atributos
         * @param {string} tag - Nombre del elemento
         * @param {object} attributes - Atributos del elemento
         * @param {string} content - Contenido interno
         * @returns {HTMLElement}
         */
        createElement(tag, attributes = {}, content = '') {
            const element = document.createElement(tag);
            
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'className') {
                    element.className = value;
                } else {
                    element.setAttribute(key, value);
                }
            });
            
            if (content) {
                element.innerHTML = content;
            }
            
            return element;
        },

        /**
         * Debounce function para optimizar eventos
         * @param {Function} func - Función a ejecutar
         * @param {number} wait - Tiempo de espera en ms
         * @returns {Function}
         */
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        /**
         * Throttle function para optimizar eventos
         * @param {Function} func - Función a ejecutar
         * @param {number} limit - Límite en ms
         * @returns {Function}
         */
        throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        }
    };
}

// ===== INICIALIZACIÓN =====

// Crear instancia global de la aplicación
window.TrinityApp = new TrinityLauncherApp();

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.TrinityApp.init();
    });
} else {
    // El DOM ya está listo
    window.TrinityApp.init();
}

// Exportar para uso global (compatibilidad)
window.Navigation = Navigation;
window.Wiki = Wiki;
window.Theme = Theme;
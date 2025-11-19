/* ==========================================================================
   CONFIGURACIÓN DE TAILWIND CSS
   ========================================================================== */

tailwind.config = {
    theme: {
        extend: {
            colors: {
                'trinity-purple': '#8B7FD6',
                'trinity-dark': '#2A2A3A',
                'trinity-darker': '#1A1A2E',
                'trinity-light': '#E8E6FF',
                'accent-orange': '#FF8C42',
                'sidebar-bg': '#2D2D3A',
                'sidebar-active': '#3A3A4A'
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif']
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite'
            }
        }
    },
    darkMode: 'class'
}
# 🚀 Trinity Launcher Website

Sitio web oficial del Trinity Launcher, un launcher open source para Minecraft Bedrock en Linux.

## 📁 Estructura del Proyecto

```
Trinity Launcher Page
├── assets
│   └── images
│       ├── mc1.png
│       └── mc2.png
├── css
│   ├── components
│   │   ├── hero.css
│   │   ├── navigation.css
│   │   └── wiki.css
│   └── styles.css
├── favicon.ico
├── index.html
├── js
│   ├── configs
│   │   └── tailwind.config.js
│   ├── main.js
│   └── modules
│       ├── navigation.js
│       ├── theme.js
│       └── wiki.js
├── LICENSE
├── readme.md
├── vercel.json
└── wiki
    └── pages
        ├── faq.html
        ├── instalacion.html
        ├── primeros-pasos.html
        ├── resumen.html
        ├── solucion-problemas.html
        └── soporte.html
```

##  Inicio Rápido

1. **Clona o descarga** los archivos
2. **Abre** `index.html` en tu navegador
3. ¡**Listo**! El sitio está funcionando

##  Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos
- **JavaScript ES6+** - Funcionalidad modular
- **TailwindCSS** - Framework de CSS utility-first
- **Responsive Design** - Adaptable a todos los dispositivos

##  Características

-  **Responsive Design** - Se adapta a móviles, tablets y desktop
-  **Modo Oscuro/Claro** - Detección automática de preferencias del usuario
-  **Navegación fluida** - SPA (Single Page Application) experience
-  **Optimizado para rendimiento** - Lazy loading, throttling, debouncing
-  **Accesibilidad** - Diseño accesible y semántico
-  **SEO Friendly** - Estructura optimizada para motores de búsqueda

##  Personalización

### Colores

Los colores se pueden modificar en:
- `css/styles.css` (variables CSS)
- `js/config/tailwind.config.js` (configuración Tailwind)

### Contenido

- **Páginas wiki**: Edita los métodos en `js/modules/wiki.js`
- **Navegación**: Modifica `js/modules/navigation.js`
- **Estilos**: Personaliza los archivos CSS en `css/components/`

### Añadir nuevas páginas wiki

```javascript
// En js/modules/wiki.js
createNuevaPagina() {
    return `
        <div class="wiki-page">
            <h1>Nueva Página</h1>
            <p>Contenido de la nueva página...</p>
        </div>
    `;
}
```

## 🤝 Contribuir

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia GPL v3. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Trinity Launcher Team**

- GitHub: [@trinity-launcher](https://github.com/)
- Discord: [Trinity Community](https://discord.gg/uTFUJf6DGP)

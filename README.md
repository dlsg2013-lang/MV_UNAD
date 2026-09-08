# Sitio del programa — Medicina Veterinaria

Sitio estático (HTML/CSS/JS puro, sin build) pensado para abrir en VS Code y
subir a GitHub Pages. Cada pieza del programa vive en su propia página HTML,
enlazada desde `index.html`.

## Estructura

```
├── index.html               → índice: enlaza las 9 secciones
├── malla-academica.html     → Malla académica interactiva
├── condicion-1.html … condicion-8.html   → 8 páginas independientes
├── css/
│   ├── base.css              → nav, tipografía, tokens de color, modo embed
│   ├── malla.css             → estilos específicos de la malla
│   └── condicion.css         → estilos compartidos de las páginas Condición N
├── js/
│   ├── embed-mode.js         → oculta el menú cuando se carga con ?embed=1
│   ├── malla-data.js          → ★ EDITA AQUÍ los cursos y prerrequisitos
│   └── malla.js                → lógica de render e interacción de la malla
└── README.md
```

## Un repositorio, páginas 100% independientes

No hace falta un repositorio por sección. Cada `.html` es autocontenido
(su propio contenido, y solo comparte CSS/JS si tú quieres): puedes editar
`condicion-3.html` sin tocar ni afectar a `condicion-5.html` ni a la malla.
Al publicar el repo en GitHub Pages, cada archivo obtiene su propia URL
pública, por ejemplo:

```
https://usuario.github.io/repo/condicion-1.html
https://usuario.github.io/repo/condicion-2.html
https://usuario.github.io/repo/malla-academica.html
```

## Insertar una sección en Canva o Genially

1. Publica el repo en GitHub Pages (ver más abajo).
2. Copia la URL de la página que quieras insertar y agrégale `?embed=1` al
   final, ej: `https://usuario.github.io/repo/condicion-1.html?embed=1`.
   Ese parámetro oculta el menú de navegación del sitio (vía `embed-mode.js`)
   para que se vea limpia dentro de tu diseño, sin duplicar el nav.
3. En Canva o Genially, usa la opción de **insertar / embed una página web**
   (en Genially: "Insertar → Web"; en Canva, apps como "Embed" o el elemento
   "Insertar enlace") y pega esa URL. GitHub Pages no bloquea que se cargue
   dentro de un iframe, así que debería verse directo.
4. Si alguna herramienta no soporta iframes de sitios arbitrarios, como
   alternativa siempre puedes usar un botón/enlace normal que abra la URL
   en una pestaña nueva.

## Cómo revisar y corregir los datos

Toda la información de cursos vive en `js/malla-data.js`, separada del código
de interacción. Ahí puedes:

- Corregir nombre, código o créditos de un curso.
- Agregar o quitar periodos/cursos (respeta el `id` único de cada uno, p.ej. `p3c5`).
- Completar el objeto `PREREQUISITOS`: es un mapa `{ idCurso: [idsPrerrequisito] }`.
  La primera versión incluye las cadenas más evidentes de la imagen original
  (idiomas, ciencias básicas → clínica, rotaciones). **Vale la pena que la
  completes con el pénsum oficial** para que el efecto de "elevar prerrequisitos"
  sea exacto en todos los cursos, no solo en los que ya mapeé.
- Ajustar `PERIODO_COLORES` (10 colores, uno por periodo, derivados de tu
  paleta institucional) o los colores de `TIPO_INFO` (T/P/M).

## Novedades de esta versión

- **Tipografía:** todo el sitio usa [Montserrat](https://fonts.google.com/specimen/Montserrat) (Google Fonts), cargada por CDN en cada página.
- **Modo claro / oscuro:** botón 🌙/☀️ en el menú. Se guarda la preferencia en el navegador (`localStorage`) y aplica a todas las páginas del sitio vía `js/theme.js` + variables CSS en `css/base.css`.
- **Fondo institucional:** `assets/Fondo_1.png` se usa como textura de fondo fija y sutil detrás de todo el sitio (opacidad distinta en cada tema), más "orbes" de degradado en los colores de marca para dar profundidad sin saturar.
- **Tarjetas con degradado y efecto vidrio:** cada curso tiene un degradado suave hacia el color de su periodo, y los paneles (leyenda, panel de detalle, malla) usan `backdrop-filter` tipo "glassmorphism".
- **Malla con scroll acotado:** la malla ahora vive dentro de un panel con altura máxima fija; hace scroll vertical y horizontal *dentro* del panel (con scrollbar estilizada), y los encabezados de periodo quedan pegados (`sticky`) arriba mientras te desplazas. Esto evita el salto raro al bajar la página.
- **Prerrequisitos por "hilos" de color:** en `js/malla-data.js`, cada curso tiene un campo `hilos: [...]` con el/los colores de flecha que se le ven en la imagen original. El grafo de prerrequisitos se calcula solo a partir de eso (ver comentario al inicio del archivo). Es una interpretación cuidadosa, no el pénsum oficial exacto — si tienes la tabla real de prerrequisitos, compártela y la reemplazamos.

## Cómo funciona la interacción

- **Hover / focus con teclado** sobre una tarjeta → la levanta hacia el
  usuario (transform 3D + sombra) y resalta en color **todos** sus
  prerrequisitos (directos e indirectos, recorriendo la cadena completa),
  mientras atenúa el resto de la malla.
- **Click / toque** fija ese resaltado (útil en móvil, donde no hay hover) y
  abre un panel inferior derecho con el detalle y la lista de prerrequisitos.
  Se cierra con la `×`, con `Esc`, o pasando el mouse a otra tarjeta.
- Todo es accesible por teclado (`Tab` + `Enter`/`Espacio`) y respeta
  `prefers-reduced-motion`.

## Ver el sitio en local

No requiere instalación ni build. Basta con abrir `index.html` en el navegador,
o servirlo con cualquier servidor estático, por ejemplo con la extensión
**Live Server** de VS Code, o:

```bash
npx serve .
```

## Publicar en GitHub Pages

1. Sube esta carpeta a un repositorio de GitHub (rama `main`).
2. En el repo: **Settings → Pages → Branch: main / (root)** → Save.
3. GitHub te dará una URL tipo `https://usuario.github.io/repositorio/`.

No necesitas ningún paso de build: al ser HTML/CSS/JS puro, se sirve tal cual.

## Agregar la siguiente sección

1. Crea el nuevo archivo `.html` en la raíz (ej. `docentes.html`).
2. Reutiliza `<nav class="sitenav">` de `malla-academica.html` y agrégale el
   link nuevo en **ambas** páginas existentes (para que la navegación quede
   cruzada).
3. Enlaza `css/base.css` para heredar tipografía, nav y tokens de color;
   crea un CSS propio para esa sección si lo necesita (como `malla.css`).

Cuando quieras seguir, cuéntame qué va en la siguiente sección y seguimos
desde aquí.

/* embed-mode.js
   -------------------------------------------------------------------------
   Si la página se carga con ?embed=1 (por ejemplo dentro de un iframe en
   Canva o Genially), oculta el menú de navegación del sitio para que se
   vea limpia dentro del diseño donde la insertes. Sin el parámetro, la
   página se ve normal (con menú) al abrirla directo.
   -------------------------------------------------------------------------
   Cambio respecto a la versión anterior:
   - Se agrega la clase `is-embed` en <html> (en lugar de solo en <body>),
     para que cualquier CSS pueda reaccionar (p. ej. ocultar también
     side-nav, paddings extra, etc.).
   - Se ocultan también los botones flotantes del sidenav si existen.
   ------------------------------------------------------------------------- */
(function () {
  const params = new URLSearchParams(window.location.search);
  if (params.get("embed") !== "1") return;

  document.documentElement.classList.add("is-embed");

  // Ocultar nav principal
  const nav = document.querySelector(".sitenav");
  if (nav) nav.style.display = "none";

  // Ocultar navegación lateral de slides (Condición 3 / 4)
  const sideNav = document.querySelector(".sidenav-dots");
  if (sideNav) sideNav.style.display = "none";

  // Reducir padding superior si el layout lo tenía reservado para el nav
  document.querySelectorAll(".slide").forEach((s) => {
    s.style.paddingTop = "1.5rem";
  });
})();
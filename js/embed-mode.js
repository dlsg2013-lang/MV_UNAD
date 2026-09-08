/* embed-mode.js
   Si la página se carga con ?embed=1 (por ejemplo dentro de un iframe en
   Canva o Genially), oculta el menú de navegación del sitio para que se
   vea limpia dentro del diseño donde la insertes. Sin el parámetro, la
   página se ve normal (con menú) al abrirla directo. */
(function () {
  const params = new URLSearchParams(window.location.search);
  if (params.get("embed") === "1") {
    document.documentElement.classList.add("is-embed");
    const nav = document.querySelector(".sitenav");
    if (nav) nav.style.display = "none";
  }
})();

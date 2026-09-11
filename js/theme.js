/* theme.js — modo claro / oscuro, con memoria entre visitas (localStorage)
   -------------------------------------------------------------------------
   Cambio respecto a la versión anterior:
   - Antes usaba `document.documentElement.dataset.theme` (atributo data-theme).
   - Ahora usa la clase `.dark` en <html>, que es lo que Tailwind tiene
     configurado con darkMode: 'class' y lo que usan las Condición 3 y 4.
   - Se mantiene el mismo botón `.theme-toggle` y la misma clave de
     localStorage (`malla-theme`) para no perder preferencia entre páginas.
   ------------------------------------------------------------------------- */
(function () {
  const KEY = "malla-theme";
  const root = document.documentElement;

  // 1) Restaurar preferencia ANTES de que pinte (evita flash)
  const saved = localStorage.getItem(KEY);
  if (saved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  function apply(theme) {
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    localStorage.setItem(KEY, theme);

    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.textContent = theme === "dark" ? "☀️" : "🌙";
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
      );
    });
  }

  // 2) Wire-up al DOMContentLoaded
  document.addEventListener("DOMContentLoaded", () => {
    const current = root.classList.contains("dark") ? "dark" : "light";
    apply(current);

    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = root.classList.contains("dark") ? "light" : "dark";
        apply(next);
      });
    });
  });
})();
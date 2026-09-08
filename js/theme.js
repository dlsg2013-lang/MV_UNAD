/* theme.js — modo claro / oscuro, con memoria entre visitas (localStorage) */
(function () {
  const KEY = "malla-theme";
  const saved = localStorage.getItem(KEY);
  if (saved) document.documentElement.dataset.theme = saved;

  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(KEY, theme);
    const btn = document.querySelector(".theme-toggle");
    if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  document.addEventListener("DOMContentLoaded", () => {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    apply(current);
    const btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.addEventListener("click", () => {
        const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        apply(next);
      });
    }
  });
})();

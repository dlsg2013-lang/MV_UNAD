/* =========================================================================
   malla.js — construye la malla en el DOM y maneja la interacción
   ========================================================================= */
(function () {
  const { MALLA, PREREQUISITOS, TIPO_INFO, PERIODO_COLORES } = window.MALLA_DATA;

  const mallaEl = document.getElementById("malla");
  const detalleEl = document.getElementById("detalle");

  // Índice curso -> elemento, y curso -> datos, para lookups O(1)
  const cursoElById = new Map();
  const cursoDataById = new Map();

  /** Devuelve TODOS los ancestros (prerrequisitos directos e indirectos) */
  function getAllPrereqs(id, visited = new Set()) {
    const directos = PREREQUISITOS[id] || [];
    for (const p of directos) {
      if (!visited.has(p)) {
        visited.add(p);
        getAllPrereqs(p, visited);
      }
    }
    return visited;
  }

  function buildCard(curso, periodoIndex) {
    const el = document.createElement("article");
    el.className = "curso";
    el.tabIndex = 0;
    el.dataset.id = curso.id;
    el.style.setProperty("--card-color", PERIODO_COLORES[periodoIndex]);
    el.style.setProperty("--tipo-color", TIPO_INFO[curso.tipo].color);
    el.setAttribute("role", "button");
    el.setAttribute(
      "aria-label",
      `${curso.nombre}. ${TIPO_INFO[curso.tipo].label}, ${curso.creditos} créditos.`
    );

    el.innerHTML = `
      <span class="curso__type">${curso.tipo} · ${curso.creditos}</span>
      <span class="curso__name">${curso.nombre}</span>
      ${curso.codigo ? `<span class="curso__code">Cód. ${curso.codigo}</span>` : ""}
      ${curso.nota ? `<span class="curso__note">${curso.nota}</span>` : ""}
    `;
    return el;
  }

  function render() {
    MALLA.forEach((periodo, i) => {
      const col = document.createElement("section");
      col.className = "periodo";
      col.setAttribute("aria-label", `Periodo ${periodo.numero}`);

      const header = document.createElement("h2");
      header.className = "periodo__header";
      header.style.background = PERIODO_COLORES[i];
      header.textContent = `Periodo ${periodo.numero}`;
      col.appendChild(header);

      periodo.cursos.forEach((curso) => {
        const card = buildCard(curso, i);
        cursoElById.set(curso.id, card);
        cursoDataById.set(curso.id, { ...curso, periodo: periodo.numero, periodoIndex: i });
        col.appendChild(card);
      });

      const footer = document.createElement("div");
      footer.className = "periodo__footer";
      footer.innerHTML = `<strong>${periodo.creditos}</strong>créditos`;
      col.appendChild(footer);

      mallaEl.appendChild(col);
    });
  }

  function clearHighlight() {
    mallaEl.classList.remove("has-focus");
    mallaEl.querySelectorAll(".is-active, .is-prereq").forEach((el) => {
      el.classList.remove("is-active", "is-prereq");
    });
    detalleEl.classList.remove("is-visible");
  }

  function highlight(id) {
    const prereqs = getAllPrereqs(id);
    clearHighlight();
    mallaEl.classList.add("has-focus");

    const activeEl = cursoElById.get(id);
    activeEl.classList.add("is-active");
    prereqs.forEach((pid) => {
      const el = cursoElById.get(pid);
      if (el) el.classList.add("is-prereq");
    });

    showDetail(id, prereqs);
  }

  function showDetail(id, prereqs) {
    const data = cursoDataById.get(id);
    const items = [...prereqs]
      .map((pid) => cursoDataById.get(pid))
      .filter(Boolean)
      .sort((a, b) => a.periodoIndex - b.periodoIndex)
      .map((c) => `<li>Periodo ${c.periodo} · ${c.nombre}</li>`)
      .join("");

    detalleEl.innerHTML = `
      <button class="detalle__close" aria-label="Cerrar">×</button>
      <h3>${data.nombre}</h3>
      <p>Periodo ${data.periodo} · ${TIPO_INFO[data.tipo].label} · ${data.creditos} créditos</p>
      ${
        items
          ? `<p>Requiere haber cursado:</p><ul class="detalle__list">${items}</ul>`
          : `<p>No tiene prerrequisitos registrados.</p>`
      }
    `;
    detalleEl.classList.add("is-visible");
    detalleEl
      .querySelector(".detalle__close")
      .addEventListener("click", clearHighlight);
  }

  function attachEvents() {
    // Hover de escritorio: reactivo al mouse
    mallaEl.addEventListener("mouseover", (e) => {
      const card = e.target.closest(".curso");
      if (card) highlight(card.dataset.id);
    });
    mallaEl.addEventListener("mouseleave", clearHighlight);

    // Click / touch / teclado: fija el resaltado (útil en móvil)
    mallaEl.addEventListener("click", (e) => {
      const card = e.target.closest(".curso");
      if (card) highlight(card.dataset.id);
    });
    mallaEl.addEventListener("keydown", (e) => {
      const card = e.target.closest(".curso");
      if (card && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        highlight(card.dataset.id);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") clearHighlight();
    });
  }

  render();
  attachEvents();
})();

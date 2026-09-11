/* =========================================================================
   malla.js — construye la malla en el DOM y maneja la interacción
   -------------------------------------------------------------------------
   Novedades:
   - El panel #detalle está INCRUSTADO al lado de la malla (no flota).
     Se muestra siempre: con un placeholder cuando no hay curso activo,
     o con la info del curso cuando lo hay.
   - Click sobre un curso lo deja "fijado" (.is-pinned). Al mover el mouse
     fuera de la malla, la vista se mantiene en el curso fijado.
   - Click de nuevo sobre el mismo curso, X, Esc o click en espacio vacío
     despinnan.
   - Los cursos van dentro de <div class="periodo__body"> para que el
     header y footer del periodo queden fijos y el body scrollee.
   ========================================================================= */
(function () {
  const { MALLA, PREREQUISITOS, TIPO_INFO, PERIODO_COLORES } = window.MALLA_DATA;

  const mallaEl = document.getElementById("malla");
  const detalleEl = document.getElementById("detalle");
  if (!mallaEl || !detalleEl) return;

  const cursoElById = new Map();
  const cursoDataById = new Map();

  let pinnedId = null;

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
      <span class="curso__type">${curso.tipo} · ${curso.creditos} cr</span>
      <span class="curso__name">${curso.nombre}</span>
      ${curso.codigo ? `<span class="curso__code">Cód. ${curso.codigo}</span>` : ""}
      ${curso.nota ? `<span class="curso__note">${curso.nota}</span>` : ""}
    `;
    return el;
  }

  function render() {
    mallaEl.innerHTML = "";
    cursoElById.clear();
    cursoDataById.clear();

    MALLA.forEach((periodo, i) => {
      const col = document.createElement("section");
      col.className = "periodo";
      col.setAttribute("aria-label", `Periodo ${periodo.numero}`);

      const header = document.createElement("h2");
      header.className = "periodo__header";
      header.style.background = PERIODO_COLORES[i];
      header.textContent = `Periodo ${periodo.numero}`;
      col.appendChild(header);

      const body = document.createElement("div");
      body.className = "periodo__body";

      periodo.cursos.forEach((curso) => {
        const card = buildCard(curso, i);
        cursoElById.set(curso.id, card);
        cursoDataById.set(curso.id, {
          ...curso,
          periodo: periodo.numero,
          periodoIndex: i,
        });
        body.appendChild(card);
      });

      col.appendChild(body);

      const footer = document.createElement("div");
      footer.className = "periodo__footer";
      footer.innerHTML = `<span>Total</span><strong>${periodo.creditos}</strong>`;
      col.appendChild(footer);

      mallaEl.appendChild(col);
    });
  }

  /* ---------- PANEL DE DETALLE ---------- */

  function showPlaceholder() {
    detalleEl.innerHTML = `
      <div class="detalle__placeholder">
        <span class="iconify" data-icon="lucide:mouse-pointer-click" data-width="34"></span>
        <h3>Explora la malla</h3>
        <p>Pasa el cursor o haz click sobre un curso para ver su ruta de prerrequisitos.</p>
        <span class="detalle__hint">💡 Haz click para <strong>fijar</strong> el curso y poder mover el mouse libremente.</span>
      </div>
    `;
  }

  function showDetail(id, prereqs) {
    const data = cursoDataById.get(id);
    if (!data) return;

    const items = [...prereqs]
      .map((pid) => cursoDataById.get(pid))
      .filter(Boolean)
      .sort((a, b) => a.periodoIndex - b.periodoIndex)
      .map((c) => `<li><strong>P${c.periodo}:</strong> ${c.nombre}</li>`)
      .join("");

    const isPinned = pinnedId === id;
    const hint = isPinned
      ? `<span class="detalle__hint">📌 Curso fijado — haz click de nuevo o pulsa <strong>Esc</strong> para soltar.</span>`
      : ``;

    detalleEl.innerHTML = `
      <div class="detalle__head">
        <h3>${data.nombre}</h3>
        ${isPinned ? `<button class="detalle__close" aria-label="Cerrar">×</button>` : ``}
      </div>
      <p>Periodo ${data.periodo} · ${TIPO_INFO[data.tipo].label} · ${data.creditos} créditos${
        data.codigo ? ` · Cód. ${data.codigo}` : ""
      }</p>
      ${
        items
          ? `<p><strong>Requiere haber cursado:</strong></p>
             <ul class="detalle__list">${items}</ul>`
          : `<p>No tiene prerrequisitos registrados.</p>`
      }
      ${hint}
    `;
  }

  /* ---------- ESTADOS ---------- */

  function clearVisuals() {
    mallaEl.classList.remove("has-focus");
    mallaEl
      .querySelectorAll(".is-active, .is-prereq, .is-pinned")
      .forEach((el) => el.classList.remove("is-active", "is-prereq", "is-pinned"));
  }

  function clearAll() {
    pinnedId = null;
    clearVisuals();
    showPlaceholder();
  }

  function applyHighlight(id) {
    clearVisuals();

    const prereqs = getAllPrereqs(id);
    mallaEl.classList.add("has-focus");

    const activeEl = cursoElById.get(id);
    if (!activeEl) return;

    activeEl.classList.add("is-active");
    if (pinnedId === id) activeEl.classList.add("is-pinned");

    prereqs.forEach((pid) => {
      const el = cursoElById.get(pid);
      if (el) el.classList.add("is-prereq");
    });

    showDetail(id, prereqs);
  }

  /* ---------- EVENTOS ---------- */

  function attachEvents() {
    // Hover: vista previa
    mallaEl.addEventListener("mouseover", (e) => {
      const card = e.target.closest(".curso");
      if (card) applyHighlight(card.dataset.id);
    });

    // Salir de la malla: restaurar pin o limpiar
    mallaEl.addEventListener("mouseleave", () => {
      if (pinnedId) applyHighlight(pinnedId);
      else clearAll();
    });

    // Click: fija / despina
    mallaEl.addEventListener("click", (e) => {
      const card = e.target.closest(".curso");
      if (!card) {
        clearAll();
        return;
      }
      const id = card.dataset.id;
      if (pinnedId === id) {
        clearAll();
      } else {
        pinnedId = id;
        applyHighlight(id);
      }
    });

    // Teclado en curso
    mallaEl.addEventListener("keydown", (e) => {
      const card = e.target.closest(".curso");
      if (!card) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const id = card.dataset.id;
        if (pinnedId === id) clearAll();
        else {
          pinnedId = id;
          applyHighlight(id);
        }
      }
    });

    // Esc
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") clearAll();
    });

    // Botón X (delegado)
    detalleEl.addEventListener("click", (e) => {
      if (e.target.closest(".detalle__close")) clearAll();
    });
  }

  render();
  showPlaceholder();
  attachEvents();
})();
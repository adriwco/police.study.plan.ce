const MODULE_META = {
  "00": { block: "base", blockLabel: "Base & Método", weight: "Método obrigatório" },
  "01": { block: "base", blockLabel: "Base & Método", weight: "Base do Direito" },
  "02": { block: "base", blockLabel: "Base & Método", weight: "Base Exatas" },
  "03": { block: "basicas", blockLabel: "Básicas · 30q", weight: "10 questões" },
  "04": { block: "basicas", blockLabel: "Básicas · 30q", weight: "10 questões" },
  "05": { block: "basicas", blockLabel: "Básicas · 30q", weight: "10 questões" },
  "06": { block: "juridico", blockLabel: "Jurídico · 50q", weight: "8 questões" },
  "07": { block: "juridico", blockLabel: "Jurídico · 50q", weight: "8 questões" },
  "08": { block: "juridico", blockLabel: "Jurídico · 50q", weight: "8 questões · Penal" },
  "09": { block: "juridico", blockLabel: "Jurídico · 50q", weight: "8 questões · Penal" },
  "10": { block: "juridico", blockLabel: "Jurídico · 50q", weight: "8 questões" },
  "11": { block: "juridico", blockLabel: "Jurídico · 50q", weight: "8 questões" },
  "12": { block: "juridico", blockLabel: "Jurídico · 50q", weight: "10 questões · Desempate" },
  "13": { block: "especificas", blockLabel: "Específicas · 20q", weight: "5 questões" },
  "14": { block: "especificas", blockLabel: "Específicas · 20q", weight: "5 questões" },
  "15": { block: "especificas", blockLabel: "Específicas · 20q", weight: "5 questões" },
  "16": { block: "especificas", blockLabel: "Específicas · 20q", weight: "5 questões" },
  "17": { block: "final", blockLabel: "Redação & Reta Final", weight: "Discursiva · 30 pts" },
  "18": { block: "final", blockLabel: "Redação & Reta Final", weight: "Simulados & TAF" }
};

const BLOCK_DEFS = [
  { id: "juridico", name: "Jurídico (50q)" },
  { id: "basicas", name: "Básicas (30q)" },
  { id: "especificas", name: "Específicas (20q)" },
  { id: "base", name: "Base & Método" }
];

const TEXT_SNIPPETS = {
  resumo: "SÍNTESE PESSOAL:\n- Ideia central: \n- Conceito-chave: \n- Conclusão: \n",
  lei: "DISPOSITIVO LEGAL:\n- Artigo / Lei: \n- Preceito (conduta): \n- Sanção / Consequência: \n",
  pegadinha: "DISTINÇÃO DE PROVA (CEV/UECE):\n- O que parece certo mas induz a erro: \n- Regra exata: \n",
  check: "VERIFICAÇÃO DE ESTUDO:\n[ ] Li a explicação de base\n[ ] Compreendi os termos técnicos\n[ ] Expliquei em voz alta sem consulta\n[ ] Resolvi as questões da aula\n"
};

const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {}
  }
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function todayIso() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDaysIso(baseIso, days) {
  const parts = String(baseIso).split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return todayIso();
  const dt = new Date(parts[0], parts[1] - 1, parts[2]);
  dt.setDate(dt.getDate() + days);
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatBrDate(iso) {
  if (!iso || typeof iso !== "string") return "";
  const parts = iso.slice(0, 10).split("-");
  if (parts.length !== 3) return iso;
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

function sanitizeRenderedHtml(root) {
  root.querySelectorAll("script, iframe, object, embed, form").forEach(el => el.remove());
  root.querySelectorAll("*").forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      const name = attr.name.toLowerCase();
      const val = attr.value.trim().toLowerCase();
      if (name.startsWith("on")) {
        el.removeAttribute(attr.name);
      } else if ((name === "href" || name === "src") && val.startsWith("javascript:")) {
        el.removeAttribute(attr.name);
      }
    });
    if (el.tagName === "A") {
      const href = el.getAttribute("href") || "";
      if (/^https?:\/\//i.test(href)) {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      }
    }
  });
}

const mdCache = new Map();

const ui = {
  trilha: null,
  lista: [],
  feitas: store.get("pcce.feitas", {}),
  abertos: store.get("pcce.abertos", { "00": true, "01": true }),
  dias: store.get("pcce.dias", {}),
  revisoes: store.get("pcce.revisoes", {}),
  favoritos: store.get("pcce.favoritos", {}),
  questoes: store.get("pcce.questoes", {}),
  ultimaAula: store.get("pcce.ultima", null),
  sidebarFilterText: "",
  sidebarFilterChip: "all",
  homeBlockFilter: "all",
  editalBlockFilter: "all",
  editalSearch: "",
  cadernoSearch: "",
  tocObserver: null,
  cmdOpen: false,
  cmdSelectedIdx: 0,
  cmdFiltered: [],
  lastFocusBeforeModal: null,
  pomo: {
    mode: "25",
    secondsLeft: 25 * 60,
    totalSeconds: 25 * 60,
    running: false,
    timerId: null,
    stats: store.get("pcce.pomoStats", { date: todayIso(), cycles: 0, minutes: 0 })
  },

  async init() {
    this.syncStudyDaysFromCompleted();
    this.initThemeAndFont();
    this.initPomodoroStats();
    this.bindGlobalEvents();

    try {
      const response = await fetch("aulas/trilha.json", { cache: "no-cache" });
      if (!response.ok) throw new Error("Falha ao buscar trilha");
      this.trilha = await response.json();
    } catch {
      const mainEl = document.getElementById("main-content");
      if (mainEl) {
        mainEl.innerHTML = `<div class="page-container"><article class="lesson-article"><h1>Não foi possível carregar a trilha de estudos</h1><p>Execute <code>python3 -m http.server 8000</code> na pasta do projeto e acesse <code>http://localhost:8000</code>.</p></article></div>`;
      }
      return;
    }

    this.lista = [];
    this.trilha.modulos.forEach(mod => {
      const meta = MODULE_META[mod.id] || { block: "base", blockLabel: "Base", weight: "Curso" };
      mod.meta = meta;
      mod.aulas.forEach((aula, idx) => {
        this.lista.push({
          ...aula,
          ordemNoModulo: idx + 1,
          modulo: mod
        });
      });
    });

    this.renderTree();
    this.updateHeaderIndicators();
    window.addEventListener("hashchange", () => this.route());
    await this.route();
  },

  syncStudyDaysFromCompleted() {
    let changed = false;
    Object.values(this.feitas).forEach(dateVal => {
      if (typeof dateVal === "string" && /^\d{4}-\d{2}-\d{2}/.test(dateVal)) {
        const d = dateVal.slice(0, 10);
        if (!this.dias[d]) {
          this.dias[d] = true;
          changed = true;
        }
      }
    });
    if (changed) store.set("pcce.dias", this.dias);
  },

  recordStudyActivityToday() {
    const today = todayIso();
    if (!this.dias[today]) {
      this.dias[today] = true;
      store.set("pcce.dias", this.dias);
    }
  },

  initThemeAndFont() {
    const savedTheme = store.get("pcce.tema", null);
    const theme = savedTheme || "light";
    document.documentElement.dataset.theme = theme;

    const savedFont = store.get("pcce.escalaFonte", "md");
    document.documentElement.dataset.fontScale = savedFont;
    this.updateThemeButtonLabel();
  },

  initPomodoroStats() {
    const today = todayIso();
    if (this.pomo.stats.date !== today) {
      this.pomo.stats = { date: today, cycles: 0, minutes: 0 };
      store.set("pcce.pomoStats", this.pomo.stats);
    }
    this.updateHeaderPomo();
  },

  bindGlobalEvents() {
    window.addEventListener("scroll", () => this.updateReadingProgress(), { passive: true });

    window.addEventListener("keydown", e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        this.toggleCommandPalette();
        return;
      }
      if (e.key === "Escape") {
        if (this.cmdOpen) {
          e.preventDefault();
          this.closeCommandPalette();
          return;
        }
        const backupModal = document.getElementById("backup-modal");
        if (backupModal && backupModal.classList.contains("open")) {
          e.preventDefault();
          this.closeBackupModal();
          return;
        }
        this.toggleMenu(false);
      }

      const activeTag = document.activeElement ? document.activeElement.tagName : "";
      const isTyping = activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT";
      if (!isTyping && !this.cmdOpen) {
        if (e.key === "/") {
          e.preventDefault();
          this.openCommandPalette();
        } else if (e.key.toLowerCase() === "f" && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          this.toggleFocusMode();
        }
      }
    });

    const cmdInput = document.getElementById("cmd-input");
    if (cmdInput) {
      cmdInput.addEventListener("input", () => {
        this.cmdSelectedIdx = 0;
        this.renderCommandResults(cmdInput.value);
      });
      cmdInput.addEventListener("keydown", e => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          if (this.cmdFiltered.length) {
            this.cmdSelectedIdx = (this.cmdSelectedIdx + 1) % this.cmdFiltered.length;
            this.highlightCommandSelection();
          }
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (this.cmdFiltered.length) {
            this.cmdSelectedIdx = (this.cmdSelectedIdx - 1 + this.cmdFiltered.length) % this.cmdFiltered.length;
            this.highlightCommandSelection();
          }
        } else if (e.key === "Enter") {
          e.preventDefault();
          const chosen = this.cmdFiltered[this.cmdSelectedIdx];
          if (chosen) this.executeCommandItem(chosen);
        }
      });
    }

    const filterInput = document.getElementById("sidebar-filter-input");
    if (filterInput) {
      filterInput.addEventListener("input", e => {
        this.sidebarFilterText = e.target.value.trim();
        const clearBtn = document.getElementById("sidebar-filter-clear");
        if (clearBtn) clearBtn.classList.toggle("show", this.sidebarFilterText.length > 0);
        this.renderTree();
      });
    }
  },

  clearSidebarFilter() {
    this.sidebarFilterText = "";
    const filterInput = document.getElementById("sidebar-filter-input");
    if (filterInput) filterInput.value = "";
    const clearBtn = document.getElementById("sidebar-filter-clear");
    if (clearBtn) clearBtn.classList.remove("show");
    this.renderTree();
  },

  setSidebarChip(chip) {
    this.sidebarFilterChip = chip;
    document.querySelectorAll("[data-side-chip]").forEach(btn => {
      const isMatch = btn.getAttribute("data-side-chip") === chip;
      btn.classList.toggle("active", isMatch);
      btn.setAttribute("aria-pressed", String(isMatch));
    });
    this.renderTree();
  },

  toggleTheme() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    store.set("pcce.tema", next);
    this.updateThemeButtonLabel();
    this.toast(next === "dark" ? "Tema Escuro (Carbon)" : "Tema Claro (Editorial Paper)");
  },

  updateThemeButtonLabel() {
    const btn = document.getElementById("theme-btn");
    if (!btn) return;
    const isDark = document.documentElement.dataset.theme === "dark";
    btn.textContent = isDark ? "Luz" : "Escuro";
    btn.setAttribute("aria-label", isDark ? "Alternar para tema claro" : "Alternar para tema escuro");
  },

  cycleFontScale() {
    const order = ["sm", "md", "lg", "xl"];
    const labels = { sm: "Escala tipográfica: 94%", md: "Escala tipográfica: 100%", lg: "Escala tipográfica: 114%", xl: "Escala tipográfica: 125%" };
    const current = document.documentElement.dataset.fontScale || "md";
    const next = order[(order.indexOf(current) + 1) % order.length];
    document.documentElement.dataset.fontScale = next;
    store.set("pcce.escalaFonte", next);
    this.toast(labels[next]);
  },

  toggleFocusMode() {
    const enabled = document.body.classList.toggle("focus-mode");
    const btn = document.getElementById("focus-btn");
    if (btn) {
      btn.classList.toggle("active", enabled);
      btn.setAttribute("aria-pressed", String(enabled));
    }
    this.toast(enabled ? "Modo Foco ativo (F para sair)" : "Modo Foco desativado");
  },

  toggleMenu(force) {
    const side = document.getElementById("side");
    const backdrop = document.getElementById("sidebar-backdrop");
    const menuBtn = document.getElementById("menu-btn");
    if (!side) return;
    const isOpen = side.classList.toggle("show", force);
    if (backdrop) backdrop.classList.toggle("show", isOpen);
    if (menuBtn) menuBtn.setAttribute("aria-expanded", String(isOpen));
  },

  toggleMod(id) {
    this.abertos[id] = !this.abertos[id];
    store.set("pcce.abertos", this.abertos);
    this.renderTree();
  },

  expandAllModules(openState) {
    if (!this.trilha) return;
    this.trilha.modulos.forEach(m => {
      this.abertos[m.id] = openState;
    });
    store.set("pcce.abertos", this.abertos);
    this.renderTree();
  },

  prontas(modulo) {
    return modulo.aulas.filter(a => a.arquivo);
  },

  hasNote(lessonId) {
    const val = store.get("pcce.nota." + lessonId, "");
    return typeof val === "string" && val.trim().length > 0;
  },

  getAllNotesList() {
    return this.lista
      .map(aula => {
        const text = store.get("pcce.nota." + aula.id, "");
        return { aula, text: typeof text === "string" ? text.trim() : "" };
      })
      .filter(item => item.text.length > 0);
  },

  calculateStreak() {
    const today = todayIso();
    let streak = 0;
    let cursor = this.dias[today] ? today : addDaysIso(today, -1);
    while (this.dias[cursor]) {
      streak++;
      cursor = addDaysIso(cursor, -1);
    }
    const last28 = [];
    for (let i = 27; i >= 0; i--) {
      const d = addDaysIso(today, -i);
      last28.push({ date: d, active: !!this.dias[d], isToday: d === today });
    }
    return {
      streak,
      totalDays: Object.keys(this.dias).length,
      last28
    };
  },

  getSpacedRevisions() {
    const today = todayIso();
    const due = [];
    const upcoming = [];
    const cycles = [
      { key: "r1", days: 1, label: "24h" },
      { key: "r7", days: 7, label: "7d" },
      { key: "r30", days: 30, label: "30d" }
    ];

    this.lista.forEach(aula => {
      const completedDate = this.feitas[aula.id];
      if (!completedDate) return;
      const revRecord = this.revisoes[aula.id] || {};
      for (const c of cycles) {
        if (revRecord[c.key]) continue;
        const targetDate = addDaysIso(completedDate.slice(0, 10), c.days);
        const entry = {
          aula,
          cycleKey: c.key,
          cycleLabel: c.label,
          targetDate,
          completedDate: completedDate.slice(0, 10)
        };
        if (targetDate <= today) {
          due.push(entry);
        } else {
          upcoming.push(entry);
        }
        break;
      }
    });

    due.sort((a, b) => a.targetDate.localeCompare(b.targetDate));
    upcoming.sort((a, b) => a.targetDate.localeCompare(b.targetDate));
    return { due, upcoming };
  },

  completeRevisionCycle(lessonId, cycleKey) {
    if (!this.revisoes[lessonId]) this.revisoes[lessonId] = {};
    if (this.revisoes[lessonId][cycleKey]) {
      delete this.revisoes[lessonId][cycleKey];
      this.toast("Ciclo de revisão desmarcado");
    } else {
      this.revisoes[lessonId][cycleKey] = todayIso();
      this.recordStudyActivityToday();
      this.toast("Revisão registrada");
    }
    store.set("pcce.revisoes", this.revisoes);
    this.updateHeaderIndicators();
    this.renderTree();
    const h = location.hash;
    if (h === "" || h === "#/" || h === "#/revisoes" || h === "#/edital") {
      this.route(false);
    }
  },

  updateHeaderIndicators() {
    const prontas = this.lista.filter(a => a.arquivo);
    const concluidas = prontas.filter(a => this.feitas[a.id]).length;
    const pct = prontas.length ? Math.round((concluidas * 100) / prontas.length) : 0;

    const gText = document.getElementById("g-text");
    const gPct = document.getElementById("g-pct");
    const gBar = document.getElementById("g-bar");
    const gProgressWrap = document.getElementById("g-progress-wrap");
    if (gText) gText.textContent = `${concluidas}/${prontas.length}`;
    if (gPct) gPct.textContent = `${pct}%`;
    if (gBar) gBar.style.width = `${pct}%`;
    if (gProgressWrap) gProgressWrap.setAttribute("aria-valuenow", String(pct));

    const { streak } = this.calculateStreak();
    const streakEl = document.getElementById("header-streak");
    if (streakEl) {
      streakEl.classList.toggle("active", streak > 0);
      streakEl.innerHTML = `<span>RITMO</span><b>${streak}d</b>`;
    }

    const { due } = this.getSpacedRevisions();
    const revCountEl = document.getElementById("nav-rev-count");
    if (revCountEl) {
      revCountEl.textContent = String(due.length);
      revCountEl.classList.toggle("warn", due.length > 0);
    }

    const notesCount = this.getAllNotesList().length;
    const notesCountEl = document.getElementById("nav-notes-count");
    if (notesCountEl) {
      notesCountEl.textContent = String(notesCount);
    }
  },

  renderTree() {
    if (!this.trilha) return;
    const currentHash = location.hash || "#/";
    const activeLessonId = (currentHash.match(/^#\/aula\/(.+)/) || [])[1];

    document.querySelectorAll(".sidebar-nav-link").forEach(link => {
      const href = link.getAttribute("href");
      const isCurrent = href === currentHash || (href === "#/" && (currentHash === "" || currentHash === "#/"));
      link.classList.toggle("active", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    const query = this.sidebarFilterText.toLowerCase();
    const chip = this.sidebarFilterChip;

    const html = this.trilha.modulos
      .map(mod => {
        const filteredLessons = mod.aulas.filter(aula => {
          if (chip === "pending" && this.feitas[aula.id]) return false;
          if (chip === "done" && !this.feitas[aula.id]) return false;
          if (chip === "fav" && !this.favoritos[aula.id]) return false;
          if (query) {
            const matchLesson = aula.titulo.toLowerCase().includes(query) || aula.id.toLowerCase().includes(query);
            const matchMod = mod.titulo.toLowerCase().includes(query);
            return matchLesson || matchMod;
          }
          return true;
        });

        if ((query || chip !== "all") && filteredLessons.length === 0) return "";

        const prontas = this.prontas(mod);
        const okCount = prontas.filter(a => this.feitas[a.id]).length;
        const pct = prontas.length ? Math.round((okCount * 100) / prontas.length) : 0;
        const isOpen = query || chip !== "all" ? true : !!this.abertos[mod.id];

        return `<div class="mod-group ${isOpen ? "open" : ""}">
          <button type="button" class="mod-header-btn" onclick="ui.toggleMod('${escapeHtml(mod.id)}')" aria-expanded="${isOpen}">
            <span class="mod-badge">${escapeHtml(mod.id)}</span>
            <span class="mod-info">
              <span class="mod-title-row">
                <span class="mod-name">${escapeHtml(mod.titulo)}</span>
                <span class="mod-count">${okCount}/${prontas.length}</span>
              </span>
              <span class="mod-mini-bar"><span style="width:${pct}%"></span></span>
            </span>
            <span class="mod-chevron" aria-hidden="true">›</span>
          </button>
          <ul class="mod-lessons">
            ${filteredLessons
              .map(a => {
                const isDone = !!this.feitas[a.id];
                const isActive = a.id === activeLessonId;
                const isFav = !!this.favoritos[a.id];
                const hasNota = this.hasNote(a.id);
                return `<li>
                  <a href="#/aula/${escapeHtml(a.id)}" class="lesson-link ${isDone ? "ok" : ""} ${isActive ? "active" : ""}" ${isActive ? 'aria-current="page"' : ""}>
                    <span class="lesson-status-dot" aria-hidden="true">${isDone ? "✓" : ""}</span>
                    <span class="lesson-title-text">${escapeHtml(a.titulo)}</span>
                    <span class="lesson-meta-icons">
                      ${isFav ? '<span title="Marcada">★</span>' : ""}
                      ${hasNota ? '<span title="Anotação salva">N</span>' : ""}
                    </span>
                  </a>
                </li>`;
              })
              .join("")}
          </ul>
        </div>`;
      })
      .join("");

    const treeEl = document.getElementById("tree");
    if (treeEl) {
      treeEl.innerHTML = html || `<div style="padding:24px 16px;text-align:center;color:var(--text-muted);font-size:0.78rem">Nenhum registro para este filtro.</div>`;
    }
  },

  async route(shouldScrollTop = true) {
    this.toggleMenu(false);
    if (this.tocObserver) {
      this.tocObserver.disconnect();
      this.tocObserver = null;
    }

    const h = location.hash || "#/";
    if (h.startsWith("#/aula/")) {
      await this.renderLessonView(decodeURIComponent(h.slice(7)));
    } else if (h === "#/guia") {
      await this.renderGuideView();
    } else if (h === "#/edital") {
      this.renderEditalView();
    } else if (h === "#/revisoes") {
      this.renderRevisionsView();
    } else if (h === "#/caderno") {
      this.renderNotebookHubView();
    } else {
      this.renderDashboardView();
    }

    this.renderTree();
    this.updateHeaderIndicators();
    if (shouldScrollTop) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    this.updateReadingProgress();
  },

  renderDashboardView() {
    document.title = "PCCE · Plano de Estudos — Oficial Investigador";
    const main = document.getElementById("main-content");
    if (!main) return;

    const prontas = this.lista.filter(a => a.arquivo);
    const concluidas = prontas.filter(a => this.feitas[a.id]).length;
    const pctGlobal = prontas.length ? Math.round((concluidas * 100) / prontas.length) : 0;

    const nextUnfinished = this.lista.find(a => a.arquivo && !this.feitas[a.id]) || this.lista[0];
    const resumeTarget = (this.ultimaAula && this.lista.find(a => a.id === this.ultimaAula && !this.feitas[a.id])) || nextUnfinished;

    const { streak, totalDays, last28 } = this.calculateStreak();
    const { due } = this.getSpacedRevisions();

    const blockMetrics = BLOCK_DEFS.map(b => {
      const lessonsInBlock = this.lista.filter(a => a.arquivo && a.modulo.meta.block === b.id);
      const doneInBlock = lessonsInBlock.filter(a => this.feitas[a.id]).length;
      const pct = lessonsInBlock.length ? Math.round((doneInBlock * 100) / lessonsInBlock.length) : 0;
      return { ...b, total: lessonsInBlock.length, done: doneInBlock, pct };
    });

    const filteredModules = this.trilha.modulos.filter(m => {
      if (this.homeBlockFilter === "all") return true;
      return m.meta.block === this.homeBlockFilter;
    });

    main.innerHTML = `<div class="page-container">
      <section class="swiss-board" aria-labelledby="hero-title">
        <div class="swiss-hero-cell">
          <div>
            <div class="eyebrow-mono">POLÍCIA CIVIL DO CEARÁ · OFICIAL INVESTIGADOR · 272 AULAS</div>
            <h1 id="hero-title" class="editorial-headline">Formação jurídica e exata <em>do zero absoluto.</em></h1>
            <p class="editorial-lead">Estrutura progressiva de 19 módulos desenhada para quem nunca estudou Direito, Matemática ou Raciocínio Lógico. Cada tópico avança da intuição prática até a letra da lei e o padrão da banca CEV/UECE.</p>
          </div>
          <div class="resume-strip">
            <div>
              <span class="resume-meta-label">PRÓXIMA LEITURA · MÓDULO ${escapeHtml(resumeTarget ? resumeTarget.modulo.id : "00")} (${escapeHtml(resumeTarget ? resumeTarget.modulo.meta.weight : "")})</span>
              <div class="resume-lesson-name">${escapeHtml(resumeTarget ? `${resumeTarget.id} — ${resumeTarget.titulo}` : "Curso concluído")}</div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              ${resumeTarget ? `<a class="btn primary" href="#/aula/${escapeHtml(resumeTarget.id)}">Continuar leitura →</a>` : ""}
              <a class="btn" href="#/edital">Edital verticalizado</a>
            </div>
          </div>
        </div>

        <div class="swiss-metrics-grid" aria-label="Quadro de operação e progresso">
          <div class="metric-cell">
            <div class="metric-head">
              <span class="metric-label">01 / Cobertura</span>
              <span class="metric-tag">${concluidas} de ${prontas.length} aulas</span>
            </div>
            <div class="metric-big-num">${pctGlobal}%</div>
            <div class="blocks-compact">
              ${blockMetrics
                .map(
                  b => `<div class="block-row-line">
                    <span class="block-row-name">${escapeHtml(b.name)}</span>
                    <div class="progress-track"><div class="progress-fill accent" style="width:${b.pct}%"></div></div>
                    <span class="block-row-val">${b.pct}%</span>
                  </div>`
                )
                .join("")}
            </div>
          </div>

          <div class="metric-cell">
            <div class="metric-head">
              <span class="metric-label">02 / Constância</span>
              <span class="metric-tag">${totalDays}d registrados</span>
            </div>
            <div class="metric-big-num">${streak}d <span style="font-size:0.75rem;font-weight:400;color:var(--text-muted)">seguidos</span></div>
            <div class="streak-matrix" title="Registro dos últimos 28 dias" aria-label="Matriz de constância dos últimos 28 dias">
              ${last28.map(d => `<span class="streak-cell ${d.active ? "on" : ""} ${d.isToday ? "today" : ""}" title="${formatBrDate(d.date)}${d.active ? " · Ativo" : ""}"></span>`).join("")}
            </div>
          </div>

          <div class="metric-cell">
            <div class="metric-head">
              <span class="metric-label">03 / Sessão</span>
              <span class="metric-tag" id="bento-pomo-cycles">${this.pomo.stats.cycles} ciclos hoje</span>
            </div>
            <div class="pomo-inline">
              <div id="bento-pomo-time" class="metric-big-num">${this.formatSeconds(this.pomo.secondsLeft)}</div>
              <div class="pomo-mode-row" role="group" aria-label="Duração da sessão">
                <button type="button" class="pomo-chip ${this.pomo.mode === "25" ? "active" : ""}" onclick="ui.setPomoMode('25')">25M</button>
                <button type="button" class="pomo-chip ${this.pomo.mode === "50" ? "active" : ""}" onclick="ui.setPomoMode('50')">50M</button>
                <button type="button" class="pomo-chip ${this.pomo.mode === "5" ? "active" : ""}" onclick="ui.setPomoMode('5')">05M</button>
              </div>
            </div>
            <div style="display:flex;gap:6px">
              <button type="button" class="btn sm primary" id="bento-pomo-toggle" onclick="ui.togglePomodoro()">${this.pomo.running ? "Pausar" : "Iniciar"}</button>
              <button type="button" class="btn sm" onclick="ui.resetPomodoro()">Zerar</button>
            </div>
          </div>

          <div class="metric-cell">
            <div class="metric-head">
              <span class="metric-label">04 / Retenção</span>
              <a href="#/revisoes" class="metric-tag">${due.length} pendentes →</a>
            </div>
            <div>
              ${
                due.length
                  ? due
                      .slice(0, 2)
                      .map(
                        item => `<div class="rev-item-mini" style="margin-bottom:4px">
                          <div class="rev-item-info">
                            <a href="#/aula/${escapeHtml(item.aula.id)}" class="rev-item-title">${escapeHtml(item.aula.id)} · ${escapeHtml(item.aula.titulo)}</a>
                            <div class="rev-item-sub">
                              <span class="rev-cycle-tag">CICLO ${escapeHtml(item.cycleLabel)}</span>
                            </div>
                          </div>
                          <button type="button" class="btn sm primary" onclick="ui.completeRevisionCycle('${escapeHtml(item.aula.id)}','${escapeHtml(item.cycleKey)}')">OK</button>
                        </div>`
                      )
                      .join("")
                  : `<div style="font-size:0.76rem;color:var(--text-muted);line-height:1.45">Sem revisões vencidas hoje. Ciclos de 24h, 7d e 30d entram após cada aula concluída.</div>`
              }
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
              <button type="button" class="btn sm" onclick="ui.openBackupModal()">Backup JSON</button>
              <a href="#/caderno" style="font-family:var(--font-mono);font-size:0.68rem;white-space:nowrap">Caderno →</a>
            </div>
          </div>
        </div>
      </section>

      <div class="section-bar">
        <div>
          <span class="section-kicker">ÍNDICE GERAL DO CURSO</span>
          <h2 class="section-title">Sequência de Módulos e Pesos do Edital</h2>
        </div>
        <div class="tabs-bar" style="margin-bottom:0" role="tablist" aria-label="Filtrar módulos por bloco">
          <button type="button" class="tab-btn ${this.homeBlockFilter === "all" ? "active" : ""}" onclick="ui.setHomeBlockFilter('all')">Todos (19)</button>
          <button type="button" class="tab-btn ${this.homeBlockFilter === "base" ? "active" : ""}" onclick="ui.setHomeBlockFilter('base')">Base (03)</button>
          <button type="button" class="tab-btn ${this.homeBlockFilter === "basicas" ? "active" : ""}" onclick="ui.setHomeBlockFilter('basicas')">Básicas · 30q (03)</button>
          <button type="button" class="tab-btn ${this.homeBlockFilter === "juridico" ? "active" : ""}" onclick="ui.setHomeBlockFilter('juridico')">Jurídico · 50q (07)</button>
          <button type="button" class="tab-btn ${this.homeBlockFilter === "especificas" ? "active" : ""}" onclick="ui.setHomeBlockFilter('especificas')">Específicas · 20q (04)</button>
          <button type="button" class="tab-btn ${this.homeBlockFilter === "final" ? "active" : ""}" onclick="ui.setHomeBlockFilter('final')">Discursiva & TAF (02)</button>
        </div>
      </div>

      <section class="modules-swiss-grid" aria-label="Módulos do curso">
        ${filteredModules
          .map(mod => {
            const p = this.prontas(mod);
            const ok = p.filter(a => this.feitas[a.id]).length;
            const pc = p.length ? Math.round((ok * 100) / p.length) : 0;
            const nextLesson = mod.aulas.find(a => a.arquivo && !this.feitas[a.id]) || mod.aulas[0];
            return `<a class="module-cell" href="#/aula/${escapeHtml(nextLesson.id)}">
              <div>
                <div class="module-cell-top">
                  <span class="module-index">MÓD. ${escapeHtml(mod.id)}</span>
                  <span class="module-weight-tag">${escapeHtml(mod.meta.weight)}</span>
                </div>
                <h3 class="module-cell-title">${escapeHtml(mod.titulo)}</h3>
                <p class="module-cell-desc">${escapeHtml(mod.descricao)}</p>
              </div>
              <div class="module-cell-foot">
                <div class="module-cell-stats">
                  <span>${ok}/${p.length} AULAS</span>
                  <span>${pc}%</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill ${pc > 0 ? "accent" : ""}" style="width:${pc}%"></div>
                </div>
              </div>
            </a>`;
          })
          .join("")}
      </section>
    </div>`;
  },

  setHomeBlockFilter(block) {
    this.homeBlockFilter = block;
    this.renderDashboardView();
  },

  async fetchMarkdownText(arquivo) {
    if (mdCache.has(arquivo)) return mdCache.get(arquivo);
    const res = await fetch(arquivo, { cache: "no-cache" });
    if (!res.ok) return "# Conteúdo não encontrado";
    const text = await res.text();
    mdCache.set(arquivo, text);
    return text;
  },

  prefetchLesson(aula) {
    if (!aula || !aula.arquivo || mdCache.has(aula.arquivo)) return;
    const run = () => {
      this.fetchMarkdownText(aula.arquivo).catch(() => {});
    };
    if ("requestIdleCallback" in window) window.requestIdleCallback(run);
    else setTimeout(run, 600);
  },

  async renderLessonView(id) {
    const idx = this.lista.findIndex(a => a.id === id);
    if (idx < 0) {
      this.renderDashboardView();
      return;
    }

    const aula = this.lista[idx];
    const mod = aula.modulo;
    this.abertos[mod.id] = true;
    store.set("pcce.abertos", this.abertos);
    this.ultimaAula = aula.id;
    store.set("pcce.ultima", aula.id);

    document.title = `${aula.id} ${aula.titulo} · Mód. ${mod.id} (${mod.titulo})`;

    const ant = this.lista.slice(0, idx).reverse().find(x => x.arquivo);
    const prox = this.lista.slice(idx + 1).find(x => x.arquivo);
    this.prefetchLesson(prox);

    const main = document.getElementById("main-content");
    if (!main) return;

    if (!mdCache.has(aula.arquivo)) {
      main.innerHTML = `<div class="lesson-workspace">
        <div class="lesson-article">
          <div class="skeleton-wrap" aria-busy="true" aria-label="Carregando aula">
            <div class="skeleton-line" style="width:45%;height:28px"></div>
            <div class="skeleton-line" style="width:90%"></div>
            <div class="skeleton-line" style="width:82%"></div>
            <div class="skeleton-line" style="width:86%"></div>
            <div class="skeleton-line" style="width:60%"></div>
          </div>
        </div>
      </div>`;
    }

    const rawMd = await this.fetchMarkdownText(aula.arquivo);
    const parsedHtml = marked.parse(rawMd);

    const isDone = !!this.feitas[id];
    const isFav = !!this.favoritos[id];
    const nota = store.get("pcce.nota." + id, "");

    main.innerHTML = `<div class="lesson-workspace">
      <div class="lesson-primary-col">
        <div class="lesson-topbar">
          <nav class="breadcrumbs" aria-label="Trilha de navegação">
            <a href="#/">Painel</a>
            <span aria-hidden="true">/</span>
            <a href="#/edital">Mód. ${escapeHtml(mod.id)} · ${escapeHtml(mod.titulo)}</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Aula ${String(aula.ordemNoModulo).padStart(2, "0")} de ${String(mod.aulas.length).padStart(2, "0")}</span>
          </nav>
          <div class="lesson-quick-tools">
            <button type="button" id="fav-btn" class="icon-btn ${isFav ? "active" : ""}" onclick="ui.toggleFavorite('${escapeHtml(id)}')" aria-pressed="${isFav}">
              <span>${isFav ? "★ Marcada" : "☆ Marcar"}</span>
            </button>
            <button type="button" class="icon-btn" onclick="ui.scrollToElement('lesson-notepad')">
              <span>Caderno</span>
            </button>
            <button type="button" id="top-done-btn" class="btn sm ${isDone ? "done" : "primary"}" onclick="ui.marcar('${escapeHtml(id)}')">
              ${isDone ? "✓ Concluída" : "Concluir aula"}
            </button>
          </div>
        </div>

        <article id="lesson-article" class="lesson-article">
          <div id="lesson-meta-strip" class="lesson-meta-strip">
            <span class="meta-pill">MÓDULO ${escapeHtml(mod.id)} · ${escapeHtml(mod.titulo)}</span>
            <span class="meta-pill">${escapeHtml(mod.meta.weight)}</span>
            ${isDone ? `<span class="meta-pill" style="color:var(--ok)">CONCLUÍDA EM ${formatBrDate(this.feitas[id])}</span>` : ""}
          </div>
          <div id="lesson-body-content">${parsedHtml}</div>
        </article>

        <section class="lesson-completion-card" aria-label="Registro de conclusão">
          <div>
            <b style="display:block;font-size:0.94rem">Critério de domínio: explicar em voz alta sem consultar o texto</b>
            <span style="font-size:0.8rem;color:var(--text-secondary)">Ao marcar como concluída, a aula entra na fila de revisão de 24h, 7 dias e 30 dias.</span>
          </div>
          <button type="button" id="done-btn" class="btn ${isDone ? "done" : "primary"}" onclick="ui.marcar('${escapeHtml(id)}')">
            ${isDone ? "✓ Aula concluída (desmarcar)" : "Marcar aula como concluída"}
          </button>
        </section>

        <section id="lesson-notepad" class="notepad-card" aria-labelledby="notepad-heading">
          <div class="notepad-header">
            <div class="notepad-title-group">
              <h2 id="notepad-heading" class="notepad-title">Caderno da Aula</h2>
              <span style="font-family:var(--font-mono);font-size:0.68rem;color:var(--text-muted)">Comandos rápidos: <code>/resumo</code> <code>/lei</code> <code>/pegadinha</code> <code>/check</code></span>
            </div>
            <span id="note-save-status" class="notepad-status">Salvo localmente</span>
          </div>
          <div class="notepad-toolbar" role="toolbar" aria-label="Inserir estrutura de nota">
            <button type="button" class="snippet-btn" onclick="ui.insertNoteSnippet('resumo')">+ Síntese</button>
            <button type="button" class="snippet-btn" onclick="ui.insertNoteSnippet('lei')">+ Dispositivo legal</button>
            <button type="button" class="snippet-btn" onclick="ui.insertNoteSnippet('pegadinha')">+ Distinção de banca</button>
            <button type="button" class="snippet-btn" onclick="ui.insertNoteSnippet('check')">+ Checklist</button>
            <button type="button" class="snippet-btn" onclick="ui.uppercaseSelectedNote()">MAIÚSCULAS</button>
            <button type="button" class="snippet-btn" onclick="ui.exportSingleNoteMarkdown('${escapeHtml(id)}')">Exportar .md</button>
          </div>
          <label for="nota" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)">Anotações da aula</label>
          <textarea id="nota" class="notepad-textarea" placeholder="Registre seu resumo com suas próprias palavras, artigos de lei ou digite /resumo, /lei, /pegadinha...">${escapeHtml(nota)}</textarea>
          <div class="notepad-foot">
            <span id="note-char-count">${nota.length} caracteres</span>
            <a href="#/caderno">Índice completo do caderno →</a>
          </div>
        </section>

        ${this.renderPagerHtml(ant, prox)}
      </div>

      <aside class="lesson-toc-aside" aria-label="Sumário da aula">
        <div class="toc-card">
          <h2 class="toc-title">Sumário da Aula</h2>
          <ul id="lesson-toc-list" class="toc-list"></ul>
        </div>
        <div class="toc-card">
          <h2 class="toc-title">Navegação</h2>
          <div style="display:grid;gap:6px;font-family:var(--font-mono);font-size:0.7rem;color:var(--text-secondary)">
            <div><kbd class="search-kbd">Ctrl+K</kbd> Busca global</div>
            <div><kbd class="search-kbd">F</kbd> Modo foco</div>
            <div><a href="#/edital">Edital verticalizado →</a></div>
            <div><a href="#/revisoes">Fila de revisões →</a></div>
          </div>
        </div>
      </aside>
    </div>`;

    const bodyContent = document.getElementById("lesson-body-content");
    if (bodyContent) {
      sanitizeRenderedHtml(bodyContent);
      this.enhanceLessonDom(bodyContent, aula);
    }

    this.bindNotepadEvents(id);
    this.scrollActiveLessonIntoSidebarView();
  },

  enhanceLessonDom(container, aula) {
    const firstBlockquote = container.querySelector("blockquote");
    const metaStrip = document.getElementById("lesson-meta-strip");
    if (firstBlockquote && metaStrip) {
      const text = firstBlockquote.textContent.trim();
      if (text.toLowerCase().includes("tempo") || text.toLowerCase().includes("pré-requisito")) {
        const parts = text.split("·").map(s => s.trim()).filter(Boolean);
        parts.forEach(part => {
          const span = document.createElement("span");
          span.className = "meta-pill";
          span.textContent = part;
          metaStrip.appendChild(span);
        });
        firstBlockquote.remove();
      }
    }

    container.querySelectorAll("table").forEach(tbl => {
      if (tbl.parentElement && tbl.parentElement.classList.contains("table-scroll-wrap")) return;
      const wrapper = document.createElement("div");
      wrapper.className = "table-scroll-wrap";
      wrapper.setAttribute("role", "region");
      wrapper.setAttribute("aria-label", "Tabela de dados");
      wrapper.setAttribute("tabindex", "0");
      tbl.parentNode.insertBefore(wrapper, tbl);
      wrapper.appendChild(tbl);
    });

    const tocList = document.getElementById("lesson-toc-list");
    const headings = Array.from(container.querySelectorAll("h1, h2, h3"));
    const h2Elements = [];
    let secCounter = 0;

    headings.forEach((h, i) => {
      if (!h.id) {
        const slug = h.textContent
          .trim()
          .toLowerCase()
          .replace(/[^\p{L}\p{N}\s-]/gu, "")
          .replace(/\s+/g, "-");
        h.id = slug || `secao-${i}`;
      }
      if (h.tagName === "H2") {
        secCounter++;
        const rawText = h.textContent.trim();
        const numStr = String(secCounter).padStart(2, "0");
        h.innerHTML = `<span class="sec-num-tag">§ ${numStr}</span><span>${escapeHtml(rawText)}</span>`;
        h2Elements.push({ el: h, title: rawText, numStr });
      }
    });

    if (tocList) {
      tocList.innerHTML = h2Elements
        .map(
          item => `<li><a href="#${escapeHtml(item.el.id)}" class="toc-link" data-toc-target="${escapeHtml(item.el.id)}"><span style="font-family:var(--font-mono);font-size:0.68rem;margin-right:6px;opacity:0.65">${item.numStr}</span>${escapeHtml(item.title)}</a></li>`
        )
        .join("");

      tocList.querySelectorAll("a[data-toc-target]").forEach(a => {
        a.addEventListener("click", e => {
          e.preventDefault();
          const targetId = a.getAttribute("data-toc-target");
          const targetEl = document.getElementById(targetId);
          if (targetEl) targetEl.scrollIntoView({ behavior: "smooth" });
        });
      });
    }

    container.querySelectorAll('a[href^="#"]').forEach(a => {
      const href = a.getAttribute("href") || "";
      if (href.length > 1 && !href.startsWith("#/")) {
        a.addEventListener("click", e => {
          e.preventDefault();
          const targetEl = document.getElementById(href.slice(1));
          if (targetEl) targetEl.scrollIntoView({ behavior: "smooth" });
        });
      }
    });

    this.enhanceQuizDetails(container, aula.id);

    if ("IntersectionObserver" in window && h2Elements.length > 0) {
      this.tocObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              document.querySelectorAll("#lesson-toc-list .toc-link").forEach(link => {
                link.classList.toggle("active", link.getAttribute("data-toc-target") === id);
              });
            }
          });
        },
        { rootMargin: "-85px 0px -70% 0px", threshold: 0 }
      );
      h2Elements.forEach(item => this.tocObserver.observe(item.el));
    }
  },

  enhanceQuizDetails(container, lessonId) {
    const detailsList = Array.from(container.querySelectorAll("details"));
    if (detailsList.length === 0) return;

    const firstDetails = detailsList[0];
    const scoreBanner = document.createElement("div");
    scoreBanner.id = "quiz-score-banner";
    scoreBanner.className = "quiz-score-banner";
    const insertRef = firstDetails.previousElementSibling || firstDetails;
    insertRef.parentNode.insertBefore(scoreBanner, insertRef);

    detailsList.forEach((detailsEl, idx) => {
      const qNum = idx + 1;
      const qKey = `${lessonId}#${qNum}`;
      const status = this.questoes[qKey] || "";

      const card = document.createElement("div");
      card.className = `quiz-card ${status === "hit" ? "status-hit" : status === "miss" ? "status-miss" : ""}`;
      card.id = `quiz-card-${qNum}`;

      const prevEl = detailsEl.previousElementSibling;
      detailsEl.parentNode.insertBefore(card, detailsEl);
      if (prevEl && prevEl.tagName === "P") {
        card.appendChild(prevEl);
      }
      card.appendChild(detailsEl);

      const summary = detailsEl.querySelector("summary");
      if (summary) {
        summary.textContent = "Conferir gabarito comentado";
      }

      const evalBar = document.createElement("div");
      evalBar.className = "quiz-eval-bar";
      evalBar.innerHTML = `<span>QUESTÃO ${String(qNum).padStart(2, "0")} — AUTOAVALIAÇÃO</span>
        <div class="quiz-eval-btns">
          <button type="button" class="quiz-eval-btn hit ${status === "hit" ? "active" : ""}" data-qnum="${qNum}" data-res="hit">Acertei</button>
          <button type="button" class="quiz-eval-btn miss ${status === "miss" ? "active" : ""}" data-qnum="${qNum}" data-res="miss">Revisar depois</button>
        </div>`;
      detailsEl.appendChild(evalBar);

      evalBar.querySelectorAll("button[data-res]").forEach(btn => {
        btn.addEventListener("click", () => {
          const res = btn.getAttribute("data-res");
          this.evaluateQuestion(lessonId, qNum, res, detailsList.length);
        });
      });
    });

    this.updateQuizScoreBanner(lessonId, detailsList.length);
  },

  evaluateQuestion(lessonId, qNum, result, totalQuestions) {
    const qKey = `${lessonId}#${qNum}`;
    if (this.questoes[qKey] === result) {
      delete this.questoes[qKey];
    } else {
      this.questoes[qKey] = result;
      this.recordStudyActivityToday();
    }
    store.set("pcce.questoes", this.questoes);

    const card = document.getElementById(`quiz-card-${qNum}`);
    if (card) {
      const current = this.questoes[qKey] || "";
      card.classList.toggle("status-hit", current === "hit");
      card.classList.toggle("status-miss", current === "miss");
      card.querySelectorAll("button[data-res]").forEach(b => {
        b.classList.toggle("active", b.getAttribute("data-res") === current);
      });
    }
    this.updateQuizScoreBanner(lessonId, totalQuestions);
  },

  updateQuizScoreBanner(lessonId, totalQuestions) {
    const banner = document.getElementById("quiz-score-banner");
    if (!banner) return;
    let hits = 0;
    let misses = 0;
    for (let i = 1; i <= totalQuestions; i++) {
      const st = this.questoes[`${lessonId}#${i}`];
      if (st === "hit") hits++;
      else if (st === "miss") misses++;
    }
    const answered = hits + misses;
    const pct = answered ? Math.round((hits * 100) / answered) : 0;
    banner.innerHTML = `<span>CADERNO DE QUESTÕES · <b>${hits} ACERTOS</b> / <b>${misses} REVISAR</b> (TOTAL: ${totalQuestions})</span>
      <span>${answered ? `${pct}% DE APROVEITAMENTO` : "RESPONDA ANTES DE REVELAR O GABARITO"}</span>`;
  },

  bindNotepadEvents(lessonId) {
    const textarea = document.getElementById("nota");
    const statusEl = document.getElementById("note-save-status");
    const countEl = document.getElementById("note-char-count");
    if (!textarea) return;

    textarea.addEventListener("input", () => {
      let val = textarea.value;
      const slashRules = [
        { trigger: "/resumo ", text: TEXT_SNIPPETS.resumo },
        { trigger: "/lei ", text: TEXT_SNIPPETS.lei },
        { trigger: "/pegadinha ", text: TEXT_SNIPPETS.pegadinha },
        { trigger: "/check ", text: TEXT_SNIPPETS.check },
        { trigger: "/hoje ", text: `[${formatBrDate(todayIso())}] ` }
      ];

      for (const rule of slashRules) {
        if (val.includes(rule.trigger)) {
          val = val.replace(rule.trigger, rule.text);
          textarea.value = val;
          this.toast("Modelo inserido");
          break;
        }
      }

      store.set("pcce.nota." + lessonId, val);
      this.recordStudyActivityToday();
      if (countEl) countEl.textContent = `${val.length} caracteres`;
      if (statusEl) {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        statusEl.textContent = `Salvo às ${hh}:${mm}`;
      }
      this.updateHeaderIndicators();
    });
  },

  insertNoteSnippet(type) {
    const textarea = document.getElementById("nota");
    if (!textarea || !TEXT_SNIPPETS[type]) return;
    const snippet = TEXT_SNIPPETS[type];
    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? textarea.value.length;
    const prefix = textarea.value.length > 0 && !textarea.value.endsWith("\n") ? "\n\n" : "";
    textarea.value = textarea.value.slice(0, start) + prefix + snippet + textarea.value.slice(end);
    textarea.dispatchEvent(new Event("input"));
    textarea.focus();
  },

  uppercaseSelectedNote() {
    const textarea = document.getElementById("nota");
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start === end) {
      this.toast("Selecione um trecho para converter em MAIÚSCULAS");
      return;
    }
    const selected = textarea.value.slice(start, end).toUpperCase();
    textarea.value = textarea.value.slice(0, start) + selected + textarea.value.slice(end);
    textarea.setSelectionRange(start, end);
    textarea.dispatchEvent(new Event("input"));
    textarea.focus();
  },

  exportSingleNoteMarkdown(lessonId) {
    const aula = this.lista.find(a => a.id === lessonId);
    const note = store.get("pcce.nota." + lessonId, "");
    if (!note || !note.trim()) {
      this.toast("Anotação vazia");
      return;
    }
    const content = `# ${aula ? aula.titulo : lessonId}\nMódulo ${aula ? `${aula.modulo.id} - ${aula.modulo.titulo}` : ""}\n\n${note}\n`;
    this.downloadTextFile(`nota-${lessonId}.md`, content, "text/markdown;charset=utf-8");
  },

  renderPagerHtml(ant, prox) {
    return `<nav class="lesson-pager" aria-label="Navegação entre aulas">
      ${
        ant
          ? `<a class="pager-card prev" href="#/aula/${escapeHtml(ant.id)}">
              <span class="pager-dir">← Anterior · ${escapeHtml(ant.id)}</span>
              <span class="pager-title">${escapeHtml(ant.titulo)}</span>
            </a>`
          : `<div class="pager-card"></div>`
      }
      ${
        prox
          ? `<a class="pager-card next" href="#/aula/${escapeHtml(prox.id)}">
              <span class="pager-dir">Próxima · ${escapeHtml(prox.id)} →</span>
              <span class="pager-title">${escapeHtml(prox.titulo)}</span>
            </a>`
          : `<div class="pager-card"></div>`
      }
    </nav>`;
  },

  async renderGuideView() {
    document.title = "Guia Diretor PCCE · Estratégia, Ciclos e Edital";
    const main = document.getElementById("main-content");
    if (!main) return;

    const rawMd = await this.fetchMarkdownText("GUIA-COMPLETO-PCCE.md");
    const parsedHtml = marked.parse(rawMd);

    main.innerHTML = `<div class="lesson-workspace">
      <div class="lesson-primary-col">
        <div class="lesson-topbar">
          <nav class="breadcrumbs" aria-label="Trilha de navegação">
            <a href="#/">Painel</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Guia Completo PCCE</span>
          </nav>
          <a href="#/" class="btn sm">← Painel</a>
        </div>
        <article class="lesson-article">
          <div id="guide-body">${parsedHtml}</div>
        </article>
      </div>
      <aside class="lesson-toc-aside" aria-label="Sumário do guia">
        <div class="toc-card">
          <h2 class="toc-title">Capítulos do Guia</h2>
          <ul id="lesson-toc-list" class="toc-list"></ul>
        </div>
      </aside>
    </div>`;

    const guideBody = document.getElementById("guide-body");
    if (guideBody) {
      sanitizeRenderedHtml(guideBody);
      this.enhanceLessonDom(guideBody, { id: "guia" });
    }
  },

  renderEditalView() {
    document.title = "Edital Verticalizado PCCE · Controle de Tópicos e Revisões";
    const main = document.getElementById("main-content");
    if (!main) return;

    const query = this.editalSearch.toLowerCase();
    const filteredMods = this.trilha.modulos.filter(m => {
      if (this.editalBlockFilter !== "all" && m.meta.block !== this.editalBlockFilter) return false;
      if (!query) return true;
      const modMatch = m.titulo.toLowerCase().includes(query);
      const lessonMatch = m.aulas.some(a => a.titulo.toLowerCase().includes(query));
      return modMatch || lessonMatch;
    });

    main.innerHTML = `<div class="page-container">
      <div class="section-bar" style="margin-top:0">
        <div>
          <span class="section-kicker">MATRIZ PROGRAMÁTICA</span>
          <h1 class="section-title">Edital Verticalizado e Ciclos de Revisão (R1 · R2 · R3)</h1>
        </div>
        <input type="search" id="edital-search-input" class="sidebar-filter-input" style="max-width:260px;height:34px" placeholder="Filtrar matéria ou tópico..." value="${escapeHtml(this.editalSearch)}" aria-label="Filtrar matéria ou tópico">
      </div>

      <div class="tabs-bar" role="tablist" aria-label="Filtrar edital por bloco">
        <button type="button" class="tab-btn ${this.editalBlockFilter === "all" ? "active" : ""}" onclick="ui.setEditalBlock('all')">Todos</button>
        <button type="button" class="tab-btn ${this.editalBlockFilter === "juridico" ? "active" : ""}" onclick="ui.setEditalBlock('juridico')">Jurídico (50q)</button>
        <button type="button" class="tab-btn ${this.editalBlockFilter === "basicas" ? "active" : ""}" onclick="ui.setEditalBlock('basicas')">Básicas (30q)</button>
        <button type="button" class="tab-btn ${this.editalBlockFilter === "especificas" ? "active" : ""}" onclick="ui.setEditalBlock('especificas')">Específicas (20q)</button>
        <button type="button" class="tab-btn ${this.editalBlockFilter === "base" ? "active" : ""}" onclick="ui.setEditalBlock('base')">Base (0–2)</button>
        <button type="button" class="tab-btn ${this.editalBlockFilter === "final" ? "active" : ""}" onclick="ui.setEditalBlock('final')">Redação & TAF</button>
      </div>

      <div>
        ${filteredMods
          .map(mod => {
            const p = this.prontas(mod);
            const ok = p.filter(a => this.feitas[a.id]).length;
            const pc = p.length ? Math.round((ok * 100) / p.length) : 0;
            const lessons = mod.aulas.filter(a => !query || a.titulo.toLowerCase().includes(query) || mod.titulo.toLowerCase().includes(query));

            return `<section class="edital-module-block">
              <div class="edital-mod-top">
                <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap">
                  <span class="module-index">MÓD. ${escapeHtml(mod.id)}</span>
                  <strong style="font-size:1rem">${escapeHtml(mod.titulo)}</strong>
                  <span class="module-weight-tag">${escapeHtml(mod.meta.weight)}</span>
                </div>
                <div style="font-family:var(--font-mono);font-size:0.74rem;font-variant-numeric:tabular-nums">
                  ${ok}/${p.length} (${pc}%)
                </div>
              </div>
              <div>
                ${lessons
                  .map(a => {
                    const isDone = !!this.feitas[a.id];
                    const rev = this.revisoes[a.id] || {};
                    const hasNota = this.hasNote(a.id);
                    return `<div class="edital-lesson-row">
                      <div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1">
                        <button type="button" class="lesson-status-dot" style="cursor:pointer;background:${isDone ? "var(--ok)" : "transparent"};border-color:${isDone ? "var(--ok)" : "var(--border)"};color:${isDone ? "#fff" : "transparent"}" onclick="ui.marcar('${escapeHtml(a.id)}')" aria-label="${isDone ? "Desmarcar aula" : "Marcar aula como concluída"}">✓</button>
                        <a href="#/aula/${escapeHtml(a.id)}" style="text-decoration:none;font-weight:${isDone ? "600" : "400"}"><span style="font-family:var(--font-mono);font-size:0.74rem;color:var(--text-muted);margin-right:6px">${escapeHtml(a.id)}</span>${escapeHtml(a.titulo)}</a>
                        ${hasNota ? '<span style="font-family:var(--font-mono);font-size:0.64rem;color:var(--text-muted)">[NOTA]</span>' : ""}
                      </div>
                      <div class="rev-chips-group" aria-label="Ciclos de revisão">
                        <button type="button" class="rev-chip-btn ${rev.r1 ? "done" : ""}" onclick="ui.completeRevisionCycle('${escapeHtml(a.id)}','r1')">R1·24H ${rev.r1 ? "✓" : ""}</button>
                        <button type="button" class="rev-chip-btn ${rev.r7 ? "done" : ""}" onclick="ui.completeRevisionCycle('${escapeHtml(a.id)}','r7')">R2·7D ${rev.r7 ? "✓" : ""}</button>
                        <button type="button" class="rev-chip-btn ${rev.r30 ? "done" : ""}" onclick="ui.completeRevisionCycle('${escapeHtml(a.id)}','r30')">R3·30D ${rev.r30 ? "✓" : ""}</button>
                      </div>
                    </div>`;
                  })
                  .join("")}
              </div>
            </section>`;
          })
          .join("")}
      </div>
    </div>`;

    const searchInput = document.getElementById("edital-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", e => {
        this.editalSearch = e.target.value;
        const pos = searchInput.selectionStart;
        this.renderEditalView();
        const nextInput = document.getElementById("edital-search-input");
        if (nextInput) {
          nextInput.focus();
          nextInput.setSelectionRange(pos, pos);
        }
      });
    }
  },

  setEditalBlock(block) {
    this.editalBlockFilter = block;
    this.renderEditalView();
  },

  renderRevisionsView() {
    document.title = "Fila de Retenção e Revisões Espaçadas · PCCE";
    const main = document.getElementById("main-content");
    if (!main) return;

    const { due, upcoming } = this.getSpacedRevisions();
    const favLessons = this.lista.filter(a => this.favoritos[a.id]);
    const missQuestions = Object.entries(this.questoes)
      .filter(([, status]) => status === "miss")
      .map(([key]) => {
        const [lessonId, qNum] = key.split("#");
        const aula = this.lista.find(a => a.id === lessonId);
        return aula ? { aula, qNum } : null;
      })
      .filter(Boolean);

    main.innerHTML = `<div class="page-container">
      <div class="section-bar" style="margin-top:0">
        <div>
          <span class="section-kicker">REPETIÇÃO ESPAÇADA · CURVA DE RETENÇÃO</span>
          <h1 class="section-title">Agenda de Revisões (24h · 7d · 30d) e Caderno de Erros</h1>
        </div>
        <a href="#/edital" class="btn sm">Abrir matriz do edital →</a>
      </div>

      <div class="modules-swiss-grid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr));margin-bottom:24px">
        <section class="module-cell" style="justify-content:flex-start">
          <div class="module-cell-top">
            <span class="module-index">01 / PENDENTES HOJE</span>
            <span class="module-weight-tag">${due.length} ITENS</span>
          </div>
          <div class="rev-list-mini">
            ${
              due.length
                ? due
                    .map(
                      item => `<div class="rev-item-mini">
                        <div class="rev-item-info">
                          <a href="#/aula/${escapeHtml(item.aula.id)}" class="rev-item-title">${escapeHtml(item.aula.id)} · ${escapeHtml(item.aula.titulo)}</a>
                          <div class="rev-item-sub">
                            <span class="rev-cycle-tag">CICLO ${escapeHtml(item.cycleLabel)}</span>
                            <span>VENCIMENTO: ${formatBrDate(item.targetDate)}</span>
                          </div>
                        </div>
                        <button type="button" class="btn sm primary" onclick="ui.completeRevisionCycle('${escapeHtml(item.aula.id)}','${escapeHtml(item.cycleKey)}')">Concluir</button>
                      </div>`
                    )
                    .join("")
                : `<p style="font-size:0.84rem;color:var(--text-muted);margin:0">Nenhuma revisão pendente para hoje.</p>`
            }
          </div>
        </section>

        <section class="module-cell" style="justify-content:flex-start">
          <div class="module-cell-top">
            <span class="module-index">02 / PRÓXIMOS AGENDAMENTOS</span>
            <span class="module-weight-tag">${upcoming.length} ITENS</span>
          </div>
          <div class="rev-list-mini">
            ${
              upcoming.length
                ? upcoming
                    .slice(0, 8)
                    .map(
                      item => `<div class="rev-item-mini">
                        <div class="rev-item-info">
                          <a href="#/aula/${escapeHtml(item.aula.id)}" class="rev-item-title">${escapeHtml(item.aula.id)} · ${escapeHtml(item.aula.titulo)}</a>
                          <div class="rev-item-sub">
                            <span class="rev-cycle-tag">CICLO ${escapeHtml(item.cycleLabel)}</span>
                            <span>DATA: ${formatBrDate(item.targetDate)}</span>
                          </div>
                        </div>
                        <button type="button" class="btn sm" onclick="ui.completeRevisionCycle('${escapeHtml(item.aula.id)}','${escapeHtml(item.cycleKey)}')">Antecipar</button>
                      </div>`
                    )
                    .join("")
                : `<p style="font-size:0.84rem;color:var(--text-muted);margin:0">Ao concluir aulas, os ciclos de 24h, 7d e 30d são programados automaticamente.</p>`
            }
          </div>
        </section>
      </div>

      <div class="modules-swiss-grid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr))">
        <section class="module-cell" style="justify-content:flex-start">
          <div class="module-cell-top">
            <span class="module-index">03 / CADERNO DE ERROS (QUESTÕES)</span>
            <span class="module-weight-tag">${missQuestions.length} QUESTÕES</span>
          </div>
          <div class="rev-list-mini">
            ${
              missQuestions.length
                ? missQuestions
                    .map(
                      item => `<div class="rev-item-mini">
                        <div class="rev-item-info">
                          <a href="#/aula/${escapeHtml(item.aula.id)}" class="rev-item-title">Questão ${String(item.qNum).padStart(2, "0")} · ${escapeHtml(item.aula.titulo)}</a>
                          <div class="rev-item-sub"><span>MÓD. ${escapeHtml(item.aula.modulo.id)} · ${escapeHtml(item.aula.modulo.titulo)}</span></div>
                        </div>
                        <a href="#/aula/${escapeHtml(item.aula.id)}" class="btn sm">Refazer →</a>
                      </div>`
                    )
                    .join("")
                : `<p style="font-size:0.84rem;color:var(--text-muted);margin:0">Questões marcadas como "Revisar depois" durante as aulas são listadas aqui.</p>`
            }
          </div>
        </section>

        <section class="module-cell" style="justify-content:flex-start">
          <div class="module-cell-top">
            <span class="module-index">04 / AULAS MARCADAS (★)</span>
            <span class="module-weight-tag">${favLessons.length} AULAS</span>
          </div>
          <div class="rev-list-mini">
            ${
              favLessons.length
                ? favLessons
                    .map(
                      a => `<div class="rev-item-mini">
                        <div class="rev-item-info">
                          <a href="#/aula/${escapeHtml(a.id)}" class="rev-item-title">${escapeHtml(a.id)} · ${escapeHtml(a.titulo)}</a>
                          <div class="rev-item-sub"><span>MÓD. ${escapeHtml(a.modulo.id)} · ${escapeHtml(a.modulo.titulo)}</span></div>
                        </div>
                        <a href="#/aula/${escapeHtml(a.id)}" class="btn sm">Abrir →</a>
                      </div>`
                    )
                    .join("")
                : `<p style="font-size:0.84rem;color:var(--text-muted);margin:0">Use "☆ Marcar" no topo de uma aula para fixá-la neste quadro.</p>`
            }
          </div>
        </section>
      </div>
    </div>`;
  },

  renderNotebookHubView() {
    document.title = "Caderno de Anotações · Curso PCCE";
    const main = document.getElementById("main-content");
    if (!main) return;

    const allNotes = this.getAllNotesList();
    const query = this.cadernoSearch.toLowerCase();
    const filtered = allNotes.filter(
      item =>
        !query ||
        item.aula.titulo.toLowerCase().includes(query) ||
        item.aula.modulo.titulo.toLowerCase().includes(query) ||
        item.text.toLowerCase().includes(query)
    );

    main.innerHTML = `<div class="page-container">
      <div class="section-bar" style="margin-top:0">
        <div>
          <span class="section-kicker">REPOSITÓRIO PESSOAL</span>
          <h1 class="section-title">Caderno de Anotações (${allNotes.length})</h1>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <input type="search" id="caderno-search-input" class="sidebar-filter-input" style="width:240px;height:34px" placeholder="Pesquisar nas notas..." value="${escapeHtml(this.cadernoSearch)}" aria-label="Pesquisar nas notas">
          <button type="button" class="btn sm primary" onclick="ui.exportAllNotesMarkdown()">Exportar Caderno (.md)</button>
        </div>
      </div>

      ${
        filtered.length
          ? `<div style="display:grid;gap:16px">
              ${filtered
                .map(
                  item => `<article class="notepad-card" style="margin-top:0">
                    <div class="notepad-header">
                      <div>
                        <span class="section-kicker">MÓDULO ${escapeHtml(item.aula.modulo.id)} · ${escapeHtml(item.aula.modulo.titulo)}</span>
                        <h2 style="margin:2px 0 0;font-size:1.05rem"><a href="#/aula/${escapeHtml(item.aula.id)}" style="text-decoration:none">${escapeHtml(item.aula.id)} — ${escapeHtml(item.aula.titulo)}</a></h2>
                      </div>
                      <a href="#/aula/${escapeHtml(item.aula.id)}" class="btn sm">Abrir aula →</a>
                    </div>
                    <pre style="white-space:pre-wrap;margin:0;padding:14px;background:var(--bg-subtle);border:1px solid var(--border);font-family:var(--font-sans);font-size:0.9rem">${escapeHtml(item.text)}</pre>
                  </article>`
                )
                .join("")}
            </div>`
          : `<div class="lesson-article" style="text-align:center;padding:48px 20px">
              <h2 style="justify-content:center;border:0;margin-top:0">Nenhuma anotação registrada</h2>
              <p style="color:var(--text-muted)">As anotações escritas no final de cada aula são indexadas automaticamente aqui.</p>
            </div>`
      }
    </div>`;

    const input = document.getElementById("caderno-search-input");
    if (input) {
      input.addEventListener("input", e => {
        this.cadernoSearch = e.target.value;
        const pos = input.selectionStart;
        this.renderNotebookHubView();
        const next = document.getElementById("caderno-search-input");
        if (next) {
          next.focus();
          next.setSelectionRange(pos, pos);
        }
      });
    }
  },

  exportAllNotesMarkdown() {
    const notes = this.getAllNotesList();
    if (!notes.length) {
      this.toast("Sem anotações para exportar");
      return;
    }
    const lines = [
      `# Caderno de Estudos — Curso PCCE`,
      `Exportado em: ${formatBrDate(todayIso())}`,
      ""
    ];
    notes.forEach(item => {
      lines.push(`## [${item.aula.id}] ${item.aula.titulo} (${item.aula.modulo.titulo})`);
      lines.push(item.text);
      lines.push("\n---\n");
    });
    this.downloadTextFile(`caderno-pcce-${todayIso()}.md`, lines.join("\n"), "text/markdown;charset=utf-8");
    this.toast("Caderno exportado (.md)");
  },

  toggleFavorite(id) {
    if (this.favoritos[id]) {
      delete this.favoritos[id];
      this.toast("Marcação removida");
    } else {
      this.favoritos[id] = true;
      this.toast("Aula marcada ★");
    }
    store.set("pcce.favoritos", this.favoritos);
    const favBtn = document.getElementById("fav-btn");
    if (favBtn) {
      const isFav = !!this.favoritos[id];
      favBtn.classList.toggle("active", isFav);
      favBtn.setAttribute("aria-pressed", String(isFav));
      favBtn.innerHTML = `<span>${isFav ? "★ Marcada" : "☆ Marcar"}</span>`;
    }
    this.renderTree();
  },

  marcar(id) {
    if (this.feitas[id]) {
      delete this.feitas[id];
      this.toast("Aula reaberta como pendente");
    } else {
      this.feitas[id] = todayIso();
      this.recordStudyActivityToday();
      this.toast("Aula concluída · Revisões 24h/7d/30d agendadas");
    }
    store.set("pcce.feitas", this.feitas);

    const isDone = !!this.feitas[id];
    const doneBtn = document.getElementById("done-btn");
    if (doneBtn) {
      doneBtn.className = "btn " + (isDone ? "done" : "primary");
      doneBtn.textContent = isDone ? "✓ Aula concluída (desmarcar)" : "Marcar aula como concluída";
    }
    const topDoneBtn = document.getElementById("top-done-btn");
    if (topDoneBtn) {
      topDoneBtn.className = "btn sm " + (isDone ? "done" : "primary");
      topDoneBtn.textContent = isDone ? "✓ Concluída" : "Concluir aula";
    }

    this.renderTree();
    this.updateHeaderIndicators();
    if (location.hash === "#/edital") {
      this.renderEditalView();
    }
  },

  scrollActiveLessonIntoSidebarView() {
    const activeLink = document.querySelector("#tree .lesson-link.active");
    if (activeLink) {
      activeLink.scrollIntoView({ block: "nearest" });
    }
  },

  scrollToElement(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  },

  updateReadingProgress() {
    const bar = document.getElementById("reading-progress-bar");
    if (!bar) return;
    const docEl = document.documentElement;
    const scrollTop = docEl.scrollTop || document.body.scrollTop;
    const scrollHeight = docEl.scrollHeight - docEl.clientHeight;
    const pct = scrollHeight > 60 ? Math.min(100, Math.max(0, (scrollTop * 100) / scrollHeight)) : 0;
    bar.style.width = `${pct.toFixed(1)}%`;
  },

  formatSeconds(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  },

  setPomoMode(mode) {
    this.pausePomodoro();
    this.pomo.mode = mode;
    const mins = Number(mode) || 25;
    this.pomo.totalSeconds = mins * 60;
    this.pomo.secondsLeft = mins * 60;
    this.updateHeaderPomo();
    if (location.hash === "" || location.hash === "#/") {
      this.renderDashboardView();
    }
  },

  togglePomodoro() {
    if (this.pomo.running) {
      this.pausePomodoro();
    } else {
      this.startPomodoro();
    }
  },

  startPomodoro() {
    if (this.pomo.running) return;
    this.pomo.running = true;
    this.updateHeaderPomo();
    this.pomo.timerId = setInterval(() => {
      if (this.pomo.secondsLeft > 0) {
        this.pomo.secondsLeft--;
        this.updateHeaderPomo();
      } else {
        this.completePomodoroSession();
      }
    }, 1000);
  },

  pausePomodoro() {
    this.pomo.running = false;
    if (this.pomo.timerId) {
      clearInterval(this.pomo.timerId);
      this.pomo.timerId = null;
    }
    this.updateHeaderPomo();
  },

  resetPomodoro() {
    this.pausePomodoro();
    this.pomo.secondsLeft = this.pomo.totalSeconds;
    this.updateHeaderPomo();
  },

  completePomodoroSession() {
    this.pausePomodoro();
    if (this.pomo.mode !== "5") {
      this.pomo.stats.cycles++;
      this.pomo.stats.minutes += Number(this.pomo.mode) || 25;
      store.set("pcce.pomoStats", this.pomo.stats);
      this.recordStudyActivityToday();
      this.updateHeaderIndicators();
    }
    this.pomo.secondsLeft = this.pomo.totalSeconds;
    this.updateHeaderPomo();
    this.playSoftChime();
    this.toast(this.pomo.mode === "5" ? "Intervalo concluído" : "Sessão concluída");
  },

  playSoftChime() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.56);
    } catch {}
  },

  updateHeaderPomo() {
    const timeStr = this.formatSeconds(this.pomo.secondsLeft);
    const headerPill = document.getElementById("header-pomo-btn");
    const headerTime = document.getElementById("header-pomo-time");
    if (headerTime) headerTime.textContent = timeStr;
    if (headerPill) {
      headerPill.classList.toggle("running", this.pomo.running);
      headerPill.setAttribute("aria-label", `Cronômetro ${timeStr} (${this.pomo.running ? "ativo" : "pausado"})`);
    }

    const bentoTime = document.getElementById("bento-pomo-time");
    if (bentoTime) bentoTime.textContent = timeStr;
    const bentoToggle = document.getElementById("bento-pomo-toggle");
    if (bentoToggle) bentoToggle.textContent = this.pomo.running ? "Pausar" : "Iniciar";
    const bentoCycles = document.getElementById("bento-pomo-cycles");
    if (bentoCycles) bentoCycles.textContent = `${this.pomo.stats.cycles} ciclos hoje`;
  },

  toggleCommandPalette() {
    if (this.cmdOpen) this.closeCommandPalette();
    else this.openCommandPalette();
  },

  openCommandPalette() {
    const modal = document.getElementById("cmd-modal");
    const input = document.getElementById("cmd-input");
    if (!modal || !input) return;
    this.lastFocusBeforeModal = document.activeElement;
    this.cmdOpen = true;
    modal.classList.add("open");
    input.value = "";
    this.cmdSelectedIdx = 0;
    this.renderCommandResults("");
    setTimeout(() => input.focus(), 10);
  },

  closeCommandPalette() {
    const modal = document.getElementById("cmd-modal");
    if (!modal) return;
    this.cmdOpen = false;
    modal.classList.remove("open");
    if (this.lastFocusBeforeModal && typeof this.lastFocusBeforeModal.focus === "function") {
      this.lastFocusBeforeModal.focus();
    }
  },

  renderCommandResults(queryText) {
    const container = document.getElementById("cmd-results");
    if (!container) return;
    const q = queryText.trim().toLowerCase();

    const quickActions = [
      { type: "action", title: "Painel Geral", sub: "Cobertura do edital, constância e sessão", hash: "#/" },
      { type: "action", title: "Edital Verticalizado", sub: "Matriz de disciplinas e revisões R1/R2/R3", hash: "#/edital" },
      { type: "action", title: "Agenda de Revisões", sub: "Ciclos de 24h, 7d, 30d e caderno de erros", hash: "#/revisoes" },
      { type: "action", title: "Caderno de Anotações", sub: "Índice unificado de resumos", hash: "#/caderno" },
      { type: "action", title: "Guia Diretor PCCE", sub: "Estratégia, ciclos, edital e TAF", hash: "#/guia" },
      { type: "cmd", title: "Alternar Tema (Editorial Paper / Carbon)", sub: "Mudar aparência da interface", run: () => this.toggleTheme() },
      { type: "cmd", title: "Backup e Exportação de Dados", sub: "Salvar ou restaurar arquivo JSON", run: () => this.openBackupModal() }
    ];

    const matchedActions = quickActions.filter(a => !q || a.title.toLowerCase().includes(q) || a.sub.toLowerCase().includes(q));

    const matchedLessons = this.lista
      .filter(a => {
        if (!q) return false;
        const noteText = store.get("pcce.nota." + a.id, "");
        return (
          a.titulo.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q) ||
          a.modulo.titulo.toLowerCase().includes(q) ||
          noteText.toLowerCase().includes(q)
        );
      })
      .slice(0, 18)
      .map(a => ({
        type: "lesson",
        title: `${a.id} — ${a.titulo}`,
        sub: `MÓD. ${a.modulo.id} · ${a.modulo.titulo}${this.feitas[a.id] ? " · CONCLUÍDA" : ""}`,
        hash: `#/aula/${a.id}`
      }));

    const defaultLessons = !q
      ? this.lista.slice(0, 8).map(a => ({
          type: "lesson",
          title: `${a.id} — ${a.titulo}`,
          sub: `MÓD. ${a.modulo.id} · ${a.modulo.titulo}`,
          hash: `#/aula/${a.id}`
        }))
      : [];

    this.cmdFiltered = [...matchedLessons, ...matchedActions, ...defaultLessons].slice(0, 20);

    if (this.cmdFiltered.length === 0) {
      container.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:0.82rem">Sem resultados para "${escapeHtml(queryText)}".</div>`;
      return;
    }

    container.innerHTML = this.cmdFiltered
      .map(
        (item, i) => `<a href="${escapeHtml(item.hash || "#")}" class="cmd-item ${i === this.cmdSelectedIdx ? "selected" : ""}" data-cmd-idx="${i}">
          <div>
            <strong>${escapeHtml(item.title)}</strong>
            <span class="cmd-item-sub">${escapeHtml(item.sub)}</span>
          </div>
          <span class="search-kbd">↵</span>
        </a>`
      )
      .join("");

    container.querySelectorAll("[data-cmd-idx]").forEach(el => {
      el.addEventListener("click", e => {
        e.preventDefault();
        const idx = Number(el.getAttribute("data-cmd-idx"));
        const item = this.cmdFiltered[idx];
        if (item) this.executeCommandItem(item);
      });
    });
  },

  highlightCommandSelection() {
    const items = document.querySelectorAll("#cmd-results [data-cmd-idx]");
    items.forEach((el, i) => {
      const selected = i === this.cmdSelectedIdx;
      el.classList.toggle("selected", selected);
      if (selected) el.scrollIntoView({ block: "nearest" });
    });
  },

  executeCommandItem(item) {
    this.closeCommandPalette();
    if (item.run) {
      item.run();
    } else if (item.hash) {
      location.hash = item.hash;
    }
  },

  openBackupModal() {
    const modal = document.getElementById("backup-modal");
    if (!modal) return;
    this.lastFocusBeforeModal = document.activeElement;
    modal.classList.add("open");
  },

  closeBackupModal() {
    const modal = document.getElementById("backup-modal");
    if (!modal) return;
    modal.classList.remove("open");
    if (this.lastFocusBeforeModal && typeof this.lastFocusBeforeModal.focus === "function") {
      this.lastFocusBeforeModal.focus();
    }
  },

  exportFullBackupJson() {
    const notas = {};
    this.lista.forEach(a => {
      const n = store.get("pcce.nota." + a.id, "");
      if (n && n.trim()) notas[a.id] = n;
    });
    const payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      feitas: this.feitas,
      dias: this.dias,
      revisoes: this.revisoes,
      favoritos: this.favoritos,
      questoes: this.questoes,
      notas
    };
    this.downloadTextFile(`backup-pcce-${todayIso()}.json`, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
    this.toast("Arquivo de backup gerado (.json)");
  },

  importFullBackupJson(fileInput) {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!data || typeof data !== "object") throw new Error("Formato inválido");
        if (data.feitas && typeof data.feitas === "object") {
          this.feitas = data.feitas;
          store.set("pcce.feitas", this.feitas);
        }
        if (data.dias && typeof data.dias === "object") {
          this.dias = data.dias;
          store.set("pcce.dias", this.dias);
        }
        if (data.revisoes && typeof data.revisoes === "object") {
          this.revisoes = data.revisoes;
          store.set("pcce.revisoes", this.revisoes);
        }
        if (data.favoritos && typeof data.favoritos === "object") {
          this.favoritos = data.favoritos;
          store.set("pcce.favoritos", this.favoritos);
        }
        if (data.questoes && typeof data.questoes === "object") {
          this.questoes = data.questoes;
          store.set("pcce.questoes", this.questoes);
        }
        if (data.notas && typeof data.notas === "object") {
          Object.entries(data.notas).forEach(([lessonId, text]) => {
            if (typeof text === "string") {
              store.set("pcce.nota." + lessonId, text);
            }
          });
        }
        this.syncStudyDaysFromCompleted();
        this.closeBackupModal();
        this.route(false);
        this.toast("Backup restaurado");
      } catch {
        this.toast("Arquivo JSON inválido");
      }
      fileInput.value = "";
    };
    reader.readAsText(file);
  },

  downloadTextFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  },

  toast(message) {
    const region = document.getElementById("toast-region");
    if (!region) return;
    while (region.children.length >= 2) {
      region.firstElementChild.remove();
    }
    const item = document.createElement("div");
    item.className = "toast-msg";
    item.textContent = message;
    region.appendChild(item);
    setTimeout(() => {
      item.remove();
    }, 2600);
  }
};

ui.init();

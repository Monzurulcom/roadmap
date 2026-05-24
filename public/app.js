/* =============================================
   WebnWell Roadmap — Application Logic
   Auth-aware with sub-project navigation
   ============================================= */

(function () {
  'use strict';

  let DATA;
  let currentRoadmap = 'vibe-coding';
  let currentProject = 0; // index within projects array (for project-based roadmaps)
  let isLoggedIn = false;
  let authToken = localStorage.getItem('roadmap_token') || null;

  // --- Helpers ---
  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

  async function api(path, opts = {}) {
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    const res = await fetch(path, { ...opts, headers });
    return res.json();
  }

  function showToast(msg) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._timer); t._timer = setTimeout(() => t.classList.remove('show'), 2000);
  }

  // Get phases for current roadmap (handles both flat and project-based)
  function getCurrentPhases() {
    const d = DATA[currentRoadmap];
    if (d.projects) return d.projects[currentProject]?.phases || [];
    return d.phases || [];
  }

  function getStatsFromPhases(phases) {
    const all = phases.flatMap(p => p.milestones);
    const done = all.filter(m => m.status === 'done').length;
    const active = all.filter(m => m.status === 'active').length;
    const upcoming = all.filter(m => m.status === 'upcoming').length;
    const total = all.length;
    return { done, active, upcoming, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function getPhaseStats(phase) {
    const done = phase.milestones.filter(m => m.status === 'done').length;
    const total = phase.milestones.length;
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  // --- Auth ---
  async function checkAuth() {
    if (!authToken) { setAuthUI(false); return; }
    try { const r = await api('/api/auth'); setAuthUI(r.authenticated); } catch { setAuthUI(false); }
  }

  function setAuthUI(loggedIn) {
    isLoggedIn = loggedIn;
    document.getElementById('loginBtn').style.display = loggedIn ? 'none' : '';
    document.getElementById('logoutBtn').style.display = loggedIn ? 'flex' : 'none';
    document.getElementById('resetBtn').style.display = loggedIn ? '' : 'none';
  }

  function bindAuth() {
    document.getElementById('loginBtn').addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('loginOverlay').classList.add('open');
      document.getElementById('loginUser').focus();
    });
    document.getElementById('loginClose').addEventListener('click', () => {
      document.getElementById('loginOverlay').classList.remove('open');
    });
    document.getElementById('loginOverlay').addEventListener('click', e => {
      if (e.target === e.currentTarget) e.currentTarget.classList.remove('open');
    });
    document.getElementById('loginForm').addEventListener('submit', async e => {
      e.preventDefault();
      const errEl = document.getElementById('loginError');
      try {
        const r = await api('/api/login', {
          method: 'POST',
          body: JSON.stringify({ username: document.getElementById('loginUser').value, password: document.getElementById('loginPass').value }),
        });
        if (r.success) {
          authToken = r.token; localStorage.setItem('roadmap_token', authToken);
          document.getElementById('loginOverlay').classList.remove('open');
          setAuthUI(true); renderAll(); renderOverview(); showToast('Logged in — editing enabled');
        } else { errEl.textContent = r.error || 'Invalid credentials'; }
      } catch { errEl.textContent = 'Connection error'; }
    });
    document.getElementById('logoutBtn').addEventListener('click', async () => {
      await api('/api/logout', { method: 'POST' });
      authToken = null; localStorage.removeItem('roadmap_token');
      setAuthUI(false); renderAll(); renderOverview(); showToast('Logged out — read-only mode');
    });
  }

  // --- Data ---
  async function loadData() {
    try { const r = await api('/api/data'); if (r.data) { DATA = r.data; return; } } catch {}
    DATA = clone(window.ROADMAP_DATA);
  }

  async function saveData() {
    if (!isLoggedIn) return;
    try { await api('/api/data', { method: 'PUT', body: JSON.stringify(DATA) }); showToast('Changes saved'); }
    catch { showToast('Save failed'); }
  }

  // --- Init ---
  async function init() {
    await loadData();
    setHeaderDate();
    bindSwitcher();
    bindReset();
    bindAuth();
    await checkAuth();
    renderAll();
    renderOverview();
  }

  function setHeaderDate() {
    document.getElementById('headerDate').textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  }

  function bindReset() {
    document.getElementById('resetBtn').addEventListener('click', async () => {
      if (!isLoggedIn) return;
      if (confirm('Reset all roadmaps to original data?')) {
        DATA = clone(window.ROADMAP_DATA);
        await saveData(); renderAll(); renderOverview(); showToast('Reset to original data');
      }
    });
  }

  // --- Switcher ---
  function bindSwitcher() {
    const sw = document.getElementById('switcher');
    const btns = sw.querySelectorAll('.switcher__btn');
    const ind = document.getElementById('switcherIndicator');

    function updateInd(btn) {
      const r = btn.getBoundingClientRect(), p = sw.getBoundingClientRect();
      ind.style.width = r.width + 'px'; ind.style.left = (r.left - p.left) + 'px';
    }

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.roadmap; if (id === currentRoadmap) return;
        btns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
        updateInd(btn); switchRoadmap(id);
      });
    });

    const active = sw.querySelector('.switcher__btn.active');
    if (active) requestAnimationFrame(() => updateInd(active));
    window.addEventListener('resize', () => { const a = sw.querySelector('.switcher__btn.active'); if (a) updateInd(a); });
  }

  function switchRoadmap(id) {
    const c = document.getElementById('roadmapContainer');
    c.classList.remove('roadmap--visible'); c.classList.add('roadmap--transitioning');
    setTimeout(() => {
      currentRoadmap = id; currentProject = 0;
      renderAll();
      requestAnimationFrame(() => { c.classList.remove('roadmap--transitioning'); c.classList.add('roadmap--visible'); });
    }, 250);
    document.getElementById('app').dataset.theme = id;
    updateOrbs(id);
  }

  function updateOrbs(id) {
    const d = DATA[id]; if (!d) return;
    const orbs = document.querySelectorAll('.ambient-orb');
    if (orbs[0]) orbs[0].style.background = d.colors[0];
    if (orbs[1]) orbs[1].style.background = d.colors[1];
  }

  // --- Progress Ring ---
  function renderProgressHero() {
    const el = document.getElementById('progressHero');
    const d = DATA[currentRoadmap];
    const phases = getCurrentPhases();
    const s = getStatsFromPhases(phases);
    const r = 54, circ = 2 * Math.PI * r, off = circ - (s.pct / 100) * circ;

    el.innerHTML = `
      <div class="progress-ring-wrap">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <defs><linearGradient id="ringGrad" x1="0" y1="0" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            <stop stop-color="${d.colors[0]}"/><stop offset="1" stop-color="${d.colors[1]}"/>
          </linearGradient></defs>
          <circle class="progress-ring__bg" cx="70" cy="70" r="${r}"/>
          <circle class="progress-ring__fill" cx="70" cy="70" r="${r}" stroke-dasharray="${circ}" stroke-dashoffset="${off}"/>
        </svg>
        <div class="progress-ring__text">
          <span class="progress-ring__pct">${s.pct}%</span>
          <span class="progress-ring__label">Complete</span>
        </div>
      </div>
      <div class="progress-hero-stats">
        <div class="progress-hero-stat"><div class="progress-hero-stat__value">${s.total}</div><div class="progress-hero-stat__label">Total</div></div>
        <div class="progress-hero-stat"><div class="progress-hero-stat__value progress-hero-stat__value--done">${s.done}</div><div class="progress-hero-stat__label">Completed</div></div>
        <div class="progress-hero-stat"><div class="progress-hero-stat__value progress-hero-stat__value--active">${s.active}</div><div class="progress-hero-stat__label">In Progress</div></div>
        <div class="progress-hero-stat"><div class="progress-hero-stat__value progress-hero-stat__value--upcoming">${s.upcoming}</div><div class="progress-hero-stat__label">Upcoming</div></div>
      </div>`;
  }

  // --- Project Picker ---
  function renderProjectPicker() {
    const d = DATA[currentRoadmap];
    const container = document.getElementById('roadmapContainer');
    if (!d.projects) return ''; // no sub-projects

    let html = '<div class="project-picker">';
    d.projects.forEach((proj, i) => {
      html += `<button class="project-pill ${i === currentProject ? 'active' : ''}" data-proj="${i}">
        <span class="project-pill__icon">${proj.icon}</span>
        <span class="project-pill__info">
          <span class="project-pill__name">${proj.name}</span>
          <span class="project-pill__url">${proj.url}</span>
        </span>
      </button>`;
    });
    html += '</div>';
    return html;
  }

  // --- Render Roadmap ---
  function renderRoadmap() {
    const container = document.getElementById('roadmapContainer');
    const d = DATA[currentRoadmap]; if (!d) return;
    document.getElementById('app').dataset.theme = currentRoadmap;
    updateOrbs(currentRoadmap);

    const phases = getCurrentPhases();
    const editable = isLoggedIn;
    let html = '';

    // Hero
    const heroTitle = d.projects ? d.projects[currentProject]?.name || d.heroTitle : d.heroTitle;
    const heroDesc = d.projects ? `${d.description}` : d.description;
    html += `<div class="roadmap__hero" style="animation:none;opacity:1;transform:none;">
      <div class="roadmap__hero-label"><span>${d.icon}</span><span>${d.title}</span></div>
      <h1 class="roadmap__hero-title">${heroTitle}</h1>
      <p class="roadmap__hero-desc">${heroDesc}</p>
    </div>`;

    // Project picker (if applicable)
    html += renderProjectPicker();

    // Phases
    phases.forEach((phase, pi) => {
      const ps = getPhaseStats(phase);
      html += `<div class="phase" style="animation:none;opacity:1;transform:none;">
        <div class="phase__header">
          <div class="phase__number">${pi + 1}</div>
          <h2 class="phase__title" ${editable ? `contenteditable="true" data-field="phase-title" data-pi="${pi}"` : ''}>${phase.title}</h2>
          <span class="phase__timeline" ${editable ? `contenteditable="true" data-field="phase-timeline" data-pi="${pi}"` : ''}>${phase.timeline}</span>
        </div>
        <div class="phase-progress">
          <div class="phase-progress__bar"><div class="phase-progress__fill" style="width:${ps.pct}%;"></div></div>
          <span class="phase-progress__text">${ps.done}/${ps.total}</span>
        </div>
        <div class="milestones">`;

      phase.milestones.forEach((m, mi) => {
        const dotCls = m.status === 'done' ? 'milestone__dot--done' : m.status === 'active' ? 'milestone__dot--active' : '';
        const badgeCls = m.status === 'done' ? 'milestone__badge--done' : m.status === 'active' ? 'milestone__badge--active' : 'milestone__badge--upcoming';
        const badgeTxt = m.status === 'done' ? 'Completed' : m.status === 'active' ? 'In Progress' : 'Upcoming';
        const tags = m.tags.map(t => `<span class="milestone__tag ${t === 'priority' ? 'milestone__tag--priority' : ''}">${t}</span>`).join('');

        html += `<div class="milestone ${editable ? 'milestone--editable' : ''}" data-pi="${pi}" data-mi="${mi}">`;
        if (editable) html += `<button class="milestone__delete" data-pi="${pi}" data-mi="${mi}" title="Delete">✕</button>`;
        html += `<div class="milestone__status">
            <div class="milestone__dot ${dotCls}"></div>
            ${mi < phase.milestones.length - 1 ? '<div class="milestone__line"></div>' : ''}
          </div>
          <div class="milestone__content">
            <div class="milestone__name" ${editable ? `contenteditable="true" data-field="name" data-pi="${pi}" data-mi="${mi}"` : ''}>${m.name}</div>
            <div class="milestone__desc" ${editable ? `contenteditable="true" data-field="desc" data-pi="${pi}" data-mi="${mi}"` : ''}>${m.desc}</div>
            <div class="milestone__tags">${tags}</div>
          </div>
          <div class="milestone__meta">`;

        if (editable) {
          html += `<div class="status-toggle" data-pi="${pi}" data-mi="${mi}">
              <span class="milestone__badge ${badgeCls}">${badgeTxt}</span>
              <div class="status-menu">
                <div class="status-menu__item" data-status="done"><span class="status-menu__dot status-menu__dot--done"></span> Completed</div>
                <div class="status-menu__item" data-status="active"><span class="status-menu__dot status-menu__dot--active"></span> In Progress</div>
                <div class="status-menu__item" data-status="upcoming"><span class="status-menu__dot status-menu__dot--upcoming"></span> Upcoming</div>
              </div></div>`;
        } else {
          html += `<span class="milestone__badge ${badgeCls}">${badgeTxt}</span>`;
        }
        html += `</div></div>`;
      });

      html += `</div>`;
      if (editable) html += `<button class="add-milestone-btn" data-pi="${pi}"><span style="font-size:1.1rem;font-weight:700;">+</span> Add Milestone</button>`;
      html += `</div>`;
    });

    container.innerHTML = html;
    bindProjectPicker();
    if (editable) bindEditEvents();
  }

  // --- Bind Project Picker ---
  function bindProjectPicker() {
    document.querySelectorAll('.project-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const idx = +pill.dataset.proj;
        if (idx === currentProject) return;
        currentProject = idx;
        renderAll();
      });
    });
  }

  // --- Edit Events ---
  function bindEditEvents() {
    const phases = getCurrentPhases();

    document.querySelectorAll('[contenteditable="true"]').forEach(el => {
      el.addEventListener('blur', () => {
        const pi = +el.dataset.pi, mi = +el.dataset.mi, f = el.dataset.field;
        const v = el.textContent.trim();
        if (f === 'phase-title') {
          if (v && phases[pi]) { phases[pi].title = v; saveData(); }
        } else if (f === 'phase-timeline') {
          if (v && phases[pi]) { phases[pi].timeline = v; saveData(); }
        } else {
          if (v && phases[pi]?.milestones[mi]) { phases[pi].milestones[mi][f] = v; saveData(); }
        }
      });
      el.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); el.blur(); } });
    });

    document.querySelectorAll('.status-toggle').forEach(t => {
      t.querySelector('.milestone__badge').addEventListener('click', e => {
        e.stopPropagation();
        document.querySelectorAll('.status-menu.open').forEach(m => m.classList.remove('open'));
        t.querySelector('.status-menu').classList.toggle('open');
      });
      t.querySelectorAll('.status-menu__item').forEach(item => {
        item.addEventListener('click', e => {
          e.stopPropagation();
          phases[+t.dataset.pi].milestones[+t.dataset.mi].status = item.dataset.status;
          saveData(); renderAll(); renderOverview();
        });
      });
    });

    document.addEventListener('click', () => document.querySelectorAll('.status-menu.open').forEach(m => m.classList.remove('open')));

    document.querySelectorAll('.milestone__delete').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const pi = +btn.dataset.pi, mi = +btn.dataset.mi;
        if (phases[pi].milestones.length <= 1) { showToast('Cannot delete last milestone'); return; }
        phases[pi].milestones.splice(mi, 1);
        saveData(); renderAll(); renderOverview();
      });
    });

    document.querySelectorAll('.add-milestone-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pi = +btn.dataset.pi;
        phases[pi].milestones.push({ name: 'New milestone', desc: 'Click to edit...', status: 'upcoming', tags: ['new'] });
        saveData(); renderAll(); renderOverview();
        setTimeout(() => {
          const el = document.querySelector(`[data-pi="${pi}"][data-mi="${phases[pi].milestones.length - 1}"] .milestone__name`);
          if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
        }, 100);
      });
    });
  }

  // --- Overview ---
  function renderOverview() {
    const container = document.getElementById('overview');
    const cm = { 'vibe-coding': ['#6366f1','#a78bfa'], production: ['#f97316','#fbbf24'], sales: ['#10b981','#22d3ee'], productivity: ['#ec4899','#f472b6'] };
    let html = `<h2 class="overview__title">All Roadmaps Overview</h2><div class="overview__grid">`;

    Object.values(DATA).forEach(rd => {
      // For project-based roadmaps, aggregate across all projects
      const allPhases = rd.projects
        ? rd.projects.flatMap(p => p.phases)
        : rd.phases;
      const all = allPhases.flatMap(p => p.milestones);
      const done = all.filter(m => m.status === 'done').length;
      const total = all.length, pct = total ? Math.round((done / total) * 100) : 0;
      const c = cm[rd.id] || ['#6366f1','#a78bfa'];
      html += `<div class="overview__card" data-roadmap="${rd.id}" style="--card-color-1:${c[0]};--card-color-2:${c[1]};">
        <div class="overview__card-icon">${rd.icon}</div>
        <div class="overview__card-name">${rd.title}</div>
        <div class="overview__card-progress"><div class="progress-bar"><div class="progress-bar__fill" style="width:${pct}%;"></div></div></div>
        <div class="overview__card-meta"><span class="overview__card-pct">${pct}%</span><span class="overview__card-count">${done}/${total}</span></div>
      </div>`;
    });
    html += `</div>`;
    container.innerHTML = html;

    container.querySelectorAll('.overview__card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.roadmap; if (id === currentRoadmap) return;
        const sw = document.getElementById('switcher');
        sw.querySelectorAll('.switcher__btn').forEach(b => b.classList.remove('active'));
        const t = sw.querySelector(`[data-roadmap="${id}"]`);
        if (t) { t.classList.add('active'); const ind = document.getElementById('switcherIndicator'); const r = t.getBoundingClientRect(), p = sw.getBoundingClientRect(); ind.style.width = r.width + 'px'; ind.style.left = (r.left - p.left) + 'px'; }
        switchRoadmap(id); window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  function renderAll() { renderProgressHero(); renderRoadmap(); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

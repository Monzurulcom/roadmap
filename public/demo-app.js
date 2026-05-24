/* =============================================
   Demo Page — Enhanced App with Inline Editing
   ============================================= */

(function () {
  'use strict';

  const STORAGE_KEY = 'roadmap_demo_data';
  const ROADMAP_ID = 'vibe-coding';
  let data;

  // --- Deep clone helper ---
  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

  // --- Load / Save ---
  function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { data = JSON.parse(saved); return; } catch (e) { /* fall through */ }
    }
    data = clone(window.ROADMAP_DATA[ROADMAP_ID]);
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    showToast('Changes saved');
  }

  // --- Toast ---
  function showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2000);
  }

  // --- Stats ---
  function getStats() {
    const all = data.phases.flatMap(p => p.milestones);
    const done = all.filter(m => m.status === 'done').length;
    const active = all.filter(m => m.status === 'active').length;
    const upcoming = all.filter(m => m.status === 'upcoming').length;
    const total = all.length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { done, active, upcoming, total, pct };
  }

  function getPhaseStats(phase) {
    const done = phase.milestones.filter(m => m.status === 'done').length;
    const total = phase.milestones.length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { done, total, pct };
  }

  // --- Render Progress Hero ---
  function renderProgressHero() {
    const el = document.getElementById('progressHero');
    const s = getStats();
    const radius = 54;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (s.pct / 100) * circ;

    el.innerHTML = `
      <div class="progress-ring-wrap">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="140" y2="140" gradientUnits="userSpaceOnUse">
              <stop stop-color="${data.colors[0]}"/>
              <stop offset="1" stop-color="${data.colors[1]}"/>
            </linearGradient>
          </defs>
          <circle class="progress-ring__bg" cx="70" cy="70" r="${radius}"/>
          <circle class="progress-ring__fill" cx="70" cy="70" r="${radius}"
            stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/>
        </svg>
        <div class="progress-ring__text">
          <span class="progress-ring__pct">${s.pct}%</span>
          <span class="progress-ring__label">Complete</span>
        </div>
      </div>
      <div class="progress-hero-stats">
        <div class="progress-hero-stat">
          <div class="progress-hero-stat__value">${s.total}</div>
          <div class="progress-hero-stat__label">Total Milestones</div>
        </div>
        <div class="progress-hero-stat">
          <div class="progress-hero-stat__value progress-hero-stat__value--done">${s.done}</div>
          <div class="progress-hero-stat__label">Completed</div>
        </div>
        <div class="progress-hero-stat">
          <div class="progress-hero-stat__value progress-hero-stat__value--active">${s.active}</div>
          <div class="progress-hero-stat__label">In Progress</div>
        </div>
        <div class="progress-hero-stat">
          <div class="progress-hero-stat__value progress-hero-stat__value--upcoming">${s.upcoming}</div>
          <div class="progress-hero-stat__label">Upcoming</div>
        </div>
      </div>
    `;
  }

  // --- Render Roadmap ---
  function renderRoadmap() {
    const container = document.getElementById('roadmapContainer');
    let html = '';

    // Hero
    html += `
      <div class="roadmap__hero" style="animation:none;opacity:1;transform:none;">
        <div class="roadmap__hero-label">
          <span>${data.icon}</span>
          <span>${data.title}</span>
        </div>
        <h1 class="roadmap__hero-title">${data.heroTitle}</h1>
        <p class="roadmap__hero-desc">${data.description}</p>
      </div>
    `;

    // Phases
    data.phases.forEach((phase, pi) => {
      const ps = getPhaseStats(phase);

      html += `
        <div class="phase" style="animation:none;opacity:1;transform:none;">
          <div class="phase__header">
            <div class="phase__number">${pi + 1}</div>
            <h2 class="phase__title">${phase.title}</h2>
            <span class="phase__timeline">${phase.timeline}</span>
          </div>
          <div class="phase-progress">
            <div class="phase-progress__bar">
              <div class="phase-progress__fill" style="width: ${ps.pct}%;"></div>
            </div>
            <span class="phase-progress__text">${ps.done}/${ps.total}</span>
          </div>
          <div class="milestones">
      `;

      phase.milestones.forEach((m, mi) => {
        const dotCls = m.status === 'done' ? 'milestone__dot--done'
                     : m.status === 'active' ? 'milestone__dot--active' : '';
        const badgeCls = m.status === 'done' ? 'milestone__badge--done'
                       : m.status === 'active' ? 'milestone__badge--active'
                       : 'milestone__badge--upcoming';
        const badgeTxt = m.status === 'done' ? 'Completed'
                       : m.status === 'active' ? 'In Progress' : 'Upcoming';
        const tagsHtml = m.tags.map(t =>
          `<span class="milestone__tag ${t === 'priority' ? 'milestone__tag--priority' : ''}">${t}</span>`
        ).join('');

        html += `
          <div class="milestone milestone--editable" data-phase="${pi}" data-milestone="${mi}">
            <button class="milestone__delete" data-phase="${pi}" data-milestone="${mi}" title="Delete">✕</button>
            <div class="milestone__status">
              <div class="milestone__dot ${dotCls}"></div>
              ${mi < phase.milestones.length - 1 ? '<div class="milestone__line"></div>' : ''}
            </div>
            <div class="milestone__content">
              <div class="milestone__name" contenteditable="true" data-field="name" data-phase="${pi}" data-milestone="${mi}">${m.name}</div>
              <div class="milestone__desc" contenteditable="true" data-field="desc" data-phase="${pi}" data-milestone="${mi}">${m.desc}</div>
              <div class="milestone__tags">${tagsHtml}</div>
            </div>
            <div class="milestone__meta">
              <div class="status-toggle" data-phase="${pi}" data-milestone="${mi}">
                <span class="milestone__badge ${badgeCls}">${badgeTxt}</span>
                <div class="status-menu" id="status-menu-${pi}-${mi}">
                  <div class="status-menu__item" data-status="done">
                    <span class="status-menu__dot status-menu__dot--done"></span> Completed
                  </div>
                  <div class="status-menu__item" data-status="active">
                    <span class="status-menu__dot status-menu__dot--active"></span> In Progress
                  </div>
                  <div class="status-menu__item" data-status="upcoming">
                    <span class="status-menu__dot status-menu__dot--upcoming"></span> Upcoming
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      });

      html += `
          </div>
          <button class="add-milestone-btn" data-phase="${pi}">
            <span class="add-milestone-btn__icon">+</span>
            Add Milestone
          </button>
        </div>
      `;
    });

    container.innerHTML = html;
    bindEvents();
  }

  // --- Bind Events ---
  function bindEvents() {
    // Inline editing (blur = save)
    document.querySelectorAll('[contenteditable="true"]').forEach(el => {
      el.addEventListener('blur', () => {
        const pi = +el.dataset.phase;
        const mi = +el.dataset.milestone;
        const field = el.dataset.field;
        const val = el.textContent.trim();
        if (val && data.phases[pi]?.milestones[mi]) {
          data.phases[pi].milestones[mi][field] = val;
          saveData();
        }
      });
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); el.blur(); }
      });
    });

    // Status toggle
    document.querySelectorAll('.status-toggle').forEach(toggle => {
      const badge = toggle.querySelector('.milestone__badge');
      const menu = toggle.querySelector('.status-menu');

      badge.addEventListener('click', e => {
        e.stopPropagation();
        // Close all other menus
        document.querySelectorAll('.status-menu.open').forEach(m => {
          if (m !== menu) m.classList.remove('open');
        });
        menu.classList.toggle('open');
      });

      menu.querySelectorAll('.status-menu__item').forEach(item => {
        item.addEventListener('click', e => {
          e.stopPropagation();
          const pi = +toggle.dataset.phase;
          const mi = +toggle.dataset.milestone;
          const newStatus = item.dataset.status;
          data.phases[pi].milestones[mi].status = newStatus;
          saveData();
          renderAll();
        });
      });
    });

    // Close menus on outside click
    document.addEventListener('click', () => {
      document.querySelectorAll('.status-menu.open').forEach(m => m.classList.remove('open'));
    });

    // Delete milestone
    document.querySelectorAll('.milestone__delete').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const pi = +btn.dataset.phase;
        const mi = +btn.dataset.milestone;
        if (data.phases[pi].milestones.length <= 1) {
          showToast('Cannot delete the last milestone in a phase');
          return;
        }
        data.phases[pi].milestones.splice(mi, 1);
        saveData();
        renderAll();
      });
    });

    // Add milestone
    document.querySelectorAll('.add-milestone-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pi = +btn.dataset.phase;
        data.phases[pi].milestones.push({
          name: 'New milestone',
          desc: 'Click to edit description...',
          status: 'upcoming',
          tags: ['new'],
        });
        saveData();
        renderAll();
        // Scroll to & focus the new milestone
        setTimeout(() => {
          const newEl = document.querySelector(`[data-phase="${pi}"][data-milestone="${data.phases[pi].milestones.length - 1}"] .milestone__name`);
          if (newEl) {
            newEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            newEl.focus();
            // Select all text
            const range = document.createRange();
            range.selectNodeContents(newEl);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }, 100);
      });
    });
  }

  // --- Render All ---
  function renderAll() {
    renderProgressHero();
    renderRoadmap();
  }

  // --- Init ---
  function init() {
    loadData();

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
      if (confirm('Reset all changes? This will restore the original data.')) {
        localStorage.removeItem(STORAGE_KEY);
        loadData();
        renderAll();
        showToast('Reset to original data');
      }
    });

    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* =============================================
   WebnWell Roadmap — Application Logic
   ============================================= */

(function () {
  'use strict';

  const DATA = window.ROADMAP_DATA;
  let currentRoadmap = 'vibe-coding';

  // --- Init ---
  function init() {
    setHeaderDate();
    bindSwitcher();
    renderRoadmap(currentRoadmap, false);
    renderOverview();
  }

  // --- Header Date ---
  function setHeaderDate() {
    const el = document.getElementById('headerDate');
    const now = new Date();
    el.textContent = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // --- Switcher ---
  function bindSwitcher() {
    const switcher = document.getElementById('switcher');
    const buttons = switcher.querySelectorAll('.switcher__btn');
    const indicator = document.getElementById('switcherIndicator');

    function updateIndicator(btn) {
      const rect = btn.getBoundingClientRect();
      const parentRect = switcher.getBoundingClientRect();
      const padding = parseFloat(getComputedStyle(switcher).paddingLeft);
      indicator.style.width = rect.width + 'px';
      indicator.style.left = (rect.left - parentRect.left) + 'px';
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const roadmapId = btn.dataset.roadmap;
        if (roadmapId === currentRoadmap) return;

        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        updateIndicator(btn);

        switchRoadmap(roadmapId);
      });
    });

    // Initialize indicator position
    const activeBtn = switcher.querySelector('.switcher__btn.active');
    if (activeBtn) {
      // Slight delay to ensure layout is computed
      requestAnimationFrame(() => updateIndicator(activeBtn));
    }

    // Recalculate on resize
    window.addEventListener('resize', () => {
      const active = switcher.querySelector('.switcher__btn.active');
      if (active) updateIndicator(active);
    });
  }

  // --- Switch Roadmap ---
  function switchRoadmap(id) {
    const container = document.getElementById('roadmapContainer');

    // Transition out
    container.classList.remove('roadmap--visible');
    container.classList.add('roadmap--transitioning');

    setTimeout(() => {
      currentRoadmap = id;
      renderRoadmap(id, true);

      // Transition in
      requestAnimationFrame(() => {
        container.classList.remove('roadmap--transitioning');
        container.classList.add('roadmap--visible');
      });
    }, 250);

    // Update theme
    document.getElementById('app').dataset.theme = id;

    // Update ambient orb colors
    updateAmbientOrbs(id);
  }

  // --- Update Ambient Orbs ---
  function updateAmbientOrbs(id) {
    const data = DATA[id];
    if (!data) return;
    const orbs = document.querySelectorAll('.ambient-orb');
    if (orbs[0]) orbs[0].style.background = data.colors[0];
    if (orbs[1]) orbs[1].style.background = data.colors[1];
  }

  // --- Render Roadmap ---
  function renderRoadmap(id, isSwitch) {
    const container = document.getElementById('roadmapContainer');
    const data = DATA[id];
    if (!data) return;

    // Set theme
    document.getElementById('app').dataset.theme = id;
    updateAmbientOrbs(id);

    // Calculate stats
    const allMilestones = data.phases.flatMap((p) => p.milestones);
    const done = allMilestones.filter((m) => m.status === 'done').length;
    const active = allMilestones.filter((m) => m.status === 'active').length;
    const total = allMilestones.length;
    const pct = Math.round((done / total) * 100);

    let html = '';

    // Hero
    html += `
      <div class="roadmap__hero" ${isSwitch ? 'style="animation: none; opacity: 1; transform: none;"' : ''}>
        <div class="roadmap__hero-label">
          <span>${data.icon}</span>
          <span>${data.title}</span>
        </div>
        <h1 class="roadmap__hero-title">${data.heroTitle}</h1>
        <p class="roadmap__hero-desc">${data.description}</p>
      </div>
    `;

    // Stats
    html += `
      <div class="roadmap__stats" ${isSwitch ? 'style="animation: none; opacity: 1; transform: none;"' : ''}>
        <div class="stat-card">
          <div class="stat-card__value">${total}</div>
          <div class="stat-card__label">Total Milestones</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value">${done}</div>
          <div class="stat-card__label">Completed</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value">${active}</div>
          <div class="stat-card__label">In Progress</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value">${pct}%</div>
          <div class="stat-card__label">Progress</div>
        </div>
      </div>
    `;

    // Phases
    data.phases.forEach((phase, pi) => {
      html += `
        <div class="phase" ${isSwitch ? 'style="animation: none; opacity: 1; transform: none;"' : ''}>
          <div class="phase__header">
            <div class="phase__number">${pi + 1}</div>
            <h2 class="phase__title">${phase.title}</h2>
            <span class="phase__timeline">${phase.timeline}</span>
          </div>
          <div class="milestones">
      `;

      phase.milestones.forEach((m, mi) => {
        const dotClass =
          m.status === 'done'
            ? 'milestone__dot--done'
            : m.status === 'active'
            ? 'milestone__dot--active'
            : '';

        const badgeClass =
          m.status === 'done'
            ? 'milestone__badge--done'
            : m.status === 'active'
            ? 'milestone__badge--active'
            : 'milestone__badge--upcoming';

        const badgeText =
          m.status === 'done'
            ? 'Completed'
            : m.status === 'active'
            ? 'In Progress'
            : 'Upcoming';

        const tagsHtml = m.tags
          .map(
            (t) =>
              `<span class="milestone__tag ${t === 'priority' ? 'milestone__tag--priority' : ''}">${t}</span>`
          )
          .join('');

        html += `
          <div class="milestone">
            <div class="milestone__status">
              <div class="milestone__dot ${dotClass}"></div>
              ${mi < phase.milestones.length - 1 ? '<div class="milestone__line"></div>' : ''}
            </div>
            <div class="milestone__content">
              <div class="milestone__name">${m.name}</div>
              <div class="milestone__desc">${m.desc}</div>
              <div class="milestone__tags">${tagsHtml}</div>
            </div>
            <div class="milestone__meta">
              <span class="milestone__badge ${badgeClass}">${badgeText}</span>
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // --- Render Overview ---
  function renderOverview() {
    const container = document.getElementById('overview');
    const colorMap = {
      'vibe-coding': ['#6366f1', '#a78bfa'],
      production: ['#f97316', '#fbbf24'],
      sales: ['#10b981', '#22d3ee'],
      productivity: ['#ec4899', '#f472b6'],
    };

    let html = `<h2 class="overview__title">All Roadmaps Overview</h2><div class="overview__grid">`;

    Object.values(DATA).forEach((roadmap) => {
      const all = roadmap.phases.flatMap((p) => p.milestones);
      const done = all.filter((m) => m.status === 'done').length;
      const total = all.length;
      const pct = Math.round((done / total) * 100);
      const colors = colorMap[roadmap.id] || ['#6366f1', '#a78bfa'];

      html += `
        <div class="overview__card" 
             data-roadmap="${roadmap.id}" 
             style="--card-color-1: ${colors[0]}; --card-color-2: ${colors[1]};"
             id="overview-${roadmap.id}">
          <div class="overview__card-icon">${roadmap.icon}</div>
          <div class="overview__card-name">${roadmap.title}</div>
          <div class="overview__card-progress">
            <div class="progress-bar">
              <div class="progress-bar__fill" style="width: ${pct}%;"></div>
            </div>
          </div>
          <div class="overview__card-meta">
            <span class="overview__card-pct">${pct}%</span>
            <span class="overview__card-count">${done}/${total} milestones</span>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    // Bind overview cards to switch roadmap
    container.querySelectorAll('.overview__card').forEach((card) => {
      card.addEventListener('click', () => {
        const id = card.dataset.roadmap;
        if (id === currentRoadmap) return;

        // Update switcher buttons
        const switcher = document.getElementById('switcher');
        const buttons = switcher.querySelectorAll('.switcher__btn');
        buttons.forEach((b) => b.classList.remove('active'));
        const targetBtn = switcher.querySelector(`[data-roadmap="${id}"]`);
        if (targetBtn) {
          targetBtn.classList.add('active');
          // Update indicator
          const indicator = document.getElementById('switcherIndicator');
          const rect = targetBtn.getBoundingClientRect();
          const parentRect = switcher.getBoundingClientRect();
          indicator.style.width = rect.width + 'px';
          indicator.style.left = (rect.left - parentRect.left) + 'px';
        }

        switchRoadmap(id);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  // --- Start ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

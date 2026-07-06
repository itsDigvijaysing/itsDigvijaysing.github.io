(function () {
  'use strict';

  const basePath = document.body.dataset.base || '';
  const projects = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];

  /* ── Mobile nav ── */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  /* ── Active nav link ── */
  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll('.nav-links a[data-nav]').forEach((a) => {
      if (a.dataset.nav === page) a.classList.add('active');
    });
  }

  /* ── Scroll fade-in ── */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  function observeFadeIns(root) {
    (root || document).querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
  }
  observeFadeIns(document);

  /* ── Helpers ── */
  function projectUrl(slug) {
    return `${basePath}projects/view.html?slug=${encodeURIComponent(slug)}`;
  }

  function renderProjectCard(p, i) {
    const tags = (p.tags || [])
      .slice(0, 3)
      .map((t) => `<span class="tag">${t}</span>`)
      .join('');
    return `
      <a class="project-card fade-in" style="--i:${i || 0}" href="${projectUrl(p.slug)}">
        <div class="project-card__tags">${tags}</div>
        <h3>${p.title}</h3>
        <div class="project-card__sub">${p.subtitle || ''}</div>
        <p>${p.desc || ''}</p>
        <div class="project-card__footer">
          <span>View project →</span>
          <span>${p.date || ''}</span>
        </div>
      </a>`;
  }

  /* ── Featured projects on homepage ── */
  const featuredGrid = document.getElementById('featured-projects');
  if (featuredGrid) {
    const featured = projects.filter((p) => p.featured).slice(0, 6);
    featuredGrid.innerHTML = featured.length
      ? featured.map(renderProjectCard).join('')
      : '<div class="empty-state">Projects unavailable.</div>';
    observeFadeIns(featuredGrid);
  }

  /* ── All projects page with filter ── */
  const allGrid = document.getElementById('all-projects');
  const filterBar = document.getElementById('filter-bar');
  if (allGrid) {
    const tags = [...new Set(projects.flatMap((p) => p.tags || []))].sort();
    if (filterBar) {
      filterBar.innerHTML =
        `<button class="filter-btn active" data-filter="all">All</button>` +
        tags.map((t) => `<button class="filter-btn" data-filter="${t}">${t}</button>`).join('');
    }

    function render(filter) {
      const list =
        filter === 'all' ? projects : projects.filter((p) => (p.tags || []).includes(filter));
      allGrid.innerHTML = list.length
        ? list.map(renderProjectCard).join('')
        : '<div class="empty-state">No projects match this filter.</div>';
      observeFadeIns(allGrid);
    }

    render('all');

    if (filterBar) {
      filterBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        filterBar.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        render(btn.dataset.filter);
      });
    }
  }

  /* ── Project detail page ── */
  const detailRoot = document.getElementById('project-detail');
  if (detailRoot) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    const p = slug ? projects.find((x) => x.slug === slug) : null;

    if (!slug) {
      detailRoot.innerHTML =
        '<div class="empty-state">No project specified. <a href="index.html">Browse projects</a></div>';
    } else if (!p) {
      detailRoot.innerHTML =
        '<div class="empty-state">Project not found. <a href="index.html">Browse projects</a></div>';
    } else {
      document.title = `${p.title} — Digvijaysing Rajput`;

      const tags = (p.tags || []).map((t) => `<span class="tag">${t}</span>`).join('');
      const tech = (p.techStack || []).map((t) => `<span class="skill-pill">${t}</span>`).join('');
      const highlights = (p.highlights || []).map((h) => `<li>${h}</li>`).join('');

      let actions = '';
      if (p.link) {
        actions += `<a class="btn btn--primary" href="${p.link}" target="_blank" rel="noopener">${p.linkLabel || 'Visit'} ↗</a>`;
      }
      if (p.github) {
        actions += `<a class="btn btn--ghost" href="${p.github}" target="_blank" rel="noopener">GitHub ↗</a>`;
      }
      if (p.private && !p.github) {
        actions += `<span class="btn btn--ghost" style="opacity:0.6;cursor:default;">Private repository</span>`;
      }

      detailRoot.innerHTML = `
        <a class="back-link" href="index.html">← All projects</a>
        <div class="project-hero fade-in">
          <div class="project-card__tags" style="margin-bottom:1rem;">${tags}</div>
          <h1>${p.title}</h1>
          <p class="project-hero__sub">${p.subtitle || ''}</p>
        </div>
        <div class="project-detail">
          <div class="project-detail__grid">
            <div>
              <h2>Overview</h2>
              <p>${p.overview || p.desc || ''}</p>
              ${highlights ? `<h2>Highlights</h2><ul>${highlights}</ul>` : ''}
            </div>
            <aside>
              <div class="sidebar-card fade-in">
                <h3>Links</h3>
                <div style="display:flex;flex-direction:column;gap:0.5rem;">${actions || '<p style="color:var(--text-muted);font-size:0.875rem;">No public links</p>'}</div>
                <h3 style="margin-top:1.5rem;">Date</h3>
                <p style="color:var(--text-muted);font-size:0.875rem;">${p.date || '—'}</p>
                <h3 style="margin-top:1.5rem;">Tech Stack</h3>
                <div class="skills-grid" style="margin-top:0.5rem;">${tech}</div>
              </div>
            </aside>
          </div>
        </div>`;

      observeFadeIns(detailRoot);
    }
  }

  /* ── Frosted nav after scroll ── */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Magnetic primary CTA (fine pointer + motion allowed) ── */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!reduceMotion && finePointer) {
    document.querySelectorAll('.hero__actions .btn--primary').forEach((btn) => {
      const strength = 0.25;
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * strength}px, ${(e.clientY - (r.top + r.height / 2)) * strength}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }
})();

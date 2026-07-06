import { Link, useParams } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { getProject } from '../data/projects.js';

export default function ProjectDetail() {
  const { slug } = useParams();
  const p = getProject(slug);

  usePageMeta({
    title: p ? `${p.title} — Digvijaysing Rajput` : 'Project not found — Digvijaysing Rajput',
    description: p ? p.overview || p.desc : 'The project you are looking for could not be found.',
    path: p ? `/projects/${p.slug}` : '/projects',
  });

  if (!p) {
    return (
      <section className="page-top">
        <div className="container">
          <div className="empty-state">
            Project not found. <Link to="/projects">Browse projects</Link>
          </div>
        </div>
      </section>
    );
  }

  const status = p.link ? 'Live' : p.private ? 'Research' : p.github ? 'Open Source' : 'Project';

  return (
    <section className="page-top">
      <div className="container">
        <Link className="back-link" to="/projects">
          ← All projects
        </Link>

        <Reveal>
          <div className="project-cover">
            <span className="project-cover__sigil" aria-hidden="true">
              {p.title.charAt(0)}
            </span>
            <div className="project-cover__body">
              <span className="project-cover__tags">{(p.tags || []).join(' · ')}</span>
              <h1 className="project-cover__title">{p.title}</h1>
            </div>
          </div>
        </Reveal>

        <Reveal className="project-hero">
          <p className="project-hero__sub">{p.subtitle}</p>
          <div className="project-facts">
            <div>
              <span className="project-facts__label">Focus</span>
              <span className="project-facts__val">{(p.tags || [])[0] || '—'}</span>
            </div>
            <div>
              <span className="project-facts__label">Stack</span>
              <span className="project-facts__val">{(p.techStack || []).length} technologies</span>
            </div>
            <div>
              <span className="project-facts__label">Status</span>
              <span className="project-facts__val project-facts__val--pill">{status}</span>
            </div>
          </div>
        </Reveal>

        <div className="project-detail">
          <div className="project-detail__grid">
            <div>
              <h2>Overview</h2>
              <p>{p.overview || p.desc}</p>
              {p.highlights?.length > 0 && (
                <>
                  <h2>Highlights</h2>
                  <ul>
                    {p.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <aside>
              <div className="sidebar-card">
                <h3>Links</h3>
                <div className="stack">
                  {p.link && (
                    <a className="btn btn--primary" href={p.link} target="_blank" rel="noopener noreferrer">
                      {p.linkLabel || 'Visit'} ↗
                    </a>
                  )}
                  {p.github && (
                    <a className="btn btn--ghost" href={p.github} target="_blank" rel="noopener noreferrer">
                      GitHub ↗
                    </a>
                  )}
                  {p.private && !p.github && (
                    <span className="btn btn--ghost" style={{ opacity: 0.6, cursor: 'default' }}>
                      Private repository
                    </span>
                  )}
                  {!p.link && !p.github && !p.private && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No public links</p>
                  )}
                </div>
                <h3 style={{ marginTop: '1.5rem' }}>Tech Stack</h3>
                <div className="skills-grid" style={{ marginTop: '0.5rem' }}>
                  {(p.techStack || []).map((t) => (
                    <span className="skill-pill" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import projects from '../data/projects.js';

// Curated top-level categories that classify the work (not every tag).
const FILTERS = ['AI', 'ML', 'Full Stack', 'Mobile', 'Desktop', 'Salesforce'];

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const [showMore, setShowMore] = useState(false);

  usePageMeta({
    title: 'Projects',
    description:
      'Projects by Digvijaysing Rajput - AI agents, conversational platforms, RAG systems, mobile and desktop apps, and research.',
    path: '/projects',
  });

  const filtered = filter === 'all' ? projects : projects.filter((p) => (p.tags || []).includes(filter));
  const list = filtered.filter((p) => !p.hidden);
  const extra = filtered.filter((p) => p.hidden);

  return (
    <section className="page-top">
      <div className="container">
        <Reveal className="section-header">
          <p className="section-label">Portfolio</p>
          <h1>
            All <span className="serif">Projects</span>
          </h1>
          <p>AI agents, conversational platforms, RAG systems, mobile apps, and research - filter by area.</p>
        </Reveal>

        <div className="filter-bar">
          <button
            className={`filter-btn${filter === 'all' ? ' active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {FILTERS.map((t) => (
            <button
              key={t}
              className={`filter-btn${filter === t ? ' active' : ''}`}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {list.length ? (
          <div className="project-grid">
            {list.map((p, i) => (
              <Reveal key={p.slug} index={i} style={{ display: 'flex' }}>
                <ProjectCard p={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="empty-state">No projects match this filter.</div>
        )}

        {extra.length > 0 && (
          <div className="project-more">
            <button
              type="button"
              className="show-more-btn"
              onClick={() => setShowMore((v) => !v)}
              aria-expanded={showMore}
            >
              {showMore ? 'Show less' : `Show ${extra.length} more project${extra.length > 1 ? 's' : ''}`}
            </button>
            {showMore && (
              <div className="project-grid">
                {extra.map((p, i) => (
                  <Reveal key={p.slug} index={i} style={{ display: 'flex' }}>
                    <ProjectCard p={p} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

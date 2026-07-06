import { useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import projects from '../data/projects.js';

// Curated top-level categories that classify the work (not every tag).
const FILTERS = ['AI', 'ML', 'Full Stack', 'Mobile', 'Desktop', 'Salesforce'];

export default function Projects() {
  const [filter, setFilter] = useState('all');

  usePageMeta({
    title: 'Projects — Digvijaysing Rajput',
    description:
      'Projects by Digvijaysing Rajput — AI agents, conversational platforms, RAG systems, mobile and desktop apps, and research.',
    path: '/projects',
  });

  const list = filter === 'all' ? projects : projects.filter((p) => (p.tags || []).includes(filter));

  return (
    <section className="page-top">
      <div className="container">
        <Reveal className="section-header">
          <p className="section-label">Portfolio</p>
          <h1>
            All <span className="serif">Projects</span>
          </h1>
          <p>AI agents, conversational platforms, RAG systems, mobile apps, and research — filter by area.</p>
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
      </div>
    </section>
  );
}

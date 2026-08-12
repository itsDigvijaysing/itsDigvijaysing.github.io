import { Link, useParams } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import Workflow from '../components/Workflow.jsx';
import ProjectVideo from '../components/ProjectVideo.jsx';
import { getProjectReview } from '../components/ProjectReviews/index.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { getProject } from '../data/projects.js';

export default function ProjectDetail() {
  const { slug } = useParams();
  const p = getProject(slug);

  usePageMeta({
    title: p ? `${p.title} - Digvijaysing Rajput` : 'Project not found - Digvijaysing Rajput',
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
  const Review = getProjectReview(slug);
  const year = p.date ? p.date.slice(0, 4) : null;

  const techStack = (p.techStack || []).length > 0 && (
    <div className="sidebar-card">
      <h3>Tech Stack</h3>
      <div className="skills-grid" style={{ marginTop: '0.5rem' }}>
        {p.techStack.map((t) => (
          <span className="skill-pill" key={t}>{t}</span>
        ))}
      </div>
    </div>
  );

  const workflow = p.workflow?.rows?.length > 0 && (
    <Reveal className="project-workflow">
      <h2>Workflow</h2>
      <p className="project-workflow__intro">How it works, straight from the code - click the diagram to open it full-screen and zoom.</p>
      <Workflow data={p.workflow} title={p.title} />
    </Reveal>
  );

  // On showcase pages the diagram becomes a fifth numbered section, so it reads
  // as part of the review rather than a footer bolted under it.
  const showcaseWorkflow = p.workflow?.rows?.length > 0 && (
    <section className="dt__section project-workflow project-workflow--showcase">
      <h2 className="dt__h2"><span className="dt__h2-num">05</span> Workflow</h2>
      <p className="dt__section-note">How it works, straight from the code - click the diagram to open it full-screen and zoom.</p>
      <Workflow data={p.workflow} title={p.title} />
    </section>
  );

  return (
    <section className="page-top">
      <div className="container">
        <Link className="back-link" to="/projects">
          ‹ All projects
        </Link>

        <Reveal>
          <div className="project-cover">
            <div className="project-cover__body">
              <span className="project-cover__tags">{(p.tags || []).join(' · ')}</span>
              <h1 className="project-cover__title">{p.title}</h1>
            </div>
            {(p.link || p.github || p.private) && (
              <div className="project-cover__actions">
                {p.link && (
                  <a className="btn btn--cover" href={p.link} target="_blank" rel="noopener noreferrer">
                    {p.linkLabel || 'Live'} ›
                  </a>
                )}
                {p.github && (
                  <a className="btn btn--cover" href={p.github} target="_blank" rel="noopener noreferrer">
                    GitHub ›
                  </a>
                )}
                {p.private && !p.github && !p.link && (
                  <span className="project-cover__badge">Private</span>
                )}
              </div>
            )}
          </div>
        </Reveal>

        <Reveal className="project-hero">
          {/* Showcase pages run the full description here instead of the short
              deck - one intro, not two competing ones. */}
          <p className={`project-hero__sub${Review ? ' project-hero__sub--lede' : ''}`}>{Review ? p.desc : p.subtitle}</p>
          <div className={`project-facts${Review ? ' project-facts--showcase' : ''}`}>
            <div>
              <span className="project-facts__label">Focus</span>
              <span className="project-facts__val">{(p.tags || [])[0] || '-'}</span>
            </div>
            <div>
              <span className="project-facts__label">Stack</span>
              {/* The showcase layout drops the tech-stack block, so name the
                  technologies here instead of counting them. */}
              <span className="project-facts__val">{Review ? (p.techStack || []).slice(0, 3).join(' · ') || '-' : `${(p.techStack || []).length} technologies`}</span>
            </div>
            {Review && year && (
              <div>
                <span className="project-facts__label">Year</span>
                <span className="project-facts__val">{year}</span>
              </div>
            )}
            <div>
              <span className="project-facts__label">Status</span>
              <span className="project-facts__val project-facts__val--pill">{status}</span>
            </div>
          </div>
        </Reveal>

        {Review ? (
          // Bespoke showcase: the review carries the substance, so Overview/Highlights
          // are dropped here. Tech stack and the workflow diagram still follow it.
          <div className={`dt project-showcase${p.videoId ? '' : ' project-showcase--novideo'}`}>
            {/* Without a demo video the banner is skipped entirely - no empty wrapper
                and no lead-in gap, so the page opens straight onto the review's hero. */}
            {p.videoId && (
              <Reveal>
                <ProjectVideo videoId={p.videoId} title={p.title} />
              </Reveal>
            )}
            <Review />
            {showcaseWorkflow}
          </div>
        ) : (
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
              <aside>{techStack}</aside>
            </div>
            {workflow}
          </div>
        )}
      </div>
    </section>
  );
}

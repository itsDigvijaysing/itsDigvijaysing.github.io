import { Link } from 'react-router-dom';

export default function ProjectCard({ p }) {
  return (
    <Link className="project-card" to={`/projects/${p.slug}`}>
      <div className="project-card__tags">
        {(p.tags || []).slice(0, 3).map((t) => (
          <span className="tag" key={t}>
            {t}
          </span>
        ))}
      </div>
      <h3>{p.title}</h3>
      <div className="project-card__sub">{p.subtitle}</div>
      <p>{p.desc}</p>
      <div className="project-card__footer">
        <span>View project ›</span>
      </div>
    </Link>
  );
}

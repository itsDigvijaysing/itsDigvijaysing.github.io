import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';

export default function NotFound() {
  usePageMeta({ title: 'Not found — Digvijaysing Rajput', description: 'Page not found.' });

  return (
    <section className="page-top">
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>404</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>This page doesn’t exist.</p>
        <Link className="btn btn--primary" to="/">
          Back home
        </Link>
      </div>
    </section>
  );
}

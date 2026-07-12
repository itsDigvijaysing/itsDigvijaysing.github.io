import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => { setOpen(false); }, [pathname]);

  const close = () => setOpen(false);

  return (
    <nav className={`site-nav${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <Link className="nav-brand" to="/" onClick={close}>
          <img className="nav-logo" src="/assets/img/logo.png" alt="" width="30" height="30" />
          <span className="nav-name">
            Digvijay<b>sing</b>
          </span>
        </Link>
        <button
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
        <ul id="primary-nav" className={`nav-links${open ? ' open' : ''}`}>
          <li>
            <NavLink to="/" end onClick={close}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={close}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/projects" onClick={close}>
              Projects
            </NavLink>
          </li>
          <li>
            <a href="https://magitech.site" target="_blank" rel="noopener noreferrer" onClick={close}>
              MagiTech
            </a>
          </li>
          <li>
            <a
              href="/assets/resume/Digvijaysing_RESUME.pdf"
              className="cta"
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
            >
              Resume ↓
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

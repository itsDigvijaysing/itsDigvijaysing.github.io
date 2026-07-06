import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>© 2026 Digvijaysing Rajput · Pune, India</p>
        <ul className="footer-links">
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/projects">Projects</Link>
          </li>
          <li>
            <a href="https://magitech.site" target="_blank" rel="noopener noreferrer">
              MagiTech
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/digvijaysing" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

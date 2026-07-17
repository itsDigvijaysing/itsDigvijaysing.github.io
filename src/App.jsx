import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import DotGrid from './components/DotGrid.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Journey from './pages/Journey.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  const { pathname } = useLocation();
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      {/* Ambient dot lattice behind interior pages. Skipped on Home, whose hero
          already owns the interactive ParticleWeb layer - two would be noise. */}
      {pathname !== '/' && <DotGrid />}
      <ScrollToTop />
      <Navbar />
      {/* key by pathname so the page replays its appear-transition on every route change */}
      <main id="main-content" tabIndex={-1} key={pathname} className="page-enter">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

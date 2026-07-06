import { Link } from 'react-router-dom';
import ParticleWeb from '../components/ParticleWeb.jsx';
import Magnetic from '../components/Magnetic.jsx';
import Reveal from '../components/Reveal.jsx';
import CountUp from '../components/CountUp.jsx';
import RotatingText from '../components/RotatingText.jsx';
import HeroBot from '../components/HeroBot.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import SocialLinks from '../components/SocialIcons.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { featuredProjects } from '../data/projects.js';

const roles = [
  'AI Researcher & Full-Stack Developer',
  'M.Tech CS · IIT Hyderabad',
  'Ex-Samsung SRIB · Ex-Cognizant',
  'Conversational AI · Web Agents · RAG',
];

const stats = [
  { value: 3, decimals: 0, suffix: '+', label: 'Years Industry Experience · AI, Salesforce, Cloud' },
  { value: 1, decimals: 0, suffix: '', label: 'Accepted Research Paper · IEEE APSCON 2026' },
  { value: 9.02, decimals: 2, suffix: '', label: 'M.Tech CGPA · IIT Hyderabad' },
  { value: 9.15, decimals: 2, suffix: '', label: 'B.E. CGPA · NBN Sinhgad, SPPU' },
];

const focus = [
  {
    k: 'Conversational AI',
    d: 'Voice, chat and email agents with real-time STT/TTS, multilingual support and hybrid RAG.',
  },
  {
    k: 'Web & LLM Agents',
    d: 'Browser-automating agents plus fine-tuning, evaluation and benchmarking pipelines.',
  },
  {
    k: 'Full-Stack & Cloud',
    d: 'React, Django and Node products shipped to Azure and AWS with end-to-end CI/CD.',
  },
];

export default function Home() {
  usePageMeta({
    title: 'Digvijaysing Rajput — AI & Full-Stack Developer',
    description:
      'Portfolio of Digvijaysing Rajput — M.Tech CS at IIT Hyderabad, former AI Research Intern at Samsung SRIB. Conversational AI, web agents, RAG and full-stack products.',
    path: '/',
  });

  return (
    <>
      <header className="hero">
        <div className="hero__bg">
          <div className="hero__grid" />
          <ParticleWeb />
          <div className="hero__glow" />
          <div className="hero__glow hero__glow--2" />
        </div>
        <div className="container hero__content">
          <img
            src="/assets/img/self.jpg"
            alt="Digvijaysing Rajput"
            className="hero__photo"
            width="156"
            height="156"
          />
          <div>
            <p className="hero__eyebrow">
              <RotatingText items={roles} />
            </p>
            <h1 className="hero__title">
              <span className="hero__hl">Digvijaysing</span> <span className="hero__hl">Rajput</span>
            </h1>
            <p className="hero__lead">
              I build AI that <em className="serif">ships</em> — fine-tuned web agents, conversational
              platforms, and research taken from paper to production.
            </p>
            <div className="hero__actions">
              <Magnetic>
                <Link className="btn btn--primary" to="/projects">
                  View Projects
                </Link>
              </Magnetic>
              <Link className="btn btn--ghost" to="/about">
                About Me
              </Link>
              <a
                className="btn btn--ghost"
                href="/assets/resume/Resume_final.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Resume
              </a>
            </div>
            <SocialLinks />
          </div>
          <HeroBot />
        </div>
      </header>

      <section>
        <div className="container">
          <Reveal className="stats">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="stat__value">
                  <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
                </div>
                <div className="stat__label">{s.label}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section>
        <div className="container">
          <Reveal className="section-header">
            <p className="section-label">What I build</p>
            <h2>
              Focus <span className="serif">areas</span>
            </h2>
            <p>From research prototypes to production systems — the work spans three connected tracks.</p>
          </Reveal>
          <div className="focus-grid">
            {focus.map((f, i) => (
              <Reveal key={f.k} index={i} style={{ display: 'flex' }}>
                <div className="focus-card">
                  <span className="focus-card__i">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{f.k}</h3>
                  <p>{f.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <Reveal className="section-header">
            <p className="section-label">Selected Work</p>
            <h2>
              Featured <span className="serif">projects</span>
            </h2>
            <p>AI agents, conversational platforms, and products — from production deployments to shipped apps.</p>
          </Reveal>
          <div className="project-grid">
            {featuredProjects.map((p, i) => (
              <Reveal key={p.slug} index={i} style={{ display: 'flex' }}>
                <ProjectCard p={p} />
              </Reveal>
            ))}
          </div>
          <Reveal style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link className="btn btn--ghost" to="/projects">
              View all projects →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import ParticleWeb from '../components/ParticleWeb.jsx';
import Reveal from '../components/Reveal.jsx';
import CountUp from '../components/CountUp.jsx';
import RotatingText from '../components/RotatingText.jsx';
import HeroBot from '../components/HeroBot.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import SocialLinks from '../components/SocialIcons.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { featuredProjects } from '../data/projects.js';

gsap.registerPlugin(useGSAP, SplitText);

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
  const heroRef = useRef(null);
  const titleRef = useRef(null);

  usePageMeta({
    title: 'Digvijaysing Rajput — AI & Full-Stack Developer',
    description:
      'Portfolio of Digvijaysing Rajput — M.Tech CS at IIT Hyderabad, former AI Research Intern at Samsung SRIB. Conversational AI, web agents, RAG and full-stack products.',
    path: '/',
  });

  // Battle-tested GSAP SplitText intro on the hero heading. Chars fade in AS
  // they settle (opacity tied to the transform) so the white letters never
  // read as "flying off" their gradient slabs. Skipped for reduced-motion;
  // useGSAP reverts both the tween and the SplitText DOM split on unmount.
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const split = SplitText.create(titleRef.current, { type: 'chars', charsClass: 'hero__char' });
      gsap.from(split.chars, {
        opacity: 0,
        yPercent: 60,
        rotationX: -70,
        transformOrigin: '50% 100%',
        stagger: 0.025,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.15,
      });
    },
    { scope: heroRef },
  );

  return (
    <>
      <header className="hero" ref={heroRef}>
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
            width="200"
            height="250"
          />
          <div>
            <p className="hero__eyebrow">
              <RotatingText items={roles} />
            </p>
            <h1 className="hero__title" ref={titleRef}>
              <span className="hero__hl">Digvijaysing</span> <span className="hero__hl">Rajput</span>
            </h1>
            <p className="hero__lead">
              I like building AI that actually <em className="serif">ships</em>. Lately that&rsquo;s meant
              fine-tuning web agents at Samsung, building multi-channel conversational platforms, and
              taking research through to production.
            </p>
            <div className="hero__actions">
              <Link className="btn btn--ghost" to="/projects">
                View Projects
              </Link>
              <Link className="btn btn--ghost" to="/about">
                About Me
              </Link>
              <a
                className="btn btn--primary"
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
            <p>Most of my work falls into these three areas.</p>
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
            <p>A few things I&rsquo;ve built and shipped, from production AI to side projects.</p>
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
              View all projects ›
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

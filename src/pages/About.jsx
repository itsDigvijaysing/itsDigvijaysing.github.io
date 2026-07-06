import Reveal from '../components/Reveal.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

export default function About() {
  usePageMeta({
    title: 'About — Digvijaysing Rajput',
    description:
      'Background, experience, education, research, skills and certifications of Digvijaysing Rajput — M.Tech CS at IIT Hyderabad, former AI Research Intern at Samsung SRIB.',
    path: '/about',
  });

  return (
    <>
      <section className="page-top">
        <div className="container">
          <Reveal className="section-header">
            <p className="section-label">About</p>
            <h1>
              Background &amp; <span className="serif">Experience</span>
            </h1>
            <p>
              M.Tech in Computer Science at IIT Hyderabad (NIS Teaching Assistant), specializing in AI,
              web agents, and full-stack systems. Previously AI Research Intern at Samsung SRIB and
              Salesforce Developer at Cognizant.
            </p>
          </Reveal>

          <div className="about-grid">
            <Reveal>
              <h2 className="col-label">Work Experience</h2>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-item__date">Jul 2025 – Jan 2026</div>
                  <div>
                    <h3>AI Research Intern</h3>
                    <p className="timeline-item__org">Samsung Research Institute Bangalore (SRIB)</p>
                    <ul>
                      <li>Fine-tuned Web Agent models, improving task success rate by 400% and workflow reliability.</li>
                      <li>Optimized Web Agent Framework, reducing token payload size by 40% and inference latency.</li>
                      <li>Implemented model evaluation &amp; benchmarking pipeline for reproducible results.</li>
                    </ul>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-item__date">Jul 2022 – Jul 2024</div>
                  <div>
                    <h3>Salesforce Developer</h3>
                    <p className="timeline-item__org">Cognizant Technology Solutions, Pune</p>
                    <ul>
                      <li>Developed enterprise Salesforce solutions with governance-compliant configurations.</li>
                      <li>Integrated Einstein AI for lead scoring and case assignment — 40% manual effort reduction.</li>
                      <li>Refactored legacy codebase from 60K to 35K lines.</li>
                    </ul>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-item__date">Mar – May 2022</div>
                  <div>
                    <h3>Cloud &amp; DevOps Intern</h3>
                    <p className="timeline-item__org">Microsoft Future Ready Talent (Remote)</p>
                    <ul>
                      <li>Containerized and deployed Mess Menu React app to Azure App Service with CI/CD.</li>
                      <li>Implemented end-to-end CI/CD in Azure DevOps.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <h2 className="col-label">Education</h2>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-item__date">2024 – 2026</div>
                  <div>
                    <h3>M.Tech Computer Science &amp; Engineering</h3>
                    <p className="timeline-item__org">IIT Hyderabad · CGPA 9.02 · NIS TA</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-item__date">2018 – 2022</div>
                  <div>
                    <h3>B.E. Computer Engineering</h3>
                    <p className="timeline-item__org">NBN Sinhgad Technical Institute, SPPU · CGPA 9.15</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-item__date">2017 / 2015</div>
                  <div>
                    <h3>HSC &amp; SSC</h3>
                    <p className="timeline-item__org">Sheth V.K. Shah Vidya Mandir · 74.92% / 88.20%</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <Reveal className="section-header">
            <p className="section-label">Research &amp; Skills</p>
            <h2>
              Academic Work &amp; <span className="serif">Technical Stack</span>
            </h2>
          </Reveal>
          <div className="about-grid">
            <Reveal>
              <h3 className="col-label">Research</h3>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-item__date">2025 – Present</div>
                  <div>
                    <h3>Adversarial Robustness in Florence-2 VLM</h3>
                    <p className="timeline-item__org">IEEE APSCON 2026 — Accepted</p>
                    <ul>
                      <li>Defense strategies for object detection under PGD/FGSM without model fine-tuning.</li>
                      <li>30% performance recovery via input- and feature-level transformations.</li>
                    </ul>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-item__date">2025 – Present</div>
                  <div>
                    <h3>Assumption-Free Class Incremental Learning (AFCIL)</h3>
                    <p className="timeline-item__org">IIT Hyderabad</p>
                    <ul>
                      <li>Dynamic Embedding Shift strategy with lightweight adapters on CIFAR-100 / ImageNet.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <h3 className="col-label">Skills</h3>
              <p className="subhead">Machine Learning &amp; AI</p>
              <div className="skills-grid" style={{ marginBottom: '1.5rem' }}>
                {['LLM / VLM Fine-Tuning', 'RAG', 'PyTorch', 'Transformers', 'LoRA', 'Deep RL', 'NLP'].map((s) => (
                  <span className="skill-pill" key={s}>{s}</span>
                ))}
              </div>
              <p className="subhead">Languages &amp; Web</p>
              <div className="skills-grid" style={{ marginBottom: '1.5rem' }}>
                {['Python', 'C++', 'SQL', 'React.js', 'Django', 'Node.js', 'Apex / LWC'].map((s) => (
                  <span className="skill-pill" key={s}>{s}</span>
                ))}
              </div>
              <p className="subhead">Tools</p>
              <div className="skills-grid">
                {['Git', 'Docker', 'Linux', 'Azure', 'CI/CD', 'Hugging Face'].map((s) => (
                  <span className="skill-pill" key={s}>{s}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <Reveal className="section-header">
            <p className="section-label">Credentials</p>
            <h2>
              Certifications &amp; <span className="serif">Achievements</span>
            </h2>
          </Reveal>
          <div className="about-grid">
            <Reveal>
              <h3 className="col-label">Certifications</h3>
              <div className="timeline">
                <div className="timeline-item" style={{ gridTemplateColumns: '1fr' }}>
                  <div>
                    <h3>Salesforce</h3>
                    <ul>
                      <li>Certified Administrator &amp; AI Associate</li>
                      <li>Platform Developer I &amp; II</li>
                      <li>JavaScript Developer I</li>
                      <li>Process Automation Accredited Professional</li>
                      <li>Copado Certification I &amp; II</li>
                    </ul>
                  </div>
                </div>
                <div className="timeline-item" style={{ gridTemplateColumns: '1fr' }}>
                  <div>
                    <h3>Cloud</h3>
                    <ul>
                      <li>Microsoft Certified Azure Fundamentals (AZ-900)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <h3 className="col-label">Achievements</h3>
              <div className="timeline">
                <div className="timeline-item" style={{ gridTemplateColumns: '1fr' }}>
                  <div>
                    <ul>
                      <li>Winner — ET Campus Star (Economic Times)</li>
                      <li>1st Place — AI Ideathon, Innovation Elan n Vision, Dev Duel (IIT Hyderabad)</li>
                      <li>2nd Place — Pulse Quest Hackathon (IIT Hyderabad)</li>
                      <li>Placement Coordinator — IIT Hyderabad</li>
                      <li>Coordinator, Epoch Club — ML/DL sessions</li>
                      <li>Hospitality Coordinator, SPICMACAY — IITH</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section>
        <Reveal className="container">
          <div className="contact-card">
            <div>
              <h2>
                Let&rsquo;s build something <span className="serif">together</span>.
              </h2>
              <p>itsDigvijaysing@gmail.com · cs24mtech14020@iith.ac.in · Pune, Maharashtra</p>
            </div>
            <a className="btn btn--primary" href="/assets/resume/Resume_final.pdf" target="_blank" rel="noopener noreferrer">
              Download Full Resume
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}

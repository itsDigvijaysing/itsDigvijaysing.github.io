import Reveal from '../components/Reveal.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

export default function About() {
  usePageMeta({
    title: 'About',
    description:
      'Background, experience, education, research, skills and certifications of Digvijaysing Rajput - M.Tech CS at IIT Hyderabad, former AI Research Intern at Samsung SRIB.',
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
              I&rsquo;m doing my M.Tech in Computer Science at IIT Hyderabad, where I also work as a
              Teaching Assistant. Most of my time goes into applied AI: fine-tuning LLMs and VLMs, building
              web agents, and RAG systems. Before this I spent four years across AI research, enterprise
              Salesforce, and cloud, and I still build open-source desktop and developer tools on the side.
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
                      <li>Fine-tuned web-agent models, lifting task success rate roughly 4× with steadier workflows.</li>
                      <li>Reworked the agent framework to cut token payload ~40%, lowering latency and cost.</li>
                      <li>Stood up a reproducible evaluation and benchmarking pipeline.</li>
                    </ul>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-item__date">Jul 2022 – Jul 2024</div>
                  <div>
                    <h3>Salesforce Developer</h3>
                    <p className="timeline-item__org">Cognizant Technology Solutions</p>
                    <ul>
                      <li>Delivered governance-compliant enterprise Salesforce solutions.</li>
                      <li>Added Einstein AI lead scoring and case routing, cutting manual effort ~40%.</li>
                      <li>Refactored a legacy codebase from ~60K to ~35K lines.</li>
                    </ul>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-item__date">Mar – May 2022</div>
                  <div>
                    <h3>Cloud &amp; DevOps Intern</h3>
                    <p className="timeline-item__org">Microsoft Future Ready Talent (Remote)</p>
                    <ul>
                      <li>Containerized a React app onto Azure App Service with end-to-end CI/CD.</li>
                      <li>Automated the release pipeline in Azure DevOps.</li>
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
                    <p className="timeline-item__org">IIT Hyderabad · CGPA 9.02</p>
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
                  <div className="timeline-item__date">2015 – 2017</div>
                  <div>
                    <h3>HSC</h3>
                    <p className="timeline-item__org">Sheth V.K. Shah Vidya Mandir · 74.92%</p>
                  </div>
                </div>
              <div className="timeline-item">
                  <div className="timeline-item__date">2014 – 2015</div>
                  <div>
                    <h3>SSC</h3>
                    <p className="timeline-item__org">Sheth V.K. Shah Vidya Mandir · 88.20%</p>
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
                  <div className="timeline-item__date">2026</div>
                  <div>
                    <h3>Adversarial Robustness in Florence-2 VLM</h3>
                    <p className="timeline-item__org">IEEE APSCON 2026 · Accepted</p>
                    <ul>
                      <li>Retraining-free defense for object detection under FGSM/PGD attacks.</li>
                      <li>Recovered ~30% performance via input- and feature-level transforms.</li>
                    </ul>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-item__date">2026</div>
                  <div>
                    <h3>DES: Efficient Long-Tailed Exemplar-Free CL on VLM</h3>
                    <p className="timeline-item__org">IJCAI GLOW 2026 Workshop · Accepted</p>
                    <ul>
                      <li>Proposed Dynamic Expert Saturation (DES), a two-phase framework for long-tailed, exemplar-free continual learning in vision-language models.</li>
                      <li>Achieved up to 3.08% higher accuracy than the strongest baseline and 2.5–3.9x faster performance than prompt-based methods on CIFAR100-LT and ImageNet100-LT.</li>
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
                      <li>Platform Developer I &amp; II</li>
                      <li>Certified Administrator &amp; AI Associate</li>
                      <li>JavaScript Developer I · Process Automation · Copado I &amp; II</li>
                    </ul>
                  </div>
                </div>
                <div className="timeline-item" style={{ gridTemplateColumns: '1fr' }}>
                  <div>
                    <h3>Cloud</h3>
                    <ul>
                      <li>Microsoft Certified: Azure Fundamentals (AZ-900)</li>
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
                      <li>Winner: ET Campus Star (Economic Times)</li>
                      <li>1st place: AI Ideathon, Innovation Elan &amp; Dev Duel (IIT Hyderabad)</li>
                      <li>2nd place: Pulse Quest Hackathon (IIT Hyderabad)</li>
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
              <p>itsDigvijaysing@gmail.com · cs24mtech14020@iith.ac.in · India</p>
            </div>
            <a className="btn btn--primary" href="/assets/resume/Digvijaysing_RESUME.pdf" target="_blank" rel="noopener noreferrer">
              Download Full Resume
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}

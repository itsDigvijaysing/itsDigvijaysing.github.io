import Reveal from '../components/Reveal.jsx';
import JourneyPath from '../components/JourneyPath.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

// Authored as education/work eras, oldest to newest, each optionally carrying
// the research/product/internship milestones that happened during it (e.g.
// the papers, SRIB internship and LightSpeak all landed inside the M.Tech
// years). Flattened below into one card per spine entry. `color` (not array
// position) decides which color band a card sits in - SSC and HSC stay two
// separate cards but share `color: 'school'`, so "merge" means "same
// background," not "combined into one card." JourneyPath groups consecutive
// same-color cards into one band instead of relying on visual nesting.
// Resume facts stay in sync with CLAUDE.md + About.
const journeyEras = [
  {
    period: '2014 – 2015',
    kind: 'education',
    title: 'SSC',
    org: 'Sheth V.K. Shah Vidya Mandir · 88.20%',
    color: 'school',
  },
  {
    period: '2015 – 2017',
    kind: 'education',
    title: 'HSC',
    org: 'Sheth V.K. Shah Vidya Mandir · 74.92%',
    color: 'school',
  },
  {
    period: '2018 – 2022',
    kind: 'education',
    title: 'B.E. Computer Engineering',
    org: 'NBN Sinhgad Technical Institute, SPPU · CGPA 9.15',
    color: 'btech',
    children: [
      {
        period: 'Mar – May 2022',
        kind: 'work',
        title: 'Cloud & DevOps Intern',
        org: 'Microsoft Future Ready Talent (Remote)',
        points: [
          'Containerized a React app onto Azure App Service with end-to-end CI/CD.',
          'Automated the release pipeline in Azure DevOps.',
        ],
      },
    ],
  },
  {
    period: 'Jul 2022 – Jul 2024',
    kind: 'work',
    title: 'Salesforce Developer',
    org: 'Cognizant Technology Solutions',
    color: 'cognizant',
    points: [
      'Delivered governance-compliant enterprise Salesforce solutions.',
      'Added Einstein AI lead scoring and case routing, cutting manual effort ~40%.',
      'Refactored a legacy codebase from ~60K to ~35K lines.',
    ],
  },
  {
    period: '2024 – 2026',
    kind: 'education',
    title: 'M.Tech Computer Science & Engineering',
    org: 'IIT Hyderabad · CGPA 9.02',
    color: 'mtech',
    points: ['Teaching Assistant for Network & Information Security (NIS).'],
    children: [
      {
        period: 'Jul 2025 – Jan 2026',
        kind: 'work',
        title: 'AI Research Intern',
        org: 'Samsung Research Institute Bangalore (SRIB)',
        points: [
          'Fine-tuned web-agent models, lifting task success rate roughly 4x with steadier workflows.',
          'Reworked the agent framework to cut token payload ~40%, lowering latency and cost.',
          'Stood up a reproducible evaluation and benchmarking pipeline.',
        ],
      },
      {
        period: 'Nov 2025',
        kind: 'product',
        title: 'LightSpeak AI',
        org: 'Multi-channel customer-care AI · Live',
        to: '/projects/lightspeak-ai',
        points: [
          'Launched a multi-tenant platform that embeds voice, chat and email AI agents into customer products, each answering from the tenant’s own documents via hybrid RAG.',
        ],
      },
      {
        period: '2026',
        kind: 'research',
        title: 'Adversarial Robustness in Florence-2 VLM',
        org: 'IEEE APSCON 2026 · Accepted',
        points: [
          'Retraining-free defense for object detection under FGSM/PGD attacks.',
          'Recovered ~30% performance via input- and feature-level transforms.',
        ],
      },
      {
        period: '2026',
        kind: 'research',
        title: 'DES: Efficient Long-Tailed Exemplar-Free CL on VLM',
        org: 'IJCAI GLOW 2026 Workshop · Accepted',
        points: [
          'Proposed Dynamic Expert Saturation (DES), a two-phase framework for long-tailed, exemplar-free continual learning in vision-language models.',
          'Achieved up to 3.08% higher accuracy than the strongest baseline and 2.5–3.9x faster performance than prompt-based methods on CIFAR100-LT and ImageNet100-LT.',
        ],
      },
    ],
  },
  {
    period: '2026 →',
    kind: 'future',
    title: 'The Road Ahead',
    org: 'Still building, still learning',
    color: 'ahead',
    future: true,
    points: ['Continuing to ship AI products and push on research at the edge of what these models can do.'],
    quote: 'The next chapter is always the one still being written.',
  },
];

// One flat list, one card per spine entry - a milestone immediately follows
// the era it happened during, and inherits that era's `color` for banding
// (SSC/HSC both get 'school' while staying separate cards).
const journey = journeyEras.flatMap((era) => {
  const { children, ...card } = era;
  return [card, ...(children || []).map((c) => ({ ...c, color: era.color }))];
});

export default function Journey() {
  usePageMeta({
    title: 'Journey - Digvijaysing Rajput',
    description:
      'The milestone path of Digvijaysing Rajput - education and work from 2014 to 2026, from SSC through IIT Hyderabad and Samsung SRIB, with each era color-banded so the research, products and internships within it are easy to place.',
    path: '/journey',
  });

  return (
    <section className="page-top">
      <div className="container">
        <Reveal className="section-header">
          <p className="section-label">Journey · Milestones</p>
          <h1>
            The path <span className="serif">so far</span>
          </h1>
          <p>
            Education and work, oldest to newest - each era gets its own color band, so everything shipped
            or published during it is easy to place.
          </p>
        </Reveal>
        <JourneyPath items={journey} />
      </div>
    </section>
  );
}

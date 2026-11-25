// Per-route <head> metadata in one place. Read twice: by the pages at runtime
// (usePageMeta) and by scripts/prerender-routes.mjs at build time, which writes
// each route out as its own HTML file carrying these tags. Keeping both on one
// source is what stops the static tags and the runtime tags drifting apart.
export const SITE = 'https://itsdigvijaysing.github.io';
const NAME = 'Digvijaysing Rajput';

export const PAGE_META = {
  '/': {
    title: NAME,
    description:
      'Portfolio of Digvijaysing Rajput - Senior Engineer at Samsung R&D Institute India, Bangalore (SRIB), M.Tech CSE from IIT Hyderabad. LLM web agents, conversational AI, RAG and full-stack products.',
    path: '/',
  },
  '/about': {
    title: `About - ${NAME}`,
    description:
      'Experience, education, M.Tech thesis, research, skills and certifications of Digvijaysing Rajput - Senior Engineer at Samsung SRIB, M.Tech CSE from IIT Hyderabad.',
    path: '/about',
  },
  '/journey': {
    title: `Journey - ${NAME}`,
    description:
      'The milestone path of Digvijaysing Rajput - education and work from 2014 to 2026, from SSC through IIT Hyderabad and Samsung SRIB, with each era color-banded so the research, products and internships within it are easy to place.',
    path: '/journey',
  },
  '/projects': {
    title: `Projects - ${NAME}`,
    description:
      'Projects by Digvijaysing Rajput - AI agents, conversational platforms, RAG systems, mobile and desktop apps, and research.',
    path: '/projects',
  },
};

export const NOT_FOUND_META = {
  title: `Not found - ${NAME}`,
  description: 'Page not found.',
};

export const projectMeta = (p) => ({
  title: `${p.title} - ${NAME}`,
  description: p.desc || p.overview,
  path: `/projects/${p.slug}`,
});

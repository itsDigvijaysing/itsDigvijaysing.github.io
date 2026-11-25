// Post-build step (runs after `vite build`, see package.json).
//
// GitHub Pages has no SPA rewrite, so before this every route except / was served
// from 404.html: the app still rendered, but with HTTP status 404 (search engines
// drop those pages) and with the homepage's <head> (link-preview bots don't run
// JS, so per-route tags set by usePageMeta never reached them).
//
// This writes one HTML file per route from the built index.html, with that
// route's title, description, canonical and Open Graph / Twitter tags filled in.
// GitHub Pages serves /about from about.html and /projects/x from projects/x.html
// with status 200. 404.html stays as the fallback for unknown URLs only.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import projects from '../src/data/projects.js';
import { NOT_FOUND_META, PAGE_META, SITE, projectMeta } from '../src/data/pageMeta.js';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const template = readFileSync(join(DIST, 'index.html'), 'utf8');

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Replace one tag's value, failing the build if the tag is missing, so an
// index.html edit can't silently ship pages without their metadata.
function swap(html, re, value) {
  if (!re.test(html)) throw new Error(`prerender-routes: no match for ${re}`);
  return html.replace(re, (_, before, after) => before + esc(value) + after);
}
const metaRe = (attr, key) => new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`);

function render({ title, description, path }, { noindex = false } = {}) {
  const url = SITE + path;
  let html = template;
  html = swap(html, /(<title>)[^<]*(<\/title>)/, title);
  html = swap(html, metaRe('name', 'description'), description);
  html = swap(html, /(<link\s+rel="canonical"\s+href=")[^"]*(")/, url);
  html = swap(html, metaRe('property', 'og:title'), title);
  html = swap(html, metaRe('property', 'og:description'), description);
  html = swap(html, metaRe('property', 'og:url'), url);
  html = swap(html, metaRe('name', 'twitter:title'), title);
  html = swap(html, metaRe('name', 'twitter:description'), description);
  if (noindex) html = html.replace('</head>', '    <meta name="robots" content="noindex" />\n  </head>');
  return html;
}

function write(file, html) {
  const out = join(DIST, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
}

const pages = [
  ['index.html', PAGE_META['/']],
  ['about.html', PAGE_META['/about']],
  ['journey.html', PAGE_META['/journey']],
  ['projects.html', PAGE_META['/projects']],
  ...projects.map((p) => [`projects/${p.slug}.html`, projectMeta(p)]),
];
for (const [file, meta] of pages) write(file, render(meta));
write('404.html', render({ ...NOT_FOUND_META, path: '/' }, { noindex: true }));

console.log(`prerender-routes: wrote ${pages.length} route pages + 404.html`);

import { useEffect } from 'react';

// Lightweight per-route metadata (no react-helmet dependency). Patches the tags
// that already exist in index.html so each SPA route emits its own title,
// description, canonical URL and Open Graph title/description/url.
const SITE = 'https://itsdigvijaysing.github.io';

function setAttr(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

export default function usePageMeta({ title, description, path = '' }) {
  useEffect(() => {
    const url = SITE + path;
    if (title) {
      document.title = title;
      setAttr('meta[property="og:title"]', 'content', title);
      setAttr('meta[name="twitter:title"]', 'content', title);
    }
    if (description) {
      setAttr('meta[name="description"]', 'content', description);
      setAttr('meta[property="og:description"]', 'content', description);
      setAttr('meta[name="twitter:description"]', 'content', description);
    }
    setAttr('meta[property="og:url"]', 'content', url);
    setAttr('link[rel="canonical"]', 'href', url);
  }, [title, description, path]);
}

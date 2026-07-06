import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    // Move focus to the page region so keyboard/SR users aren't stranded on the
    // old route. Programmatic focus won't trigger :focus-visible, so no ring flash.
    const main = document.getElementById('main-content');
    if (main) main.focus({ preventScroll: true });
  }, [pathname]);
  return null;
}

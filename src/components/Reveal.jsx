import { useEffect, useRef, useState } from 'react';

// Scroll-triggered reveal via IntersectionObserver + CSS (light, headless-friendly).
// `index` adds a subtle stagger for grids/lists.
export default function Reveal({ children, index = 0, className, style }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = ['reveal', visible ? 'visible' : '', className].filter(Boolean).join(' ');
  return (
    <div ref={ref} className={cls} style={{ ...style, '--i': index }}>
      {children}
    </div>
  );
}

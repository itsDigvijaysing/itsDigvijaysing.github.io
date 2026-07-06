import { useEffect, useRef, useState } from 'react';

// Counts from 0 → value when scrolled into view (easeOutCubic).
export default function CountUp({ value, decimals = 0, suffix = '', duration = 1400 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return undefined;
    }
    let raf = 0;
    done.current = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done.current) {
            done.current = true;
            io.unobserve(e.target);
            const start = performance.now();
            const step = (now) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - (1 - t) ** 3;
              setDisplay(value * eased);
              if (t < 1) raf = requestAnimationFrame(step);
              else setDisplay(value);
            };
            raf = requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

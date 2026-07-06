import { useEffect, useRef } from 'react';

// Wraps a child (button/link) so it eases toward the cursor. Fine pointers only.
export default function Magnetic({ children, strength = 0.25 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * strength;
      const dy = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const reset = () => {
      el.style.transform = '';
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', reset);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', reset);
    };
  }, [strength]);

  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  );
}

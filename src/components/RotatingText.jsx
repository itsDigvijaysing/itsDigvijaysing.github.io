import { useEffect, useRef, useState } from 'react';

// Rotating descriptor line — fades between phrases. Visible by default (SSR/first paint safe).
export default function RotatingText({ items = [], interval = 2800 }) {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);
  const innerRef = useRef(null);

  useEffect(() => {
    if (items.length < 2) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => {
      setVisible(false);
      innerRef.current = setTimeout(() => {
        setI((n) => (n + 1) % items.length);
        setVisible(true);
      }, 320);
    }, interval);
    return () => {
      clearInterval(t);
      clearTimeout(innerRef.current);
    };
  }, [items.length, interval]);

  return (
    <span className="rotating" style={{ opacity: visible ? 1 : 0 }}>
      {items[i]}
    </span>
  );
}

import { useEffect, useRef } from 'react';

// Lightweight reactive "constellation web" background (canvas, no deps).
export default function ParticleWeb() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let points = [];
    const mouse = { x: -9999, y: -9999 };
    const LINK = 150;
    const MOUSE_LINK = 200;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(30, Math.min(95, Math.round((w * h) / 12500)));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    };

    const render = (animate) => {
      ctx.clearRect(0, 0, w, h);
      if (animate) {
        for (const p of points) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
      }
      for (let i = 0; i < points.length; i += 1) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j += 1) {
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(20, 157, 221, ${0.22 * (1 - d / LINK)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const mdx = a.x - mouse.x;
        const mdy = a.y - mouse.y;
        const md = Math.hypot(mdx, mdy);
        if (md < MOUSE_LINK) {
          ctx.strokeStyle = `rgba(39, 64, 182, ${0.34 * (1 - md / MOUSE_LINK)})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      for (const p of points) {
        ctx.fillStyle = 'rgba(20, 157, 221, 0.8)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      render(true);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    window.addEventListener('resize', resize);
    if (reduced) {
      render(false);
    } else {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseout', onLeave);
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-web" aria-hidden="true" />;
}

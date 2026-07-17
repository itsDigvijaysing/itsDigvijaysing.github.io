import { useEffect, useRef } from 'react';

// Ambient dot lattice (canvas, no deps). Light-theme cursor spotlight: resting
// dots are almost invisible, so the page reads clean, and only the dots near the
// pointer deepen toward the accent blue - a soft pool that follows the cursor and
// eases back as it moves on. Renders only while the highlight is settling (no
// continuous rAF loop); purely decorative and pointer-transparent. A radial mask
// (in CSS) fades it to nothing at the edges. Reduced-motion / touch: static grid.
export default function DotGrid() {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const GAP = 30;
    const R = 130; // cursor influence radius
    let w = 0;
    let h = 0;
    let dots = [];
    let raf = 0;
    const mouse = { x: -1e4, y: -1e4 };
    const cur = { x: -1e4, y: -1e4 }; // eased highlight position trails the cursor

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const dist = Math.hypot(d.x - cur.x, d.y - cur.y);
        // Resting dots barely register; the cursor pool is what you actually see.
        let r = 1;
        let style = 'rgba(18, 35, 61, 0.045)';
        if (dist < R) {
          const t = 1 - dist / R;
          const tt = t * t; // eased - strongest right at the cursor
          r = 1 + 1.5 * tt;
          style = `rgba(20, 157, 221, ${0.06 + 0.5 * tt})`;
        }
        ctx.fillStyle = style;
        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      cur.x += (mouse.x - cur.x) * 0.2;
      cur.y += (mouse.y - cur.y) * 0.2;
      draw();
      // Keep animating until the highlight settles, then go idle.
      if (Math.hypot(mouse.x - cur.x, mouse.y - cur.y) > 0.5) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = host.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Center the lattice so the edge gutters are symmetric.
      const cols = Math.floor(w / GAP);
      const rows = Math.floor(h / GAP);
      const ox = (w - (cols - 1) * GAP) / 2;
      const oy = (h - (rows - 1) * GAP) / 2;
      dots = [];
      for (let i = 0; i < cols; i += 1) {
        for (let j = 0; j < rows; j += 1) dots.push({ x: ox + i * GAP, y: oy + j * GAP });
      }
      draw();
    };

    const onMove = (e) => {
      const rect = host.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      // First entry (or return after leaving): snap instead of sweeping in from the parked position.
      if (Math.hypot(mouse.x - cur.x, mouse.y - cur.y) > 1500) {
        cur.x = mouse.x;
        cur.y = mouse.y;
      }
      kick();
    };
    const onLeave = (e) => {
      if (e.relatedTarget) return; // only when the pointer leaves the window
      mouse.x = -1e4;
      mouse.y = -1e4;
      kick();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    if (!reduced) {
      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('mouseout', onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
    };
  }, []);

  return (
    <div ref={hostRef} className="dot-grid" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}

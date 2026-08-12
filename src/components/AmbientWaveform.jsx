import { useEffect, useRef } from 'react';

// A small looping bar-waveform, canvas-driven. Decorative only: aria-hidden, and a
// single static frame under prefers-reduced-motion. Colors are read off the DOM so it
// tracks the design tokens rather than hardcoding them.

const BARS = 64;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function AmbientWaveform() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const readColor = (name, fallback) =>
      getComputedStyle(canvas).getPropertyValue(name).trim() || fallback;
    const accent = readColor('--accent', '#149ddd');
    const base = readColor('--border-strong', 'rgba(18, 35, 61, 0.16)');

    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (cw === 0 || ch === 0) return false;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      return true;
    };

    const drawFrame = (t) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const gap = w / BARS;
      for (let b = 0; b < BARS; b += 1) {
        const phase = t + b * 0.35;
        const envelope = 0.35 + 0.65 * Math.abs(Math.sin((b / BARS) * Math.PI));
        const amp = (0.5 + 0.5 * Math.sin(phase)) * envelope;
        const barH = 10 * dpr + amp * (h - 20 * dpr);
        const x = b * gap + gap * 0.22;
        const barW = gap * 0.56;
        const y = (h - barH) / 2;
        const emphasized = b % 5 === 0;
        ctx.fillStyle = emphasized ? accent : base;
        ctx.globalAlpha = emphasized ? 0.95 : 0.6;
        ctx.fillRect(x, y, barW, barH);
      }
      ctx.globalAlpha = 1;
    };

    let raf = null;
    let startTs = null;
    const loop = (now) => {
      if (startTs === null) startTs = now;
      const t = ((now - startTs) / 1000) * 1.6;
      drawFrame(t);
      raf = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      if (raf) window.cancelAnimationFrame(raf);
      raf = null;
      startTs = null;
    };

    const render = () => {
      stop();
      if (!resize()) return;
      if (prefersReducedMotion()) {
        drawFrame(0);
        return;
      }
      raf = window.requestAnimationFrame(loop);
    };

    const onSizeChange = () => {
      if (raf !== null) {
        resize();
        return;
      }
      render();
    };

    const ro = new ResizeObserver(onSizeChange);
    ro.observe(canvas);
    window.addEventListener('resize', onSizeChange);

    render();

    return () => {
      stop();
      ro.disconnect();
      window.removeEventListener('resize', onSizeChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="ail__wave-canvas" aria-hidden="true" />;
}

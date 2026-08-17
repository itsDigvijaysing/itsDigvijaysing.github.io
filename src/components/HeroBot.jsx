import { useEffect, useRef, useState } from 'react';

// Transparent greeting mascot. On load - and again on every Home visit (App
// remounts the page on route change) - the "door" line drops from the top, the
// robot comes through and plays the full greeting once, then the whole thing
// repeats every 30s (the line re-drops each time). Not a continuous loop.
//
// WebKit (Safari and every iOS/iPadOS browser - they are all WKWebView) decodes
// VP9 but throws the alpha channel away, painting the mascot on an opaque
// rectangle. That is detected at runtime rather than by sniffing the UA: draw a
// frame to a canvas and read the alpha back. When it comes back fully opaque we
// swap to the still, which keeps real transparency over the particle backdrop.
export default function HeroBot() {
  const videoRef = useRef(null);
  const [cycle, setCycle] = useState(0); // bumps each greeting → restarts the door-drop animation
  const [phase, setPhase] = useState('hidden'); // 'hidden' | 'in' | 'out'
  const [alphaOk, setAlphaOk] = useState(true); // false → WebKit dropped the alpha, use the still
  const alphaOkRef = useRef(true); // read inside the playback timer without re-running the effect

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let started = false;
    let replay;
    let outTimer;

    const greet = () => {
      setCycle((n) => n + 1);
      setPhase('in'); // door line drops down from the top
      if (reduced) return; // reduced-motion: line shows, no autoplay
      if (alphaOkRef.current) {
        v.currentTime = 0;
        v.play().catch(() => {}); // full greeting plays; its lead-in shows the robot entering after the door
      } else {
        // Still fallback: no 'ended' event to wait on, so time the line to the clip length.
        outTimer = setTimeout(() => setPhase('out'), 9800);
      }
    };
    const onEnded = () => setPhase('out'); // greeting finished → line falls down and disappears

    const start = () => {
      if (started) return;
      started = true;
      greet(); // first greeting on load / Home visit
      replay = setInterval(greet, 30000); // and again every 30s
    };

    v.addEventListener('ended', onEnded);
    if (v.readyState >= 2) start(); // cached (repeat Home visit) → fire immediately
    else {
      v.addEventListener('loadeddata', start, { once: true });
      v.load();
    }
    return () => {
      clearInterval(replay);
      clearTimeout(outTimer);
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('loadeddata', start);
    };
  }, []);

  // Alpha capability probe. Runs until one frame yields a usable reading, then stops.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    const W = 32;
    const H = 54; // 520x882 scaled down - cheap, and the empty corners survive the resample
    const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    if (!ctx) return undefined; // no 2d context → can't probe, leave the video in place
    ctx.canvas.width = W;
    ctx.canvas.height = H;
    let done = false;

    const probe = () => {
      if (done) return;
      let opaque = false;
      let clear = false;
      try {
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(v, 0, 0, W, H);
        const { data } = ctx.getImageData(0, 0, W, H);
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] > 250) opaque = true;
          else if (data[i] < 250) clear = true;
        }
      } catch {
        done = true; // canvas readback unavailable → leave the video in place
        v.removeEventListener('timeupdate', probe);
        return;
      }
      // Nothing opaque yet means no real frame was drawn (the robot enters a
      // little after the clip starts), so wait for the next one.
      if (!opaque) return;
      done = true;
      v.removeEventListener('timeupdate', probe);
      if (!clear) {
        alphaOkRef.current = false;
        setAlphaOk(false);
        v.pause();
      }
    };

    v.addEventListener('timeupdate', probe);
    return () => v.removeEventListener('timeupdate', probe);
  }, []);

  return (
    <div className="hero__bot" aria-hidden="true">
      <div className="hero__bot-figure">
        <span className="hero__bot-aura" />
        <video
          ref={videoRef}
          className="hero__bot-media"
          muted
          playsInline
          preload="auto"
          hidden={!alphaOk}
        >
          <source src="/assets/img/hero_greeting.webm" type="video/webm" />
        </video>
        {!alphaOk && <img className="hero__bot-media" src="/assets/img/hero_bot_still.webp" alt="" />}
      </div>
      {/* key bumps each greeting so the drop-in animation restarts; phase drives in/out */}
      <span key={cycle} className={`hero__bot-line hero__bot-line--${phase}`} />
    </div>
  );
}

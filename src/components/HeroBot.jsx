import { useEffect, useRef, useState } from 'react';

// Transparent greeting mascot. On load - and again on every Home visit (App
// remounts the page on route change) - the "door" line drops from the top, the
// robot comes through and plays the full greeting once, then the whole thing
// repeats every 30s (the line re-drops each time). Not a continuous loop.
export default function HeroBot() {
  const videoRef = useRef(null);
  const [cycle, setCycle] = useState(0); // bumps each greeting → restarts the door-drop animation
  const [phase, setPhase] = useState('hidden'); // 'hidden' | 'in' | 'out'

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let started = false;
    let replay;

    const greet = () => {
      setCycle((n) => n + 1);
      setPhase('in'); // door line drops down from the top
      if (reduced) return; // reduced-motion: line shows, no autoplay
      v.currentTime = 0;
      v.play().catch(() => {}); // full greeting plays; its lead-in shows the robot entering after the door
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
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('loadeddata', start);
    };
  }, []);

  return (
    <div className="hero__bot" aria-hidden="true">
      <div className="hero__bot-figure">
        <span className="hero__bot-aura" />
        <video ref={videoRef} className="hero__bot-media" muted playsInline preload="auto">
          <source src="/assets/img/hero_greeting.webm" type="video/webm" />
        </video>
      </div>
      {/* key bumps each greeting so the drop-in animation restarts; phase drives in/out */}
      <span key={cycle} className={`hero__bot-line hero__bot-line--${phase}`} />
    </div>
  );
}

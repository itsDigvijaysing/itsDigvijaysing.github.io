import { useEffect, useRef, useState } from 'react';

// WebKit - Safari, and every iOS/iPadOS browser since they are all WKWebView -
// decodes VP9 but discards the alpha channel, so it paints the mascot on an
// opaque rectangle instead of over the hero backdrop.
//
// This is an engine check on purpose. Feature-detecting it does not work:
// WKWebView routinely hands back a blank frame from drawImage(video), so a
// canvas alpha probe never reaches a verdict and silently leaves the broken
// video in place. Evaluated once before first render, so on WebKit the webm is
// never requested at all and the still (real alpha) is what ships.
function webkitDropsVideoAlpha() {
  if (typeof window === 'undefined') return false;
  return /apple/i.test(window.navigator.vendor || '') || 'GestureEvent' in window;
}

// Transparent greeting mascot. On load - and again on every Home visit (App
// remounts the page on route change) - the "door" line drops from the top, the
// robot comes through and plays the full greeting once, then the whole thing
// repeats every 30s (the line re-drops each time). Not a continuous loop.
// On the still path the line keeps its rhythm on a timer instead.
export default function HeroBot() {
  const videoRef = useRef(null);
  const [cycle, setCycle] = useState(0); // bumps each greeting → restarts the door-drop animation
  const [phase, setPhase] = useState('hidden'); // 'hidden' | 'in' | 'out'
  const [useStill] = useState(webkitDropsVideoAlpha); // lazy init: decided before mount, never changes

  useEffect(() => {
    const v = videoRef.current; // null on the still path
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let started = false;
    let replay;
    let outTimer;

    const greet = () => {
      setCycle((n) => n + 1);
      setPhase('in'); // door line drops down from the top
      if (reduced) return; // reduced-motion: line shows, no autoplay
      if (v) {
        v.currentTime = 0;
        v.play().catch(() => {}); // full greeting plays; its lead-in shows the robot entering after the door
      } else {
        outTimer = setTimeout(() => setPhase('out'), 9800); // no 'ended' to wait on - match the clip length
      }
    };
    const onEnded = () => setPhase('out'); // greeting finished → line falls down and disappears

    const start = () => {
      if (started) return;
      started = true;
      greet(); // first greeting on load / Home visit
      replay = setInterval(greet, 30000); // and again every 30s
    };

    if (!v) start();
    else {
      v.addEventListener('ended', onEnded);
      if (v.readyState >= 2) start(); // cached (repeat Home visit) → fire immediately
      else {
        v.addEventListener('loadeddata', start, { once: true });
        v.load();
      }
    }
    return () => {
      clearInterval(replay);
      clearTimeout(outTimer);
      if (v) {
        v.removeEventListener('ended', onEnded);
        v.removeEventListener('loadeddata', start);
      }
    };
  }, []);

  return (
    <div className="hero__bot" aria-hidden="true">
      <div className="hero__bot-figure">
        <span className="hero__bot-aura" />
        {useStill ? (
          <img className="hero__bot-media" src="/assets/img/hero_bot_still.webp" alt="" />
        ) : (
          <video ref={videoRef} className="hero__bot-media" muted playsInline preload="auto">
            <source src="/assets/img/hero_greeting.webm" type="video/webm" />
          </video>
        )}
      </div>
      {/* key bumps each greeting so the drop-in animation restarts; phase drives in/out */}
      <span key={cycle} className={`hero__bot-line hero__bot-line--${phase}`} />
    </div>
  );
}

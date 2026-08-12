import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../utils/motion.js';

const STAGES = ['Editor', 'Terminal', 'Browser', 'Notes'];

function StackMockup() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const id = window.setInterval(() => setActive((n) => (n + 1) % STAGES.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="gsm__mock">
      <div className="gsm__sidebar">
        {STAGES.map((name, i) => (
          <button
            key={name}
            type="button"
            onClick={() => setActive(i)}
            className={`gsm__card${i === active ? ' gsm__card--active' : ''}${i % 2 === 0 ? ' gsm__card--left' : ' gsm__card--right'}`}
          >
            <span className="gsm__card-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="gsm__card-label">{name}</span>
          </button>
        ))}
      </div>
      <div className="gsm__mock-cap">
        <p>One stage in front, the rest wait as a stacked sidebar - click a card to swap.</p>
        <span className="gsm__facts">GNOME 46–50 · Wayland + X11 · 3 sidebar modes · GPL-3.0</span>
      </div>
    </div>
  );
}

const MODES = [
  {
    key: 'groups',
    label: 'Groups',
    body: 'Windows you use together stay grouped. Only the active group is visible - the rest wait as stacked cards; click one to swap it to the front.',
  },
  {
    key: 'apps',
    label: 'Apps',
    body: "Cards are grouped per running application instead. Click a card to bring that app's windows to focus.",
  },
  {
    key: 'workspaces',
    label: 'Workspaces',
    body: 'Each virtual workspace gets its own card. Click to switch - the sidebar becomes a workspace switcher.',
  },
];

function ModeSwitcher() {
  const [mode, setMode] = useState(MODES[0].key);
  const current = MODES.find((m) => m.key === mode);

  return (
    <div className="gsm__modes">
      <div className="gsm__modes-tabs" role="tablist">
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            role="tab"
            aria-selected={mode === m.key}
            className={`gsm__modes-tab${mode === m.key ? ' gsm__modes-tab--active' : ''}`}
            onClick={() => setMode(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="gsm__modes-body">{current.body}</p>
    </div>
  );
}

const DEFAULTS = [
  { label: 'Sidebar Width', value: '220px' },
  { label: 'Perspective Angle', value: '22°' },
  { label: 'Card Base Scale', value: '70%' },
  { label: 'Animation Duration', value: '250ms' },
  { label: 'Hide Delay', value: '800ms' },
  { label: 'Edge Trigger Width', value: '4px' },
  { label: 'Auto-hide Sidebar', value: 'Off' },
  { label: 'Sidebar Visibility', value: 'Always on' },
];

const CHECKLIST = [
  {
    title: 'Click-through empty space',
    body: 'The sidebar has no background bar - only each card gets a frosted-glass pill, so empty space passes clicks straight to the window underneath.',
  },
  {
    title: 'Fullscreen-aware',
    body: 'The sidebar hides instantly the moment any window goes fullscreen - no manual toggle needed.',
  },
  {
    title: 'Icon fallback',
    body: "Minimized windows that can't be cloned show an app-icon grid instead of a blank thumbnail.",
  },
  {
    title: 'Per-workspace stages',
    body: 'Each workspace keeps its own group arrangement; switching away and back leaves it exactly as you left it.',
  },
  {
    title: 'Bell-curve hover',
    body: 'Hovering a card scales it up smoothly, with only its one or two nearest neighbors nudged - a tight sigma, not a wide ripple.',
  },
  {
    title: 'Consistent 3D perspective',
    body: 'Every card shares the same Y-axis rotation direction, so the stack reads as one coherent depth, not a random pile.',
  },
  {
    title: 'Adaptive card shape',
    body: 'Thumbnails take their size from the sidebar width and their shape from the window they show - any display density, any aspect ratio.',
  },
  {
    title: 'Auto-hide is opt-in',
    body: "Off by default, matching macOS's always-visible behavior; toggle it on for hover-to-reveal instead.",
  },
];

export default function GnomeStageManagerReview() {
  return (
    <>
      <section className="dt__section">
        <StackMockup />
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">01</span> Three sidebar modes</h2>
        <p className="dt__section-note">The sidebar content is a config choice, not a fixed mode - try each one.</p>
        <ModeSwitcher />
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">02</span> Defaults</h2>
        <p className="dt__section-note">Every one of these is a live preference - shown here at what ships out of the box.</p>
        <div className="gsm__chips">
          {DEFAULTS.map((d) => (
            <span key={d.label} className="gsm__chip">
              <span className="gsm__chip-label">{d.label}</span>
              <span className="gsm__chip-value">{d.value}</span>
            </span>
          ))}
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">03</span> Swap, not switch</h2>
        <p className="dt__section-note">Stages are per workspace: each one keeps its own arrangement, intact when you switch away and back.</p>
        <div className="gsm__swap">
          <div className="gsm__swap-box gsm__swap-box--active">
            <span className="gsm__swap-tag">now visible</span>
            <span className="gsm__swap-title">Active group</span>
          </div>
          <span className="gsm__swap-arrow" aria-hidden="true">⇄</span>
          <div className="gsm__swap-box">
            <span className="gsm__swap-tag">stacked in sidebar</span>
            <span className="gsm__swap-title">Inactive group</span>
          </div>
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">04</span> What it gets right</h2>
        <p className="dt__section-note">The small decisions that make a window manager feel native, not bolted on.</p>
        <ul className="gsm__checklist">
          {CHECKLIST.map((c) => (
            <li key={c.title} className="gsm__check-item">
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

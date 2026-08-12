import { Fragment, useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../utils/motion.js';

const CX = 100;
const CY = 100;
const R = 62;

const PHASES = [
  { key: 'observe', label: 'Observe', note: 'DOM · a11y tree · screenshot, over CDP' },
  { key: 'decide', label: 'Decide', note: 'LLM returns structured output' },
  { key: 'act', label: 'Act', note: 'multi_act · tools · watchdogs' },
];

const polar = (deg, r = R) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};

// Each phase owns a 120-degree arc, inset slightly so the three read as separate.
const arcFor = (i) => {
  const [x1, y1] = polar(i * 120 + 6);
  const [x2, y2] = polar((i + 1) * 120 - 6);
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
};

function LoopDiagram() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const id = window.setInterval(() => setI((n) => n + 1), 2200);
    return () => window.clearInterval(id);
  }, []);

  const active = i % PHASES.length;

  return (
    <div className="wba__loop">
      <svg
        className="wba__loop-svg"
        viewBox="0 0 200 200"
        role="img"
        aria-label="The agent's step loop: observe, decide, act, repeating until the task is done"
      >
        {PHASES.map((p, idx) => (
          <path
            key={p.key}
            className={`wba__arc${idx === active ? ' wba__arc--active' : ''}`}
            d={arcFor(idx)}
          />
        ))}
        {PHASES.map((p, idx) => {
          const [x, y] = polar(idx * 120 + 60, R);
          return (
            <circle
              key={p.key}
              className={`wba__arc-dot${idx === active ? ' wba__arc-dot--active' : ''}`}
              cx={x}
              cy={y}
              r={4}
            />
          );
        })}
        <text className="wba__loop-core" x={CX} y={CY - 4} textAnchor="middle">
          step
        </text>
        <text className="wba__loop-core-sub" x={CX} y={CY + 12} textAnchor="middle">
          loop
        </text>
      </svg>
      <ul className="wba__loop-key">
        {PHASES.map((p, idx) => (
          <li key={p.key} className={idx === active ? 'wba__loop-key--active' : undefined}>
            <span className="wba__loop-key-label">{p.label}</span>
            <span className="wba__loop-key-note">{p.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const MEMORY_STEPS = [
  { tag: 'after a run', name: 'Distil a lesson', note: 'The run is summarized into one short lesson.' },
  { tag: 'store', name: 'Append to JSONL', note: 'A local append-only file. No vector database.' },
  { tag: 'next task', name: 'Embed + cosine-rank', note: 'The new task is embedded and ranked against past runs.' },
  { tag: 'inject', name: 'Top lessons as hints', note: 'The best matches are injected into the model context.' },
];

const MODULES = [
  { dir: 'agent/', owns: 'The orchestrator', note: 'Runs the step loop, holds history, drives trajectory memory.' },
  { dir: 'browser/', owns: 'Session lifecycle', note: 'CDP transport, plus twelve watchdog services coordinating over an event bus.' },
  { dir: 'dom/', owns: 'Perception', note: 'DOM extraction, serialization, and the accessibility tree.' },
  { dir: 'llm/', owns: 'Provider abstraction', note: 'One interface over every supported model, returning validated structured output.' },
  { dir: 'tools/', owns: 'The action registry', note: 'The surface the model is allowed to call into - and what MCP exposes.' },
];

const REQUIREMENTS = ['Python ≥ 3.11', 'Chrome or Chromium', 'An LLM API key - or a local runtime instead'];

const CAPABILITIES = [
  {
    cat: 'Provider-agnostic',
    title: 'Whichever key is present wins',
    body: 'A unified LLM layer resolves hosted providers in priority order at startup, so the same agent runs unchanged against any of them.',
  },
  {
    cat: 'Keyless option',
    title: 'It can run entirely on your machine',
    body: 'Point both the model and the embedding provider at a local runtime via Ollama and the whole loop, memory included, works with no API key at all.',
  },
  {
    cat: 'Structured output',
    title: 'The model returns a typed object, not prose',
    body: 'Every decision comes back as a validated schema - thinking, memory, next_goal, actions - so a malformed reply fails loudly instead of being parsed by guesswork.',
  },
  {
    cat: 'No vector DB',
    title: 'Retrieval without infrastructure',
    body: 'Cosine ranking over an append-only JSONL file. It degrades to storage-only when no embedding provider is configured, rather than breaking.',
  },
  {
    cat: 'Event-driven',
    title: 'Twelve watchdogs on one bus',
    body: 'Browser concerns are separate subscribers on an event bus rather than branches inside the agent loop, so a new concern is a new subscriber.',
  },
  {
    cat: 'Interoperable',
    title: 'Also serves as an MCP server',
    body: 'The same tool surface the agent drives can be exposed to other clients, alongside a Jupyter-like code agent.',
  },
];

export default function WebAgentsReview() {
  return (
    <>
      <section className="dt__section">
        <LoopDiagram />
      </section>

      <section className="dt__section">
        <h2 className="dt__h2">
          <span className="dt__h2-num">01</span>
          One step, start to finish
        </h2>
        <p className="dt__section-note">Perception is rebuilt every step rather than cached, so the model always reasons about the page as it is now.</p>
        <div className="wba__pipeline">
          {[
            { tag: 'perceive', name: 'DOM + a11y tree + screenshot', where: 'CDP' },
            { tag: 'serialize', name: 'Index interactive elements', where: 'stable handles' },
            { tag: 'prompt', name: 'MessageManager builds context', where: '+ retrieved lessons' },
            { tag: 'decide', name: 'Structured AgentOutput', where: 'schema-validated' },
            { tag: 'act', name: 'multi_act over the tool registry', where: 'several actions per step' },
          ].map((n, idx, arr) => (
            <Fragment key={n.tag}>
              <div className="wba__node">
                <div className="wba__node-tag">{n.tag}</div>
                <div className="wba__node-name">{n.name}</div>
                <div className="wba__node-where">{n.where}</div>
              </div>
              {idx < arr.length - 1 && <span className="wba__arrow" aria-hidden="true" />}
            </Fragment>
          ))}
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2">
          <span className="dt__h2-num">02</span>
          It remembers
        </h2>
        <p className="dt__section-note">The part that makes this more than another automation wrapper: a finished run leaves something behind for the next one.</p>
        <ol className="wba__memory">
          {MEMORY_STEPS.map((s) => (
            <li key={s.tag} className="wba__memory-step">
              <span className="wba__memory-tag">{s.tag}</span>
              <span className="wba__memory-name">{s.name}</span>
              <p className="wba__memory-note">{s.note}</p>
            </li>
          ))}
        </ol>
        <p className="wba__memory-path">
          <code>~/.config/webagent/memory/trajectories.jsonl</code>
        </p>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">03</span> Five modules, one job each</h2>
        <p className="dt__section-note">Browser messiness is quarantined in one module and never leaks into the agent loop - which is why a new browser concern is a new subscriber rather than another branch.</p>
        <dl className="wba__modules">
          {MODULES.map((m) => (
            <div key={m.dir} className="wba__module">
              <dt className="wba__module-dir">{m.dir}</dt>
              <dd className="wba__module-body">
                <strong>{m.owns}</strong>
                <span>{m.note}</span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="wba__reqs">
          {REQUIREMENTS.map((r) => (
            <span key={r} className="wba__req">{r}</span>
          ))}
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">04</span> Why it holds up</h2>
        <p className="dt__section-note">The design choices a reviewer would actually probe.</p>
        <div className="wba__grid">
          {CAPABILITIES.map((c) => (
            <div key={c.title} className="wba__card">
              <div className="wba__card-cat">{c.cat}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

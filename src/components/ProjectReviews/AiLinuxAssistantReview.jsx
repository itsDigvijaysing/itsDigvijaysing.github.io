import { Fragment, useEffect, useState } from 'react';
import AmbientWaveform from '../AmbientWaveform.jsx';
import { prefersReducedMotion } from '../../utils/motion.js';

const STATES = [
  { key: 'idle', label: 'idle', hue: '#626fc9' },
  { key: 'listening', label: 'listening', hue: '#3c8357' },
  { key: 'thinking', label: 'thinking', hue: '#945acb' },
  { key: 'speaking', label: 'speaking', hue: '#b9557b' },
  { key: 'loading', label: 'starting', hue: '#9b6d29' },
];

function StateMonogram() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const id = window.setInterval(() => setI((n) => n + 1), 2600);
    return () => window.clearInterval(id);
  }, []);

  const state = STATES[i % STATES.length];
  return (
    <div className="ail__monogram-row">
      <span className="ail__monogram" style={{ '--state-color': state.hue }} aria-hidden="true">AI</span>
      <span className="ail__monogram-label">top-bar monogram, live state colors from the shipped GNOME extension:{' '}<b style={{ color: state.hue }}>{state.label}</b></span>
    </div>
  );
}

const NODES = [
  { tag: 'input', name: 'Silero VAD', where: 'CPU · always listening', gpu: false },
  { tag: 'speech→text', name: 'Parakeet ASR', where: 'CPU · ONNX', gpu: false },
  { tag: 'reasoning', name: 'Local LLM · 4B', where: 'GPU · Ollama · thinking on', gpu: true },
  { tag: 'text→speech', name: 'SuperTonic TTS', where: 'CPU · ONNX', gpu: false },
  { tag: 'output', name: 'Speaker', where: 'PipeWire · AEC', gpu: false },
];

const STATS = [
  { num: '22/22', lbl: 'live tool-calling test: right tool picked every time, on a 4B local model' },
  { num: '42 / 19', lbl: 'destructive commands blocked / benign commands correctly allowed' },
  { num: '13 + 2', lbl: 'typed desktop tools, plus the new Todoist tools built this session' },
  { num: '0', lbl: 'runtime sudo calls; the whole voice loop runs as your user' },
];

const GATE_CARDS = [
  {
    title: 'Every tool call',
    body: 'Read-only tools (battery, time, search-open) run immediately, with no gate involved.',
    pill: null,
  },
  {
    title: 'Gated families',
    body: 'shell · skills_actions · computer_use',
    pill: { label: 'DENY by default', tone: 'deny' },
  },
  {
    title: 'Armed session',
    body: 'Interactive launches arm actions automatically so the assistant can actually act.',
    pill: { label: 'ALLOW', tone: 'allow' },
  },
  {
    title: 'Autonomy loop',
    body: 'Independent of every other setting: gated families are never runnable unsupervised.',
    pill: { label: 'HARD FLOOR', tone: 'floor' },
  },
];

const CAPABILITIES = [
  {
    cat: 'Privacy',
    title: 'Nothing leaves the machine by default',
    body: 'Brain, ASR, TTS, and VAD all run locally. No cloud call, no API key, unless you deliberately opt into a hosted-model config.',
  },
  {
    cat: 'Reliability',
    title: 'Typed tools, not injected commands',
    body: 'Each capability is a named function the model calls directly. The earlier keyword/RAG design was replaced after it misfired on ambient speech.',
  },
  {
    cat: 'Voice UX',
    title: 'Full-duplex barge-in',
    body: "Talk over it mid-sentence: PipeWire's WebRTC echo-cancel means the mic never re-hears the assistant's own voice.",
  },
  {
    cat: 'Native',
    title: 'A real GNOME Shell extension',
    body: 'The overlay orb and top-bar monogram are drawn by the Shell itself: no Electron, no browser view.',
  },
  {
    cat: 'Reversibility',
    title: 'Every install change is undoable',
    body: 'Setup records each system change to a manifest; uninstall reverts exactly those deltas, with a dry-run preview.',
  },
  {
    cat: 'Extensibility',
    title: 'New capabilities are a small, testable unit',
    body: 'Desktop actions and external integrations are both just typed MCP tools. The Todoist integration in this repo was added in one sitting.',
  },
  {
    cat: 'Flexibility',
    title: 'Two interchangeable brains',
    body: 'A local 4B model via Ollama by default, or a hosted model for more headroom: same tools, same gate, one config swap.',
  },
  {
    cat: 'Containment',
    title: 'Defense in depth, not one lock',
    body: 'A catastrophic-command denylist backed by kernel-enforced systemd-run resource caps: two independent layers, not one.',
  },
];

export default function AiLinuxAssistantReview() {
  return (
    <>
      <section className="dt__section">
        <StateMonogram />
        <div className="ail__wave">
          <AmbientWaveform />
          <div className="ail__wave-cap">
            <span>mic → vad → asr → llm → tts → speaker</span>
            <span>barge-in: full-duplex (pipewire aec)</span>
          </div>
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">01</span> The pipeline</h2>
        <p className="dt__section-note">One rule shapes everything downstream: only the language model sits on the GPU. Everything that hears and speaks runs on the CPU as ONNX.</p>
        <div className="ail__pipeline">
          {NODES.map((n, i) => (
            <Fragment key={n.name}>
              <div className={`ail__node${n.gpu ? ' ail__node--gpu' : ''}`}>
                <div className="ail__node-tag">{n.tag}</div>
                <div className="ail__node-name">{n.name}</div>
                <div className="ail__node-where">{n.where}</div>
              </div>
              {i < NODES.length - 1 && <span className="ail__arrow" aria-hidden="true" />}
            </Fragment>
          ))}
        </div>
        <div className="ail__budget">
          <div
            className="ail__budget-bar"
            role="img"
            aria-label="GPU footprint: a small, fixed slice held by the language model, the rest stays free for headroom and display"
          >
            <span className="ail__budget-seg ail__budget-seg--gpu">LLM</span>
            <span className="ail__budget-seg ail__budget-seg--cpu">headroom + display · everything else runs on CPU</span>
          </div>
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">02</span> Verified, not vibes</h2>
        <p className="dt__section-note">Numbers from actual test runs against the shipped config, not aspirational claims.</p>
        <div className="ail__stats">
          {STATS.map((s) => (
            <div key={s.lbl} className="ail__stat">
              <div className="ail__stat-num">{s.num}</div>
              <div className="ail__stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">03</span> The safety gate</h2>
        <p className="dt__section-note">A model that can run shell commands needs a gate designed for a background thread, not a blocking y/N prompt that would hang the voice loop.</p>
        <div className="ail__gate">
          {GATE_CARDS.map((c) => (
            <div key={c.title} className="ail__gate-card">
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              {c.pill && <span className={`ail__pill ail__pill--${c.pill.tone}`}>{c.pill.label}</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">04</span> Why it holds up</h2>
        <p className="dt__section-note">The design choices a reviewer would actually probe.</p>
        <div className="ail__grid">
          {CAPABILITIES.map((c) => (
            <div key={c.title} className="ail__card">
              <div className="ail__card-cat">{c.cat}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

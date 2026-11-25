import { Fragment, useEffect, useState } from 'react';
import AmbientWaveform from '../AmbientWaveform.jsx';
import { prefersReducedMotion } from '../../utils/motion.js';

// Phoenix v3 (the repo is still AI_Linux_Assistant). Every figure below comes from
// the published repo: README.md, SECURITY.md, src/ai_linux/ARCHITECTURE.md and the
// router benchmark in bench/README.md. Re-check them there before changing any.

// The app's status pill: state names from state.py STATE_LABELS. It has no colour
// per state; it gains an ember border while the big model thinks and speaks
// (pill.py `ail-big`), which is the one colour shown here, darkened to stay legible.
const EMBER = '#b4540a';
const STATES = [
  { label: 'Ready', big: false },
  { label: 'Listening', big: false },
  { label: 'Thinking', big: false },
  { label: 'Speaking', big: false },
  { label: 'Thinking · 4B on NVIDIA', big: true },
  { label: 'Speaking · 4B on NVIDIA', big: true },
];

function StatePill() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const id = window.setInterval(() => setI((n) => n + 1), 2600);
    return () => window.clearInterval(id);
  }, []);

  const state = STATES[i % STATES.length];
  const hue = state.big ? EMBER : 'var(--accent-2)';
  return (
    <div className="ail__monogram-row">
      <span className="ail__monogram" style={{ '--state-color': hue, borderColor: state.big ? EMBER : undefined }} aria-hidden="true">Ph</span>
      <span className="ail__monogram-label">status pill, states from the app; the ember edge means the big model took over:{' '}<b style={{ color: hue }}>{state.label}</b></span>
    </div>
  );
}

const NODES = [
  { tag: 'input', name: 'VAD + echo cancel', where: 'CPU · wake word "Phoenix"', gpu: false },
  { tag: 'speech→text', name: 'Parakeet ASR', where: 'CPU · ONNX', gpu: false },
  { tag: 'routing', name: 'Rules → 0.8B router', where: 'Intel iGPU · OpenVINO 8-bit', gpu: true },
  { tag: 'reasoning', name: 'Local LLM · 4B', where: 'NVIDIA · Ollama · only when needed', gpu: true },
  { tag: 'text→speech', name: 'SuperTonic TTS', where: 'CPU · ONNX', gpu: false },
];

const STATS = [
  { num: '74.1%', lbl: 'of real commands acted on correctly by the 0.8B router alone, with the NVIDIA GPU asleep' },
  { num: '2.3%', lbl: 'wrong actions at that confidence threshold; anything less sure goes up to the 4B' },
  { num: '90.1%', lbl: 'accuracy on 10 tools the router had never seen: a new tool is a menu line, not retraining' },
  { num: '30', lbl: 'typed built-in tools, plus any MCP server you add, its tools switched on one by one' },
];

const GATE_CARDS = [
  {
    title: 'Read-only tools',
    body: 'Time, system status, the weather or reading your tasks run at once, with no gate involved.',
    pill: null,
  },
  {
    title: 'Anything that changes the computer',
    body: 'Desktop tools, shell commands and every MCP tool run only while actions are allowed on the Safety page.',
    pill: { label: 'GATED', tone: 'deny' },
  },
  {
    title: 'Risky steps',
    body: 'A shell command is shown in full and needs a yes, on screen or by voice. Silence counts as no.',
    pill: { label: 'YOU CONFIRM', tone: 'allow' },
  },
  {
    title: 'Unattended automation',
    body: 'Independent of every other setting: nothing that changes the computer ever runs unsupervised.',
    pill: { label: 'HARD FLOOR', tone: 'floor' },
  },
];

const CAPABILITIES = [
  {
    cat: 'Privacy',
    title: 'Nothing leaves the machine by default',
    body: 'Speech recognition, both models and the voice run locally, and Phoenix listens on no port. The internet is used only for features you switch on: web look-ups, Todoist, MCP servers you add.',
  },
  {
    cat: 'Battery',
    title: 'The big GPU sleeps on battery',
    body: 'Separate battery and charger profiles. On battery the 0.8B router on the Intel GPU picks commands, and in Save Battery the 4B loads only when needed and is freed after 2 minutes.',
  },
  {
    cat: 'Speed',
    title: 'Plain commands need no model',
    body: '"Open Chrome", "lock the screen" or "set a timer for ten minutes" start with a command verb, so rules match them and they run at once. Everything else goes to the models.',
  },
  {
    cat: 'Voice UX',
    title: 'Full-duplex barge-in',
    body: 'Talk over it mid-reply. Its own echo canceller is fed every sound it plays, and an interruption stops the reply only if the words heard are not its own.',
  },
  {
    cat: 'Native',
    title: 'One GTK4 app',
    body: 'GTK4 and libadwaita, with a tray icon, a floating status pill and a global shortcut. No browser view and no Shell extension.',
  },
  {
    cat: 'Reliability',
    title: 'Typed tools, not shell strings',
    body: 'Volume, brightness, apps and media run fixed argument lists. Apps open only through their installed .desktop entry, so a request can never start poweroff.',
  },
  {
    cat: 'Memory',
    title: 'Knowledge that fades',
    body: 'Facts you keep stay until you delete them; facts it learns from conversation fade 14 days after they were last used. "Remember that..." and "forget that..." work by voice.',
  },
  {
    cat: 'Containment',
    title: 'Defense in depth, not one lock',
    body: 'A catastrophic-command blocklist in the one place every command runs, plus kernel-enforced systemd-run caps: 2 GB of memory, 512 tasks, 20 seconds.',
  },
];

export default function AiLinuxAssistantReview() {
  return (
    <>
      <section className="dt__section">
        <StatePill />
        <div className="ail__wave">
          <AmbientWaveform />
          <div className="ail__wave-cap">
            <span>mic → vad → asr → rules / 0.8b / 4b → tts → speaker</span>
            <span>barge-in: full-duplex (webrtc aec3)</span>
          </div>
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">01</span> The pipeline</h2>
        <p className="dt__section-note">Built for an ordinary gaming laptop: a 6 GB RTX 3060 Mobile next to an Intel iGPU. On battery, rules and a 0.8B model on the Intel GPU handle most commands, and only chat or an unsure pick wakes the 4B on NVIDIA. Everything that hears and speaks runs on the CPU as ONNX.</p>
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
            aria-label="Battery mode: 74 percent of real commands are handled by the small model on the Intel GPU; the rest, and all chat, wake the 4B model on NVIDIA"
          >
            <span className="ail__budget-seg ail__budget-seg--gpu" style={{ width: '74%' }}>0.8B on Intel iGPU · 74%</span>
            <span className="ail__budget-seg ail__budget-seg--cpu" style={{ width: '26%' }}>4B wakes</span>
          </div>
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">02</span> Measured, not vibes</h2>
        <p className="dt__section-note">From the repo&apos;s router benchmark: 771 requests (hand-written spoken-style commands plus the public MASSIVE and CLINC150 sets), confidence threshold fitted on 30% and scored on the other 70%. Median routing time on the Intel GPU: 502 ms.</p>
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
        <p className="dt__section-note">Whether rules, the 0.8B router or the 4B picked the action, it goes through the same gate, and a spoken yes or no counts the same as a click. No sudo at runtime, ever.</p>
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

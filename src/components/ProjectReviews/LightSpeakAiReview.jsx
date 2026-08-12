import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../utils/motion.js';

const CHANNELS = [
  { key: 'voice', label: 'Voice', hue: '#626fc9', area: 'voice' },
  { key: 'whatsapp', label: 'WhatsApp', hue: '#3c8357', area: 'whatsapp' },
  { key: 'chat', label: 'Chat', hue: '#945acb', area: 'chat' },
  { key: 'email', label: 'Email', hue: '#b9557b', area: 'email' },
];

function ChannelHub() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const id = window.setInterval(() => setActive((n) => (n + 1) % CHANNELS.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="lsa__hub-wrap">
      <div className="lsa__hub">
        {CHANNELS.map((c, i) => (
          <div
            key={c.key}
            className={`lsa__hub-cell lsa__hub-cell--${c.area}${i === active ? ' lsa__hub-cell--active' : ''}`}
            style={{ '--channel-color': c.hue }}
          >
            {c.label}
          </div>
        ))}
        <div className="lsa__hub-core">
          <span className="lsa__hub-core-mark" aria-hidden="true">LS</span>
          <span className="lsa__hub-core-label">Core</span>
        </div>
      </div>
      <div className="lsa__hub-cap">
        <span>reserve → retrieve → reason → sanitise</span>
        <span>same wallet, same persona, same knowledge</span>
      </div>
    </div>
  );
}

const STEPS = [
  {
    tag: 'channel in',
    name: 'Voice · WhatsApp · Chat · Email',
    where: 'thin transport, no logic',
    metered: false,
    note: null,
  },
  {
    tag: 'auth + wallet',
    name: 'Tenant resolve + reserve',
    where: 'worst-case credits held up front',
    metered: true,
    note: null,
  },
  {
    tag: 'retrieve',
    name: 'Knowledge Engine',
    where: 'hybrid: semantic + lexical, tenant-scoped',
    metered: false,
    note: 'shortcut: a curated FAQ exact-match skips the model entirely - 0 cost.',
  },
  {
    tag: 'reason',
    name: 'Reasoning Engine',
    where: 'fast / standard / pro tiers',
    metered: false,
    note: null,
  },
  {
    tag: 'output',
    name: 'Sanitiser → reply',
    where: 'strips internal identifiers, wallet commit',
    metered: false,
    note: null,
  },
];

const LEDGER = [
  { label: 'channels on one brain', value: '4' },
  { label: 'deployed, live on real customer calls', value: 'TRL-7' },
  { label: 'voice response, sub-second target', value: '<1s' },
  { label: 'external vector service - Postgres + pgvector only', value: '0' },
];

const WALLET_STEPS = [
  {
    key: 'reserve',
    title: 'Reserve',
    flag: null,
    tone: 'neutral',
    body: 'Worst-case credits held before any paid work begins.',
  },
  {
    key: 'commit',
    title: 'Commit',
    flag: 'on success',
    tone: 'allow',
    body: 'True cost charged only after the reply is generated.',
  },
  {
    key: 'release',
    title: 'Release',
    flag: 'on failure',
    tone: 'deny',
    body: 'Held credits refunded automatically if the turn fails.',
  },
  {
    key: 'idempotent',
    title: 'Idempotency-keyed',
    flag: 'always',
    tone: 'floor',
    body: 'Every ledger write carries a key, so a retried request can never double-charge.',
  },
];

const CAPABILITIES = [
  {
    cat: 'Ownership',
    title: 'We run the voice path ourselves',
    body: 'Self-hosted real-time media infrastructure, not a resold third-party engine.',
  },
  {
    cat: 'Grounding',
    title: 'Every answer is tenant-scoped',
    body: "Hybrid retrieval isolated in the query itself - one tenant's documents are unreachable from another's agent.",
  },
  {
    cat: 'Opacity',
    title: 'Internal identifiers never leak',
    body: 'Every generated reply passes a sanitiser before it reaches an end user.',
  },
  {
    cat: 'Memory',
    title: 'Context follows the customer, not the channel',
    body: 'The Memory Vault carries conversation history across voice, WhatsApp, chat and email.',
  },
  {
    cat: 'Emotion-aware',
    title: 'Tone adapts in real time',
    body: 'Sentiment sensing escalates empathy on detected frustration, matches energy on excitement.',
  },
  {
    cat: 'Language',
    title: 'Built Indian-first, not English-first',
    body: 'English, Hindi and Hinglish run live today; Telugu, Marathi, Tamil and Kannada are rolling out on the same core.',
  },
  {
    cat: 'Billing',
    title: 'One wallet, atomically metered',
    body: 'Every channel draws from a single credit wallet; reserve-then-commit means a tenant can never be silently overcharged.',
  },
  {
    cat: 'Architecture',
    title: 'One brain, many doorways',
    body: 'A new channel is a new transport into the same intelligence - never a fork of the logic.',
  },
];

export default function LightSpeakAiReview() {
  return (
    <>
      <section className="dt__section">
        <ChannelHub />
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">01</span> One turn, start to finish</h2>
        <p className="dt__section-note">Every channel enters the same five steps. Nothing is skipped, and nothing is forked per channel.</p>
        <ol className="lsa__timeline">
          {STEPS.map((s) => (
            <li key={s.tag} className={`lsa__step${s.metered ? ' lsa__step--metered' : ''}`}>
              <span className="lsa__step-tag">{s.tag}</span>
              <span className="lsa__step-name">{s.name}</span>
              <span className="lsa__step-where">{s.where}</span>
              {s.note && <p className="lsa__step-note">{s.note}</p>}
            </li>
          ))}
        </ol>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">02</span> Verified, not vibes</h2>
        <p className="dt__section-note">Numbers describing what&apos;s already live, not a roadmap projection.</p>
        <dl className="lsa__ledger">
          {LEDGER.map((row) => (
            <div key={row.label} className="lsa__ledger-row">
              <dt className="lsa__ledger-label">{row.label}</dt>
              <dd className="lsa__ledger-value">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">03</span> The credit wallet</h2>
        <p className="dt__section-note">A model that could run up an unbounded bill needs billing that happens before the work, not after.</p>
        <div className="lsa__stepper">
          {WALLET_STEPS.map((s) => (
            <div key={s.key} className={`lsa__stepper-step lsa__stepper-step--${s.tone}`}>
              <span className="lsa__stepper-dot" aria-hidden="true" />
              <h3 className="lsa__stepper-title">{s.title}</h3>
              {s.flag && <span className="lsa__stepper-flag">{s.flag}</span>}
              <p className="lsa__stepper-body">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">04</span> Why it holds up</h2>
        <p className="dt__section-note">The design choices a reviewer would actually probe.</p>
        <div className="lsa__spec-list">
          {CAPABILITIES.map((c, i) => (
            <div key={c.title} className="lsa__spec-item">
              <span className="lsa__spec-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="lsa__spec-body">
                <span className="lsa__spec-cat">{c.cat}</span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

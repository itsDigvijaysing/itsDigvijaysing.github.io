const STATS = [
  { label: 'STR', value: 65 },
  { label: 'INT', value: 80 },
  { label: 'WIS', value: 55 },
  { label: 'DEX', value: 70 },
  { label: 'CHA', value: 45 },
  { label: 'VIT', value: 90 },
];

const CENTER = 100;
const MAX_R = 68;

const angleFor = (i) => (Math.PI / 180) * (-90 + i * 60);

const pointFor = (i, radiusFraction) => {
  const angle = angleFor(i);
  const r = MAX_R * radiusFraction;
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)];
};

const labelAnchor = (i) => {
  const cos = Math.cos(angleFor(i));
  if (cos > 0.3) return 'start';
  if (cos < -0.3) return 'end';
  return 'middle';
};

const labelDy = (i) => {
  const sin = Math.sin(angleFor(i));
  if (sin < -0.3) return -6;
  if (sin > 0.3) return 14;
  return 4;
};

const ringPoints = (fraction) => STATS.map((_, i) => pointFor(i, fraction).join(',')).join(' ');
const valuePoints = STATS.map((s, i) => pointFor(i, s.value / 100).join(',')).join(' ');

function HexRadar() {
  return (
    <div className="stu__hero">
      <svg
        className="stu__radar"
        viewBox="0 0 200 200"
        role="img"
        aria-label="Hexagon stat radar: sample character across six stats"
      >
        <polygon className="stu__radar-ring" points={ringPoints(1)} />
        <polygon className="stu__radar-ring" points={ringPoints(0.66)} />
        <polygon className="stu__radar-ring" points={ringPoints(0.33)} />
        {STATS.map((s, i) => {
          const [x, y] = pointFor(i, 1);
          return <line key={s.label} className="stu__radar-axis" x1={CENTER} y1={CENTER} x2={x} y2={y} />;
        })}
        <polygon className="stu__radar-value" points={valuePoints} />
        {STATS.map((s, i) => {
          const [x, y] = pointFor(i, s.value / 100);
          return <circle key={s.label} className="stu__radar-dot" cx={x} cy={y} r={3} />;
        })}
        {STATS.map((s, i) => {
          const [x, y] = pointFor(i, 1.24);
          return (
            <text
              key={s.label}
              className="stu__radar-label"
              x={x}
              y={y}
              dy={labelDy(i)}
              textAnchor={labelAnchor(i)}
            >
              {s.label}
            </text>
          );
        })}
      </svg>
      <div className="stu__hero-info">
        <span className="stu__rank-badge">B</span>
        <span className="stu__points">1,240 pts</span>
        <p className="stu__hero-cap">Sample character sheet - six stats, one glance.</p>
      </div>
    </div>
  );
}

const PRIORITIES = [
  { key: 'P1', pts: 4 },
  { key: 'P2', pts: 3 },
  { key: 'P3', pts: 2 },
  { key: 'P4', pts: 1 },
];

const RANKS = ['E', 'D', 'C', 'B', 'A', 'S'];
const CURRENT_RANK_INDEX = 3;

const PRIVACY = [
  {
    title: 'Offline-first core',
    body: 'Stats, tasks, rewards, achievements and decay all work with zero network calls.',
  },
  { title: 'No accounts', body: 'No registration, no cloud sync.' },
  { title: 'No ads', body: 'Completely ad-free.' },
  { title: 'No analytics', body: 'Zero tracking, telemetry, or crash reporting.' },
  {
    title: 'Local data only',
    body: 'Room database on-device; Todoist tokens live in AES-256-GCM encrypted storage.',
  },
  {
    title: 'Opt-in only',
    body: 'Todoist sync and the AI Coach both require adding your own token - neither is on by default.',
  },
];

export default function StatUpReview() {
  return (
    <>
      <section className="dt__section">
        <HexRadar />
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">01</span> Priority → points</h2>
        <p className="dt__section-note">Every task carries a priority; priority sets the payout.</p>
        <div className="stu__bars">
          {PRIORITIES.map((p) => (
            <div key={p.key} className="stu__bar-col">
              <span className="stu__bar-value">{p.pts}</span>
              <span className="stu__bar-track">
                <span className="stu__bar" style={{ '--h': `${p.pts * 25}%` }} />
              </span>
              <span className="stu__bar-label">{p.key}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">02</span> The rank ladder</h2>
        <p className="dt__section-note">Five streak days earn a ⭐ and a rank-up; a broken streak can rank you back down.</p>
        <div className="stu__ladder">
          <span
            className="stu__ladder-fill"
            style={{ '--pct': `${(CURRENT_RANK_INDEX / (RANKS.length - 1)) * 100}%` }}
          />
          {RANKS.map((r, i) => (
            <span
              key={r}
              className={`stu__rank${i === CURRENT_RANK_INDEX ? ' stu__rank--current' : ''}${i < CURRENT_RANK_INDEX ? ' stu__rank--passed' : ''}`}
            >
              {r}
            </span>
          ))}
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">03</span> Decay vs. shield</h2>
        <p className="dt__section-note">A midnight check on every idle day - one of two outcomes, never both.</p>
        <div className="stu__decay">
          <div className="stu__decay-source">Idle day, midnight check</div>
          <div className="stu__decay-branches">
            <div className="stu__decay-branch">
              <span className="stu__decay-tag stu__decay-tag--bad">no shield</span>
              <p>&minus;1 point on every stat, &minus;1 star line.</p>
            </div>
            <div className="stu__decay-branch">
              <span className="stu__decay-tag stu__decay-tag--good">shield active</span>
              <p>One 🛡️ consumed instead - stats, streak and star lines untouched (max 3 held, 30 pts each).</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">04</span> Privacy label</h2>
        <p className="dt__section-note">Read the way an app-store privacy card would read it.</p>
        <ul className="stu__privacy">
          {PRIVACY.map((p) => (
            <li key={p.title} className="stu__privacy-item">
              <span className="stu__privacy-mark" aria-hidden="true">
                ✓
              </span>
              <span>
                <strong>{p.title}</strong>
                <p>{p.body}</p>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

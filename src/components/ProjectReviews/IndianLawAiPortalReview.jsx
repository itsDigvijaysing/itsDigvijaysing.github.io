import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../utils/motion.js';

const CITATIONS = [
  { n: 1, section: 'Section 379', doc: 'Indian Penal Code, 1860', page: 'p. 95', era: 'pre-2024' },
  { n: 2, section: 'Section 303', doc: 'Bharatiya Nyaya Sanhita, 2023', page: null, era: 'current' },
];

function AnswerCard() {
  const [active, setActive] = useState(1);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const id = window.setInterval(() => setActive((n) => (n === 1 ? 2 : 1)), 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="ilp__answer">
      <div className="ilp__answer-head">
        <span className="ilp__answer-badge">Criminal</span>
        <span className="ilp__answer-confidence">confidence 0.62</span>
      </div>
      <p className="ilp__answer-q">&ldquo;What is the punishment for theft under IPC?&rdquo;</p>
      <p className="ilp__answer-a">The punishment for theft under the current law is imprisonment of either description for a term which may extend to three years, or with fine, or with both{' '}<sup className={`ilp__mark${active === 1 ? ' ilp__mark--active' : ''}`}>[1]</sup>. The Indian Penal Code carried the same offence under a different section{' '}<sup className={`ilp__mark${active === 2 ? ' ilp__mark--active' : ''}`}>[2]</sup>.</p>
      <ul className="ilp__cite-list">
        {CITATIONS.map((c) => (
          <li key={c.n} className={`ilp__cite${active === c.n ? ' ilp__cite--active' : ''}`}>
            <span className="ilp__cite-n">[{c.n}]</span>
            <span className="ilp__cite-body">
              <strong>{c.section}</strong>
              {' · '}
              {c.doc}
              {c.page && ` · ${c.page}`}
              {' · '}
              <em>{c.era}</em>
            </span>
          </li>
        ))}
      </ul>
      <p className="ilp__answer-note">Hybrid retrieval - FAISS + BM25 + exact section lookup, fused and reranked - grounds every answer before the model sees the question.</p>
    </div>
  );
}

const DOCKET = [
  { q: 'What is the punishment for theft under IPC?', cat: 'Criminal' },
  { q: 'What is the punishment for cheque bounce under Section 138?', cat: 'Commercial' },
  { q: 'What are the grounds for divorce under the Hindu Marriage Act?', cat: 'Family' },
  { q: 'Explain the right to life under Article 21 of the Constitution', cat: 'Constitutional' },
  { q: 'How is cybercrime handled under the IT Act?', cat: 'Digital' },
];

const ERA_PAIRS = [
  { legacy: 'Indian Penal Code, 1860', current: 'Bharatiya Nyaya Sanhita, 2023' },
  { legacy: 'Code of Criminal Procedure, 1973', current: 'Bharatiya Nagarik Suraksha Sanhita, 2023' },
  { legacy: 'Indian Evidence Act, 1872', current: 'Bharatiya Sakshya Adhiniyam, 2023' },
];

const CONFIDENCE_STOPS = [
  { pct: 15, label: 'grounded refusal', value: '0.15', align: 'start' },
  { pct: 35, label: 'uncited answer', value: '0.35', align: 'center' },
  { pct: 95, label: 'cited answer, typical ceiling', value: '0.95', align: 'end' },
];

const STAMPS = [
  { num: '25', label: 'statute PDFs', rot: -3 },
  { num: '9,487', label: 'indexed chunks', rot: 2 },
  { num: '10', label: 'domain agents', rot: -2 },
  { num: '31', label: 'regression probes', rot: 3 },
  { num: '0', label: 'invented citations reach a user', rot: -1 },
];

export default function IndianLawAiPortalReview() {
  return (
    <>
      <section className="dt__section">
        <AnswerCard />
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">01</span> The docket</h2>
        <p className="dt__section-note">A query classifier detects the legal area before retrieval ever runs.</p>
        <table className="ilp__docket">
          <tbody>
            {DOCKET.map((row, i) => (
              <tr key={row.q} className={i % 2 === 1 ? 'ilp__docket-row--alt' : undefined}>
                <td className="ilp__docket-q">&ldquo;{row.q}&rdquo;</td>
                <td className="ilp__docket-cat">{row.cat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">02</span> Legacy vs current law</h2>
        <p className="dt__section-note">India&apos;s criminal codes were recodified on 1 July 2024. Criminal answers cite both provisions, with the date each applies.</p>
        <div className="ilp__era">
          <div className="ilp__era-heads">
            <span>legacy · pre-2024</span>
            <span>current · post-2024</span>
          </div>
          {ERA_PAIRS.map((p) => (
            <div key={p.legacy} className="ilp__era-row">
              <span className="ilp__era-legacy">{p.legacy}</span>
              <span className="ilp__era-arrow" aria-hidden="true">→</span>
              <span className="ilp__era-current">{p.current}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">03</span> Grounded or refused</h2>
        <p className="dt__section-note">Confidence is citation-driven, not a model guess - and it never reaches 1.0.</p>
        <div className="ilp__gauge">
          <div className="ilp__gauge-track">
            {CONFIDENCE_STOPS.map((s) => (
              <span key={s.value} className="ilp__gauge-stop" style={{ left: `${s.pct}%` }}>
                <span className="ilp__gauge-dot" />
              </span>
            ))}
          </div>
          <div className="ilp__gauge-labels">
            {CONFIDENCE_STOPS.map((s) => (
              <div
                key={s.value}
                className={`ilp__gauge-label ilp__gauge-label--${s.align}`}
                style={{ left: `${s.pct}%` }}
              >
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">04</span> On the record</h2>
        <p className="dt__section-note">Numbers from the actual ingested corpus and test suite, not estimates.</p>
        <div className="ilp__stamps">
          {STAMPS.map((s) => (
            <div key={s.label} className="ilp__stamp" style={{ '--rot': `${s.rot}deg` }}>
              <span className="ilp__stamp-num">{s.num}</span>
              <span className="ilp__stamp-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../utils/motion.js';

const EMOTIONS = [
  'neutral', 'calm', 'happy', 'sad', 'angry', 'fearful', 'disgust', 'surprised',
];

function CorpusHero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const id = window.setInterval(() => setActive((n) => (n + 1) % EMOTIONS.length), 1400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="emo__hero">
      <div className="emo__wheel">
        {EMOTIONS.map((e, i) => (
          <span key={e} className={`emo__chip${i === active ? ' emo__chip--active' : ''}`}>{e}</span>
        ))}
      </div>
      <dl className="emo__corpus">
        <div>
          <dt>clips</dt>
          <dd>1,440</dd>
        </div>
        <div>
          <dt>actors</dt>
          <dd>24</dd>
        </div>
        <div>
          <dt>balance</dt>
          <dd>12 M · 12 F</dd>
        </div>
        <div>
          <dt>classes</dt>
          <dd>8</dd>
        </div>
      </dl>
      <p className="emo__hero-cap">RAVDESS: the same sentences, acted across eight emotions - so the label is carried by delivery, not by wording.</p>
    </div>
  );
}

const STREAMS = [
  {
    key: 'audio',
    tag: 'what it sounds like',
    steps: ['Waveform', 'Log-Mel spectrogram', '2D CNN'],
    note: 'Treats the spectrogram as an image. Picks up pitch, energy and pace - the things tone lives in.',
  },
  {
    key: 'text',
    tag: 'what was said',
    steps: ['Transcript (simulated / Whisper)', 'Tokenize', 'Bi-LSTM · or DistilBERT'],
    note: 'Two interchangeable text encoders over the same transcripts: one trained from scratch, one fine-tuned.',
  },
];

const FUSION = [
  {
    key: 'early',
    name: 'Early fusion',
    when: 'before the decision',
    body: 'Frozen features from both encoders are concatenated and a single fully-connected head learns over the joined vector.',
    trait: 'One classifier sees both modalities at once, so it can learn interactions between them.',
  },
  {
    key: 'late',
    name: 'Late fusion',
    when: 'after the decision',
    body: 'Each unimodal model predicts independently and their softmax probabilities are averaged.',
    trait: 'Simpler and more robust - either model can be swapped or retrained without touching the other.',
  },
];

const RESULTS = [
  { label: 'Audio CNN alone', pct: 66, kind: 'uni' },
  { label: 'Fusion (early / late)', pct: 95, kind: 'fused' },
];

const CHECKPOINTS = ['AudioCNN_best.pth', 'TextRNN_best.pth', 'EarlyFusion_RNN_best.pth', 'EarlyFusion_BERT_best.pth'];

const CAPABILITIES = [
  {
    cat: 'The premise',
    title: 'Tone carries what the words do not',
    body: 'The same sentence is angry or calm depending entirely on delivery. A text-only classifier is blind to that, and an audio-only one misses the content.',
  },
  {
    cat: 'Fair comparison',
    title: 'Both fusion modes, same corpus',
    body: 'Early and late fusion are evaluated against the identical split, so the comparison is about the strategy rather than the data.',
  },
  {
    cat: 'Two text encoders',
    title: 'Trained-from-scratch against fine-tuned',
    body: 'A bidirectional LSTM and a fine-tuned DistilBERT run over the same transcripts, isolating how much a pretrained language model is worth here.',
  },
  {
    cat: 'Reproducible',
    title: 'Four checkpoints committed',
    body: 'Each configuration keeps its best weights in the repo, so the reported run can be reloaded rather than taken on trust.',
  },
];

export default function EmotionRecognitionReview() {
  return (
    <>
      <section className="dt__section">
        <CorpusHero />
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">01</span> Two streams</h2>
        <p className="dt__section-note">Each clip is read twice - once as sound, once as language - by encoders that share nothing but the label they are aiming at.</p>
        <div className="emo__streams">
          {STREAMS.map((s) => (
            <div key={s.key} className={`emo__stream emo__stream--${s.key}`}>
              <span className="emo__stream-tag">{s.tag}</span>
              <ol className="emo__stream-steps">
                {s.steps.map((st) => (
                  <li key={st}>{st}</li>
                ))}
              </ol>
              <p className="emo__stream-note">{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">02</span> Where the streams meet</h2>
        <p className="dt__section-note">The one real design question in a multimodal model: join the evidence, or join the verdicts.</p>
        <div className="emo__fusion">
          {FUSION.map((f) => (
            <div key={f.key} className={`emo__fusion-card emo__fusion-card--${f.key}`}>
              <div className="emo__fusion-head">
                <h3>{f.name}</h3>
                <span className="emo__fusion-when">{f.when}</span>
              </div>
              <p>{f.body}</p>
              <p className="emo__fusion-trait">{f.trait}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">03</span> What fusion buys</h2>
        <p className="dt__section-note">Test accuracy on the committed RAVDESS run: the audio model on its own, against the fused configurations.</p>
        <div className="emo__results">
          {RESULTS.map((r) => (
            <div key={r.label} className={`emo__result emo__result--${r.kind}`}>
              <div className="emo__result-head">
                <span className="emo__result-label">{r.label}</span>
                <span className="emo__result-pct">~{r.pct}%</span>
              </div>
              <span className="emo__result-track">
                <span className="emo__result-bar" style={{ '--w': `${r.pct}%` }} />
              </span>
            </div>
          ))}
        </div>
        <div className="emo__checkpoints">
          {CHECKPOINTS.map((c) => (
            <code key={c}>{c}</code>
          ))}
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">04</span> Why it holds up</h2>
        <p className="dt__section-note">The design choices a reviewer would actually probe.</p>
        <div className="emo__grid">
          {CAPABILITIES.map((c) => (
            <div key={c.title} className="emo__card">
              <div className="emo__card-cat">{c.cat}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

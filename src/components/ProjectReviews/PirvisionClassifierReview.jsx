const CLASSES = [
  { label: 'Vacancy', n: 6247, tone: 'a' },
  { label: 'Stationary', n: 833, tone: 'b' },
  { label: 'Other activity', n: 571, tone: 'c' },
];

const TOTAL = CLASSES.reduce((sum, c) => sum + c.n, 0);

function ImbalanceHero() {
  return (
    <div className="pir__hero">
      <div
        className="pir__imbalance"
        role="img"
        aria-label={`Class distribution across ${TOTAL} samples: Vacancy 6247, Stationary 833, Other activity 571`}
      >
        {CLASSES.map((c) => (
          <div
            key={c.label}
            className={`pir__imbalance-seg pir__imbalance-seg--${c.tone}`}
            style={{ '--w': `${(c.n / TOTAL) * 100}%` }}
          >
            <span className="pir__imbalance-n">{c.n.toLocaleString()}</span>
            <span className="pir__imbalance-label">{c.label}</span>
            <span className="pir__imbalance-pct">{((c.n / TOTAL) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
      <p className="pir__hero-cap">{TOTAL.toLocaleString()} samples, and four out of five of them are an empty room. The whole design follows from this one shape.</p>
    </div>
  );
}

const FEATURES = [
  'PIR_Mean', 'PIR_Median', 'PIR_Std', 'PIR_Range', 'PIR_IQR', 'PIR_Trend',
  'Temperature_RollingMean', 'pir_outlier_count', 'any_pir_outlier',
  'Hour_Sin', 'Hour_Cos', 'DayOfWeek',
];

const BRANCHES = [
  {
    key: 'conv',
    tag: 'sequence branch',
    layers: ['Conv1d · 16 filters · k=3', 'Conv1d · 32 filters · k=3', 'BatchNorm · ReLU · MaxPool', 'LSTM · 2 layers · hidden 64 · dropout 0.4'],
    note: 'Reads the 55 readings as a time series - shape over the window.',
  },
  {
    key: 'mlp',
    tag: 'tabular branch',
    layers: ['Fully connected MLP', 'Dropout 0.5', 'Fully connected'],
    note: 'Reads the engineered summary features - level, spread, time of day.',
  },
];

const IMBALANCE_MOVES = [
  {
    title: 'Class-weighted loss',
    body: 'Balanced class weights, so the 571 "other activity" samples are not drowned out by the 6,247 empty-room ones.',
  },
  {
    title: 'Stratified splitting',
    body: 'An 80/20 stratified split, with stratified 5-fold cross-validation on the training set, so every fold keeps the same class mix.',
  },
  {
    title: 'RobustScaler, not StandardScaler',
    body: 'Scaling on medians and quartiles rather than mean and variance, because PIR spikes would otherwise drag the scale.',
  },
  {
    title: 'Outlier capping, not dropping',
    body: 'IQR capping keeps the row and records that it was an outlier as its own feature, rather than discarding rare-class data.',
  },
];

const CAPABILITIES = [
  {
    cat: 'Problem shape',
    title: 'A binary sensor asked a three-way question',
    body: 'A PIR pin gives motion or no motion. Separating "empty" from "someone sitting still" needs the pattern across the window, not any single reading.',
  },
  {
    cat: 'Why two branches',
    title: 'Sequence and summary answer different halves',
    body: 'The convolutional path sees the shape of the window; the tabular path sees level, spread and time of day. Neither alone separates stationary from vacant well.',
  },
  {
    cat: 'The gate',
    title: 'The mix is learned, not fixed',
    body: 'A learnable Softmax gate weighs the two branches per sample instead of concatenating them, so the model can lean on whichever branch is informative.',
  },
  {
    cat: 'Evaluation',
    title: 'Overall accuracy is the wrong headline',
    body: 'With four in five samples in one class and a synthetic set the model could memorise, the number worth reading is behaviour on the two minority classes, not the aggregate.',
  },
  {
    cat: 'Reproducibility',
    title: 'The fitted scaler ships with the weights',
    body: 'Best-fold weights are saved to team_35.pth with the fitted RobustScaler alongside, so inference reproduces training rather than re-deriving the scale.',
  },
  {
    cat: 'Deployment',
    title: 'Built for cheap hardware',
    body: 'The point is occupancy-driven building automation on sensors that already exist - no camera, no microphone, no privacy trade.',
  },
];

export default function PirvisionClassifierReview() {
  return (
    <>
      <section className="dt__section">
        <ImbalanceHero />
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">01</span> 55 readings, 12 derived features</h2>
        <p className="dt__section-note">The raw window is PIR_1 through PIR_55 plus temperature. These are the summaries derived from it before anything is trained.</p>
        <div className="pir__features">
          {FEATURES.map((f) => (
            <span key={f} className="pir__feature">{f}</span>
          ))}
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">02</span> Two branches, one learned gate</h2>
        <p className="dt__section-note">The two paths run in parallel over the same scaled input and are merged by a gate that learns how much to trust each one.</p>
        <div className="pir__flow">
          <div className="pir__flow-in">
            <span className="pir__flow-in-name">69 scaled features</span>
            <span className="pir__flow-in-note">55 raw readings · 12 derived · temporal</span>
          </div>

          <span className="pir__flow-split" aria-hidden="true" />

          <div className="pir__flow-branches">
            {BRANCHES.map((b) => (
              <div key={b.key} className="pir__branch">
                <span className="pir__branch-tag">{b.tag}</span>
                <ol className="pir__branch-layers">
                  {b.layers.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ol>
                <p className="pir__branch-note">{b.note}</p>
              </div>
            ))}
          </div>

          <span className="pir__flow-merge" aria-hidden="true" />

          <div className="pir__flow-gate">
            <span className="pir__flow-gate-name">Learnable Softmax gate</span>
            <span className="pir__flow-gate-note">
              weighs the two branches per sample, rather than concatenating them
            </span>
          </div>

          <span className="pir__flow-down" aria-hidden="true" />

          <div className="pir__flow-out">
            {CLASSES.map((c) => (
              <span key={c.label} className={`pir__flow-class pir__flow-class--${c.tone}`}>
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">03</span> Why 99% was the problem</h2>
        <p className="dt__section-note">Development ran against synthetically generated data, and that is where the real lesson came from.</p>
        <div className="pir__callout">
          <span className="pir__callout-tag">the finding</span>
          <p>A single epoch was already scoring above 99%. That is not a result - it is a model memorising the generator that produced its data. Add the fact that predicting &ldquo;empty&rdquo; every time scores 82% on its own, and headline accuracy stopped being a signal worth optimising at all.</p>
        </div>
        <p className="pir__moves-intro">So the work became robustness instead. Several combinations of techniques were trained and compared; the configuration below is the one that resisted overfitting on synthetic data <em>and</em> gave the best overall performance. None of these four is load-bearing alone - the combination is the result.</p>
        <ul className="pir__moves">
          {IMBALANCE_MOVES.map((m) => (
            <li key={m.title} className="pir__move">
              <h3>{m.title}</h3>
              <p>{m.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">04</span> Why it holds up</h2>
        <p className="dt__section-note">The design choices a reviewer would actually probe.</p>
        <div className="pir__grid">
          {CAPABILITIES.map((c) => (
            <div key={c.title} className="pir__card">
              <div className="pir__card-cat">{c.cat}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

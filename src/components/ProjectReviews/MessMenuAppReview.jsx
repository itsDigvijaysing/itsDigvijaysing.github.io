import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../utils/motion.js';

const PATHS = [
  {
    key: 'customer',
    role: 'Customer',
    intent: 'browse without an account',
    screens: ['Listing', 'Details', 'View Image'],
  },
  {
    key: 'owner',
    role: 'Mess Owner',
    intent: 'sign in and keep the listing current',
    screens: ['Login / Create Account', 'Owner Account', 'Update Details', 'Update Image'],
  },
];

function RoleFork() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const id = window.setInterval(() => setActive((n) => (n + 1) % PATHS.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="msm__fork">
      <div className="msm__fork-root">
        <span className="msm__fork-root-label">Welcome screen</span>
        <span className="msm__fork-root-note">one entry point, two apps behind it</span>
      </div>
      <div className="msm__fork-branches">
        {PATHS.map((p, i) => (
          <div
            key={p.key}
            className={`msm__fork-branch${i === active ? ' msm__fork-branch--active' : ''}`}
          >
            <span className="msm__fork-role">{p.role}</span>
            <span className="msm__fork-intent">{p.intent}</span>
            <ol className="msm__fork-screens">
              {p.screens.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}

const LISTING_FIELDS = [
  { field: 'Mess name + logo', why: 'What a student scans the listing screen for.', editable: true },
  { field: 'Thali price', why: 'The single number that decides most of these choices.', editable: true },
  { field: 'Menu photograph', why: 'Faster to photograph than to type, so it actually gets updated.', editable: true },
  { field: 'Mess pictures', why: 'Somewhere to see the place before walking there.', editable: true },
  { field: 'Parcel available', why: 'Confirms takeaway without a phone call.', editable: true },
  { field: 'Contact details', why: 'The fallback the app is trying to replace.', editable: false },
];

const ENDPOINTS = [
  { verb: 'POST', path: '/messdetails', what: 'Owner signs up and the mess record is created' },
  { verb: 'POST', path: '/auth', what: 'Owner logs in against an encrypted password' },
  { verb: 'PATCH', path: '/:id', what: 'Thali price, mess name and password are edited in place' },
  { verb: 'PATCH', path: '/upmessimages/:id', what: 'Menu and profile images upload as base64' },
];

const STACK = [
  { layer: 'App', what: 'React Native + Expo', note: 'One codebase, both platforms' },
  { layer: 'Navigation', what: 'React Navigation', note: 'Role-based stack, split at Welcome' },
  { layer: 'Transport', what: 'apisauce over REST', note: 'Base URL from app.json extra.apiBaseUrl' },
  { layer: 'API', what: 'Node + Express on Azure App Service', note: 'Hosted separately from the app' },
  { layer: 'Records', what: 'MongoDB', note: 'Mess details, pricing, credentials' },
  { layer: 'Media', what: 'Azure Blob Storage', note: 'Menu photographs and mess images' },
];

const CAPABILITIES = [
  {
    cat: 'The problem',
    title: 'The menu lived in the owner’s head',
    body: 'Finding an up-to-date tiffin menu meant texting the owner. The app exists so the person who knows the menu can publish it in under a minute.',
  },
  {
    cat: 'Asymmetric by design',
    title: 'Only one side needs an account',
    body: 'Customers browse anonymously; owners authenticate. Splitting the navigation stack at the first screen keeps the customer path free of any login wall.',
  },
  {
    cat: 'Scope',
    title: 'Around 20 custom components',
    body: 'Built rather than pulled from a UI kit - screens, cards, form fields and image pickers, which is where most of the work in a first mobile app actually goes.',
  },
  {
    cat: 'Shipped',
    title: 'It left the emulator',
    body: 'Released as a signed Android build through Gradle and distributed publicly, with a beta programme - the part student projects usually skip.',
  },
  {
    cat: 'Context',
    title: 'Built during the Microsoft FRT internship',
    body: 'Which is why the backend is Azure end to end: App Service, MongoDB and Blob Storage rather than a self-managed server.',
  },
  {
    cat: 'Honest limits',
    title: 'It is an early project',
    body: 'Base64 image upload and password handling would both be done differently now. Kept as it shipped rather than quietly modernised.',
  },
];

export default function MessMenuAppReview() {
  return (
    <>
      <section className="dt__section">
        <RoleFork />
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">01</span> What a listing holds</h2>
        <p className="dt__section-note">The whole app exists to keep these six fields current. Everything else - the screens, the navigation, the API - is scaffolding around them.</p>
        <div className="msm__listing">
          {LISTING_FIELDS.map((f) => (
            <div key={f.field} className="msm__field">
              <span className="msm__field-name">{f.field}</span>
              <span className="msm__field-why">{f.why}</span>
              <span className={`msm__field-owner msm__field-owner--${f.editable ? 'yes' : 'no'}`}>{f.editable ? 'owner-editable' : 'set at signup'}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">02</span> Everything an owner can do</h2>
        <p className="dt__section-note">The entire owner surface is four calls. Customers never write, so there is nothing else.</p>
        <table className="msm__api">
          <tbody>
            {ENDPOINTS.map((e) => (
              <tr key={e.path}>
                <td className="msm__api-verb">
                  <span className={`msm__verb msm__verb--${e.verb.toLowerCase()}`}>{e.verb}</span>
                </td>
                <td className="msm__api-path">
                  <code>{e.path}</code>
                </td>
                <td className="msm__api-what">{e.what}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">03</span> The stack, top to bottom</h2>
        <p className="dt__section-note">Six layers, each doing one thing. The API is deployed independently of the app.</p>
        <dl className="msm__stack">
          {STACK.map((s) => (
            <div key={s.layer} className="msm__stack-row">
              <dt className="msm__stack-layer">{s.layer}</dt>
              <dd className="msm__stack-what">
                <strong>{s.what}</strong>
                <span>{s.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="dt__section">
        <h2 className="dt__h2"><span className="dt__h2-num">04</span> Why it holds up</h2>
        <p className="dt__section-note">The design choices a reviewer would actually probe.</p>
        <div className="msm__grid">
          {CAPABILITIES.map((c) => (
            <div key={c.title} className="msm__card">
              <div className="msm__card-cat">{c.cat}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

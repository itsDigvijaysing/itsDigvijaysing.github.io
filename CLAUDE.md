# CLAUDE.md — itsDigvijaysing.github.io Portfolio Redesign

Context file for AI assistants working on this repo. Read this before making changes.

---

## What this project is

Personal portfolio site for **Digvijaysing Bhatesing Rajput**, hosted as a **GitHub Pages user site** at:

- **Live:** https://itsdigvijaysing.github.io/
- **Repo:** `itsDigvijaysing/itsDigvijaysing.github.io` (branch `main`, no build step required)
- **Related site:** https://magitech.site/ — a separate React/Vite project (`~/Documents/Projects/MagiTech-Site`) that is the more polished, modern portfolio/showcase

> **⚠ ARCHITECTURE UPDATE (Jul 6, 2026):** This repo is **no longer static HTML/CSS/JS**. It was migrated to a **React 18 + Vite** multi-page SPA (React Router) that deploys to GitHub Pages via **GitHub Actions** (`.github/workflows/deploy.yml` → `vite build` → publish `dist/`, with `dist/404.html` = `index.html` for client-side deep links). The live source lives under `src/`; the old static `index.html`(root is now the Vite entry)/`about.html`/`projects/*.html`/`assets/js|css/*` files are **dead leftovers**. The "static multi-page" plan below is historical — read it for **intent and content**, not current structure. To go live: commit `src/ public/ package.json vite.config.js .github/`, then set the repo's Pages source to **"GitHub Actions"**.

### Actual architecture (current)

```
index.html                 # Vite entry (loads /src/main.jsx) + SEO <head> (OG/Twitter/JSON-LD)
src/
├── main.jsx               # React root; latin-only @fontsource imports
├── App.jsx                # Routes + Navbar/Footer/ScrollToTop + skip link
├── pages/                 # Home, About, Projects, ProjectDetail, NotFound
├── components/            # Navbar, HeroBot, ParticleWeb, Reveal, CountUp, Magnetic, RotatingText, ProjectCard, SocialIcons, GridBg, Footer, ScrollToTop
├── hooks/usePageMeta.js   # per-route title/description/canonical/OG (no react-helmet)
├── data/projects.js       # single source of truth (16 projects) + formatMonth()
└── styles/                # design-system.css (tokens/primitives) + components.css
public/assets/             # runtime img (self.jpg, hero_bot.png/webm, og-cover.png, logo), resume PDF; robots.txt; sitemap.xml
.github/workflows/deploy.yml
```

**Design direction (decided Jul 6, 2026):** keep the **light** theme, raise craft to MagiTech's level (editorial mono section indices `01 —`, Instrument Serif italic accents, timeline rail, project cover banners). Do **not** convert to dark.

### Hero mascot (`src/components/HeroBot.jsx`)

- The mascot is a **transparent greeting video** — `public/assets/img/hero_greeting.webm` (VP9 `yuva420p` alpha, ~336 KB, 520×882). No poster, no dark aura box; just a **minimal soft blue glow** (`.hero__bot-aura`) behind it and a vertical **"door" accent line** (`.hero__bot-line`) that falls once the video is loaded.
- **Playback:** plays the full greeting **once on load, then replays every 30s** (NOT a continuous loop), and re-fires on every Home visit (the page remounts on route change). Gated on `prefers-reduced-motion`.
- **Transparency was a ONE-TIME conversion, not a runtime effect.** The source (`assets/img/hero_bot_greet_bg.mp4`) is a **green screen**. It was chroma-keyed to alpha once. To redo/replace: use the standard one-liner, don't hand-roll per-frame processing —
  ```bash
  ffmpeg -i assets/img/hero_bot_greet_bg.mp4 \
    -vf "chromakey=0x25b936:0.10:0.02,despill=type=green,crop=..." \
    -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 -b:v 0 -crf 34 -an \
    public/assets/img/hero_greeting.webm
  ```
  Runtime cost is just normal (GPU) video decode of a small clip — no ongoing computation.
- ⚠ **Do NOT debug video/animation via headless screenshots** — headless Chromium can't advance video playback under its virtual clock and mis-renders the box, which looks like "clipping"/"stuck frames" that don't exist in a real browser. **Verify hero motion by asking the user to check their browser**, or via a real (non-headless) session.

---

## What we want to do

Modernize this GitHub Pages portfolio so it:

1. **Looks as polished as MagiTech** (dark theme, intentional typography, gradient accents, scroll animations) — but stays static, no React/Vite
2. **Uses up-to-date resume content** from the latest PDF at `~/Downloads/Resumes/RESUME.pdf`
3. **Becomes multi-page** instead of one long scrolling CV dump:
   - `index.html` — hero, stats strip, featured projects
   - `about.html` — experience, education, skills, certifications, achievements
   - `projects/index.html` — all projects with tag filters
   - `projects/view.html?slug=<slug>` — individual project detail pages (client-side JSON lookup)
4. **Pulls project data from a single source** — `assets/data/projects.json` — aligned with MagiTech's `src/data/projects.js` where possible
5. **Fixes all known content/stale-data bugs** from the old single-page site
6. **Removes dead weight** from the old iPortfolio template (unused vendor JS, Font Awesome Pro CDN, 1.6 MB unoptimized images)

---

## What we know (analysis summary)

### Old site (before redesign work started)

- Single `index.html` (~550 lines) based on **BootstrapMade iPortfolio v3.3.0** template
- Fixed 300px blue sidebar, particles.js hero, Bootstrap icon-box project grid
- All content inline in HTML — resume, experience, certs, achievements, 14+ projects on one page
- Vendored Bootstrap/AOS/Swiper/Isotope/GLightbox/Typed.js/etc. under `assets/vendor/` (~11 MB)
- Font Awesome **Pro** CDN (`pro.fontawesome.com`) — license risk + single point of failure
- Empty `<meta description>` and no Open Graph tags

### Why MagiTech feels better

| Area | Old GitHub Pages site | MagiTech.site |
|------|----------------------|---------------|
| Design | Generic 2019 Bootstrap template | Custom "Late-Night Lab" design system |
| Hero | Particles + ALL-CAPS name + Typed.js | Kinetic typography, gradient slab, editorial layout |
| Motion | AOS fade-ins (common) | Framer Motion, SplitText, magnetic CTAs, glass cursor |
| Projects | Flat icon boxes, no detail pages | Project covers, detail pages, Mermaid diagrams |
| Content | Full CV pasted into HTML | Curated manifesto + featured work |
| SEO | Empty meta | Full OG/Twitter, theme-color, canonical |

MagiTech is the **design reference**. This repo should borrow its visual language and content curation, not copy the React stack.

### Content source of truth

**Latest resume:** `~/Downloads/Resumes/RESUME.pdf` (as of Jul 2026)

Key facts to keep synced everywhere (HTML + downloadable PDF):

| Field | Latest value |
|-------|-------------|
| Name | Digvijaysing Rajput |
| Email | itsdigvijaysing@gmail.com |
| IIT email | cs24mtech14020@iith.ac.in |
| Phone | +91-7447352574 |
| M.Tech CGPA | **9.02** (not 8.56 from old site) |
| M.Tech | IIT Hyderabad, 2024–2026, NIS TA |
| B.E. CGPA | 9.15, NBN Sinhgad, Pune, 2022 |
| Samsung SRIB | AI Research Intern, Bangalore, **Jul 2025 – Jan 2026** (not "Present") |
| Cognizant | Salesforce Developer, Pune, Jul 2022 – Jul 2024 |
| Microsoft FRT | Cloud & DevOps Intern, Mar–May 2022 |
| Research | Adversarial Robustness in Florence-2 VLM — **IEEE APSCON 2026 accepted** |
| Awards | ET Campus Star winner; 1st AI Ideathon, Innovation Elan, Dev Duel; 2nd Pulse Quest |

**Project data reference:** `~/Documents/Projects/MagiTech-Site/src/data/projects.js` — 13 curated projects with slugs, overviews, tech stacks, and links. Use this as the primary source when building `assets/data/projects.json`.

### Known bugs in the OLD site (must not regress)

1. About section said "currently at Cognizant" — **false since Jul 2024**
2. Downloadable `assets/resume/Resume_final.pdf` was stale (no Samsung SRIB)
3. HTML validity issues: unclosed `<p>` in About, broken `<li>` nesting, extra `</div>` in Achievements section
4. Project title links were `<a href="">` — reload page on click
5. Private repo cards: `onclick` alert + `<a href="#">` both fire
6. `self.jpg` is 1.6 MB — needs compression
7. `me.JPG`, `system.jpg` unused in HTML
8. CSS references `"Rubik"` font but it's not imported
9. README has typo: `itsDigvijayisng` in repo URL

---

## Planned architecture (static multi-page)

```
itsDigvijaysing.github.io/
├── index.html              # Home: hero, stats, featured projects
├── about.html              # Full resume content: experience, education, skills, certs
├── projects/
│   ├── index.html          # All projects + tag filter bar
│   └── view.html           # Project detail (reads ?slug= from URL, loads JSON)
├── assets/
│   ├── css/site.css        # New design system (replaces old style.css for new pages)
│   ├── js/site.js          # Nav, fade-in observer, project loader/renderer
│   ├── data/projects.json  # Single source of truth for all project pages
│   ├── img/                # logo.png, self.jpg (compress!), screenshots if added
│   └── resume/Resume_final.pdf  # Must match latest resume PDF
└── CLAUDE.md               # This file
```

**Old files to eventually remove** (once redesign is complete and verified):
- `assets/css/style.css` (iPortfolio styles)
- `assets/js/main.js` (iPortfolio JS + particles)
- `assets/vendor/` entire directory (~11 MB)
- `assets/js/sweet-scroll.min.js`

**Design system tokens** (in `site.css`):
- Background: `#080c14`, cards: `#121a28`
- Accent gradient: cyan → blue → purple → magenta (inspired by MagiTech hero slab)
- Fonts: Inter (sans) + Instrument Serif (italic accent) via Google Fonts
- No Font Awesome Pro — use inline SVGs for social icons

**JS approach:**
- `site.js` fetches `assets/data/projects.json` at runtime
- Homepage renders featured projects (`featured: true` in JSON)
- Projects page renders all + filter by tag
- Detail page reads `?slug=` param, finds matching project, renders overview/highlights/tech stack/links
- Uses `document.body.dataset.base` for path prefix (empty at root, `../` from `projects/` subfolder)

---

## Work in progress (as of Jul 4, 2026) — ⚠ SUPERSEDED

> This table describes the abandoned **static-HTML** attempt (`about.html`, `assets/js/site.js`, `projects/*.html`). That approach was replaced by the React/Vite app under `src/` (see "Actual architecture" above). Kept for history only. **Polish pass completed Jul 6, 2026:** all pages built + browser-verified (desktop + mobile), mobile hero overflow fixed, robot aura softened, editorial section indices + serif accents added, About/project-detail presentation elevated, a11y (skip link, focus mgmt, aria, contrast, focus-visible), SEO (per-route meta, OG/Twitter/JSON-LD, robots/sitemap/og-cover), build slimmed (latin-only fonts 92→16 files, dropped unused framer-motion/lenis). Not committed — awaiting user.

| File | Status |
|------|--------|
| `index.html` | ✅ Rewritten (new hero, stats, featured projects grid) |
| `about.html` | ✅ Created (experience, education, skills, certs, achievements) |
| `assets/css/site.css` | ✅ Created (full design system) |
| `assets/js/site.js` | ✅ Created (nav, animations, project loader) |
| `assets/data/projects.json` | ✅ Created (16 projects, aligned with MagiTech + old site) |
| `assets/resume/Resume_final.pdf` | ✅ Copied from latest resume PDF |
| `projects/index.html` | ❌ Not created yet |
| `projects/view.html` | ❌ Not created yet |
| Old vendor/template cleanup | ❌ Not done |
| Image optimization (`self.jpg`) | ❌ Not done |
| README update | ❌ Not done |
| Local testing / browser verification | ❌ Not done |

Nav links in new pages already point to `projects/index.html` — **those pages will 404 until created**.

---

## User constraints (always follow)

- **Do NOT create git branches** unless explicitly asked
- **Do NOT commit or push** unless explicitly asked
- **Do NOT add `Co-Authored-By` or AI attribution** in commit messages
- This is a real environment — run commands and verify, don't just describe
- Prefer minimal, focused diffs — don't over-engineer
- Match existing conventions when editing; for new files follow the design system in `site.css`

---

## Key links & references

| Resource | Path / URL |
|----------|-----------|
| Live site | https://itsdigvijaysing.github.io/ |
| MagiTech (design reference) | https://magitech.site/ |
| MagiTech repo | `~/Documents/Projects/MagiTech-Site/` |
| Latest resume PDF | `~/Downloads/Resumes/RESUME.pdf` |
| LinkedIn | https://www.linkedin.com/in/digvijaysing |
| GitHub | https://github.com/itsDigvijaysing |
| Medium | https://digvijaysing.medium.com/ |
| Email | itsdigvijaysing@gmail.com |
| LightSpeak AI (featured project) | https://lightspeak.ai/ |

---

## Next steps (when user asks to continue)

1. Create `projects/index.html` and `projects/view.html` (with `data-base="../"` on body)
2. Browser-test all pages locally (e.g. Live Server port 5501 per `.vscode/settings.json`)
3. Compress `assets/img/self.jpg` (target ~50–100 KB)
4. Remove old iPortfolio vendor bloat once new site is verified
5. Update `README.md` (fix typo, reflect new multi-page layout)
6. Ask user before committing

---

## Resume content quick reference (for copy-paste into HTML)

### Work Experience

**Samsung SRIB — AI Research Intern** (Jul 2025 – Jan 2026)
- Fine-tuned Web Agent models, +400% task success rate
- Reduced token payload 40%, lowered inference latency and cost
- Built model evaluation & benchmarking pipeline

**Cognizant — Salesforce Developer** (Jul 2022 – Jul 2024)
- Enterprise Salesforce solutions, governance compliance
- Einstein AI for lead scoring/case assignment, -40% manual effort
- Refactored legacy codebase from 60K to 35K lines

**Microsoft FRT — Cloud & DevOps Intern** (Mar – May 2022)
- Containerized Mess Menu React app on Azure App Service with CI/CD

### Featured Projects (top 4 for homepage)

1. **LightSpeak AI** — Multi-channel conversational AI (voice/chat/email, hybrid RAG, +18% relevance)
2. **Indian Law AI Portal** — Agentic RAG, 4 domain agents, FAISS ~2600 chunks
3. **Web Agents** — LLM browser automation via CDP (Samsung SRIB work)
4. **PIRvision Classifier** — CNN-LSTM, 0.96 F1 on PIR sensor data

### Technical Skills

ML: Fine-Tuning LLM/VLM, Deep Learning, Deep RL, LoRA, RAG, Transformers
Languages: Python, C++, SQL, JavaScript
Web: React.js, Django, Node.js, REST APIs, HTML5
Tools: Git, Docker, Linux, Azure, CI/CD, Hugging Face, PyTorch, NumPy, Pandas, Scikit-learn
Salesforce (legacy): Apex, LWC, Visualforce, Aura screenshots, Einstein AI

### Certifications

Salesforce: Admin, AI Associate, Platform Dev I & II, JS Dev 1, Process Automation AP, Copado I & II
Cloud: Microsoft AZ-900

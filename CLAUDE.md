# CLAUDE.md — itsDigvijaysing.github.io Portfolio

Context file for AI assistants working on this repo. Read this before making changes.

> **This repo is a React 18 + Vite SPA** (migrated Jul 2026 from the old static iPortfolio template).
> Do not reintroduce a static-HTML architecture. `README.md` is accurate; trust it and the code.

---

## What this project is

Personal portfolio site for **Digvijaysing Rajput**, hosted as a **GitHub Pages user site**:

- **Live:** https://itsdigvijaysing.github.io/
- **Repo:** `itsDigvijaysing/itsDigvijaysing.github.io` (branch `main`)
- **Stack:** Vite 5 + React 18 + react-router-dom v6, hand-rolled CSS design system, **no runtime UI dependencies**
- **Deploy:** GitHub Actions (`.github/workflows/deploy.yml`) runs `npm ci && vite build → dist/`, copies `dist/index.html → dist/404.html` (SPA deep-link fallback), and publishes `dist/` via `actions/deploy-pages`. Pages source must be set to **"GitHub Actions"** (not "Deploy from branch").
- **Related site:** https://magitech.site/ — separate React/Vite project (`~/Documents/Projects/MagiTech-Site`); the **design reference** for craft/typography (not the code to copy).

`dist/` and `node_modules/` are gitignored; the build is produced by CI, never committed.

---

## Architecture (current, verified)

```
index.html                 # Vite entry: <div id="root"> + /src/main.jsx; full SEO <head> (OG/Twitter/JSON-LD, canonical, theme-color)
src/
├── main.jsx               # createRoot + BrowserRouter; latin-only @fontsource imports; 3 CSS files
├── App.jsx                # skip-link · ScrollToTop · Navbar · <Routes> · Footer; <main> re-keys on route for page-enter anim
├── pages/                 # Home, About, Journey, Projects, ProjectDetail, NotFound
├── components/            # Navbar, Footer, ScrollToTop, HeroBot, ParticleWeb, Magnetic, Reveal, RotatingText, CountUp, ProjectCard, SocialIcons, Workflow, WorkflowLightbox, JourneyPath (Journey-page milestone path, scroll-drawn SVG), DotGrid (cursor-spotlight dot lattice; one instance in App.jsx as a fixed backdrop behind interior pages — skipped on Home where ParticleWeb owns that layer; z-index -1, radial edge mask, resting dots near-invisible)
├── hooks/usePageMeta.js   # per-route title/description/canonical/OG (patches existing head tags; no react-helmet)
├── components/ProjectReviews/  # 5 bespoke per-project showcase components + index.js slug→component registry (see below)
├── data/projects.js       # single source of truth (13 projects) + featuredProjects / getProject helpers; each has a `workflow` {caption,rows,edges} driving the SVG diagram + zoom/pan modal on ProjectDetail
├── utils/                 # youtube.js (embed/thumbnail URLs) · motion.js (prefersReducedMotion)
└── styles/                # design-system.css (tokens + primitives) + components.css + project-reviews.css
public/                    # copied verbatim to dist root
├── assets/img/            # self.jpg, logo.png, og-cover.png, hero_greeting.webm   ← the ONLY runtime images
├── assets/resume/Digvijaysing_RESUME.pdf
├── robots.txt · sitemap.xml
.github/workflows/deploy.yml
```

**Routes:** `/` `/about` `/journey` `/projects` `/projects/:slug` `*`. Deep links work because CI writes `404.html = index.html`.

**Runtime images live in `public/assets/img/` — not the repo-root `assets/`.** Anything the app references via `/assets/...` resolves to `public/`. See the cleanup note below about the root `assets/` tree.

**Design direction:** **light** theme (`--bg:#f5f8fd`, white cards, `--text:#12233d`), editorial touches (Instrument Serif italic accents via `.serif`, mono section labels, timeline rails, project cover banners). Raise craft toward MagiTech; **do not convert to dark** unless the user asks. Every animation honors `prefers-reduced-motion`.

### Project showcase pages (`src/components/ProjectReviews/`) — added Aug 2026

**All 9 visible projects** have a **bespoke detail page**; the 4 `hidden:true` ones keep the generic layout. `index.js` maps slug → component and `ProjectDetail.jsx` branches on that lookup, so **anything absent falls back to generic Overview/Highlights**. Each page is ~200 lines of hand-built JSX whose motif comes from the project itself (hex stat radar, CPU/GPU pipeline, citation card, 3D card stack, channel hub, agent loop ring, class-imbalance bar, role fork, emotion wheel) plus four numbered sections.

- The first 5 (`lightspeak-ai`, `indian-law-ai-portal`, `stat-up`, `gnome-stage-manager`, `ai-linux-assistant`) were **ported from MagiTech**. The other 4 (`web-agents`, `pirvision-classifier`, `messmenu-app`, `emotion-recognition`) were **written from their GitHub repos** - every figure is sourced, never invented to fill a layout.
- **Showcase layout:** cover → description → facts strip → video banner (only if `videoId`) → review → Workflow as section 05. **No** Overview/Highlights (the review carries them) and **no** Tech Stack block - the facts strip names the top 3 techs instead. Generic layout is unchanged.
- **`videoId`** in `projects.js` drives a click-to-play banner (`ProjectVideo.jsx`); nothing loads from YouTube until clicked. Without it the banner and its lead-in gap are skipped entirely (`.project-showcase--novideo`).
- **Prose width:** all review prose caps at `--measure` (`:root`, 56rem). MagiTech's caps were `ch`-based for its 880px column; at this site's 1200px they wrapped text at ~half the width and looked broken. `ch` also scales with font-size, so small-text notes came out far narrower than the lede - hence one rem token, not per-block `ch`.
- **Copy style:** no em dashes (use spaced hyphens), and keep each paragraph a single continuous line in JSX. Multi-line JSX text is fine (newlines collapse to one space) **except** next to `{' '}` or an inline element carrying its own padding spaces, which then renders double spaces.
- **`project-reviews.css` is 4 parts:** ① a token bridge on `.dt` mapping MagiTech's ~40 token names onto ours + scoped `ul/ol`/`button` resets it assumed globally, ② the ported rules verbatim apart from color, ③ light-theme corrections, ④ page wrapper. **Edit it directly** — the port script was one-shot.
- **Scoped resets must use `:where()`.** The ported rules are nearly all single-class (0,1,0), so a plain `.dt button {}` at (0,1,1) silently overrides them — it stripped `.gsm__card`'s gradient/border and knocked `.dt__h2` to weight 700. Never add margin/padding to the `ul/ol` reset either: `*` already zeroes both, and repeating it cost `.lsa__timeline` its `padding-left` (text landed on top of the rail).
- **Gotchas if you touch this:** dark→light is *not* a token swap. Borders need ~50% more alpha to read (8% white on black ≠ 10% navy on white); `color: var(--accent)` fails AA as small text (3.0:1) so text uses `--accent-2` (8.4:1) while strokes/fills keep the cyan; MagiTech's grid-lines-via-`gap` trick fills empty grid areas with visible grey on white (the channel hub draws borders on cells instead). Don't wrap a review in `.project-detail` — its element selectors (`p`, `li`, `li::before`, `h2`) outrank the review's classes; use `.project-showcase`.
- **Spacing:** the large end of the scale (`--space-8`…`--space-24`) is pulled in from MagiTech's values because those margins stack (a hero's margin inside a section that already has one) and this site runs 1200px wide vs MagiTech's 880px. Small end is unchanged.

### Hero mascot (`src/components/HeroBot.jsx`)

- Transparent greeting video — `public/assets/img/hero_greeting.webm` (VP9 `yuva420p` alpha, 520×882). Minimal soft blue glow (`.hero__bot-aura`) + a vertical "door" accent line (`.hero__bot-line`) that drops in on load.
- **Playback:** full greeting **once on load, then replays every 30s** (not a continuous loop); re-fires on every Home visit (page remounts per route). Gated on `prefers-reduced-motion`.
- **Transparency is a one-time chroma-key, not a runtime effect.** The green-screen **source master** is `assets/img/hero_bot_greet_bg.mp4` (repo root — *keep it*, it's how the webm is regenerated; 720×1280, 9.8s, flat `#25B936`).
- ⚠ **WebKit ignores VP9 alpha.** Safari and every iOS/iPadOS browser (all WKWebView — Brave, Chrome, Firefox included) *play* the webm but render the **RGB plane opaque**, ignoring the alpha. So whatever sits under the alpha is what iOS shows as a solid rectangle. Apple's only transparent-video path is HEVC-with-alpha, which x265 on Linux cannot encode. Fixed 2026-08-17 with two layers:
  1. **Still fallback** — `HeroBot.jsx` checks the engine (`navigator.vendor` matches Apple, or `GestureEvent` exists) *before first render* and renders `public/assets/img/hero_bot_still.webp` (520×882 RGBA, keyed from the master at t=6.0s, same crop) instead of the `<video>`. WebKit gets genuine transparency over the particle backdrop and never downloads the 463 KB webm; it just loses the animation.
     - ⚠ **Do not "improve" this into a feature detection.** That was tried first (draw a frame to a canvas, read the alpha back) and **failed on the actual device**: WKWebView routinely returns a *blank* frame from `drawImage(video)`, so the probe never saw an opaque pixel, never reached a verdict, and silently left the broken video in place — shipping a white box to iOS. The capability is not observable on the platform that has the bug.
  2. **Light underlay** — the video's RGB plane is composited over `--bg` (`#F5F8FD`) instead of the keyed green, as a safety net for any WebKit build the engine check misses. **Never leave the keyed green under the alpha** — that shipped once and put a dark green box on the hero for every iOS visitor.
  - Alpha-capable browsers are unaffected by both: where alpha is 0 the RGB is never sampled. Only the antialiased edge pixels change, and they improve (the fringe now blends toward the page instead of dark green).
- **Regenerate** (the crop/scale reproduces the exact shipped framing — derived by matching content bboxes, don't change it casually):
  ```bash
  ffmpeg -i assets/img/hero_bot_greet_bg.mp4 -filter_complex "\
  [0:v]crop=668:1133:51:99,chromakey=0x25b936:0.10:0.02,despill=type=green,format=yuva420p,scale=520:882,format=yuva420p[keyed];\
  [keyed]split[k1][k2];\
  [k1]format=yuva420p,alphaextract,format=gray[al];\
  color=c=0xF5F8FD:s=520x882:r=30:d=9.8,format=yuv420p[bg];\
  [bg][k2]overlay=shortest=1:format=yuv420,format=yuv420p[flat];\
  [flat][al]alphamerge[out]" \
    -map "[out]" -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 -b:v 0 -crf 34 -an \
    public/assets/img/hero_greeting.webm
  ```
  Key at native res **before** `scale` or the edges pick up green fringes. `alphaextract` needs an explicit `format=yuva420p` ahead of it or the filtergraph fails to negotiate. The still fallback comes from the same master and crop:
  ```bash
  ffmpeg -ss 6.0 -i assets/img/hero_bot_greet_bg.mp4 -frames:v 1 \
    -vf "crop=668:1133:51:99,chromakey=0x25b936:0.10:0.02,despill=type=green,format=rgba,scale=520:882" \
    -c:v libwebp -lossless 0 -q:v 88 public/assets/img/hero_bot_still.webp
  ```
  Pick a `-ss` where the robot is fully in frame — it enters after the start and **exits before the end** (frames past ~8.5s are empty).
- ⚠ **`ffprobe` cannot tell you whether the webm has alpha.** It reports `pix_fmt=yuv420p` and ffmpeg decodes frames to plain RGB even when the alpha is present and correct — ffmpeg's VP9 decoder doesn't reconstruct WebM alpha from `BlockAdditional`. The real signal is the container tag: `ffprobe -show_entries stream_tags=alpha_mode` → `alpha_mode=1`. Decoding a frame shows you the **RGB plane** (i.e. exactly what iOS renders), which is useful — just don't read it as proof that alpha is missing.
- ⚠ **Do NOT debug video/animation via headless screenshots** — headless Chromium can't advance video under its virtual clock and mis-renders it (looks like clipping/stuck frames that aren't real). Verify hero motion in a real browser or ask the user.

---

## Repo hygiene / dead code

Vite only bundles `src/ + public/ + index.html`, so leftover files never ship to visitors — but they mislead. Status after the Jul 6 2026 cleanup:

- **Removed:** the entire pre-React static site — `assets/vendor/` (11 MB iPortfolio bloat), `assets/js/{main,site,projects-data,sweet-scroll}.js`, `assets/css/{site,style}.css`, `assets/data/projects.json` (dup of `src/data/projects.js`), root `assets/resume/Resume_final.pdf` (dup of `public/`), `about.html`, `projects/{index,view}.html`, and unused `assets/img/{me.JPG,system.jpg}`.
- **Kept in repo root `assets/img/` (source/reference, not served):** `hero_bot_greet_bg.mp4` (green-screen master), `hero_bot_video_transparent.webm` / `hero_bot.png` (intermediates), `Website.png` + `new_website.png` (**used by README**), `self.jpg`/`logo.png` (originals; the served copies are in `public/`).
- If adding a new runtime image, put it in `public/assets/img/` and reference it as `/assets/img/<file>`.

---

## User constraints (always follow)

- **Do NOT create git branches** unless explicitly asked
- **Do NOT commit or push** unless explicitly asked
- **Do NOT add `Co-Authored-By` or any AI attribution** in commit messages / PRs
- **Do NOT name LLM models/providers in site content** (no Groq, Llama, Gemini, GPT-*, Qwen, OpenAI, Anthropic, …) — write the generic role instead: "LLM", "hosted LLM API", "local LLM". For **LightSpeak AI** (commercial product) also genericize ALL third-party AI vendors: STT/TTS vendors, embedding models, rerankers, voice names → "STT engine", "TTS engine", "embedding model". "Ollama" (runtime) and public non-LLM models in open-source repos (Whisper, DistilBERT, FAISS, CNN/LSTM…) are fine. Set 2026-07-06.
- Real environment — run commands and verify, don't just describe
- Prefer minimal, focused diffs; match existing conventions (design tokens in `src/styles/design-system.css`)

---

## Content source of truth (resume facts — keep synced across pages + `public/assets/resume/Resume_final.pdf`)

| Field | Value |
|-------|-------|
| Name | Digvijaysing Rajput |
| Email | itsdigvijaysing@gmail.com · IIT: cs24mtech14020@iith.ac.in · +91-7447352574 |
| M.Tech | IIT Hyderabad, 2024–2026, **CGPA 9.02**, NIS TA |
| B.E. | NBN Sinhgad, SPPU, 2018–2022, **CGPA 9.15** |
| Samsung SRIB | AI Research Intern, Bangalore, **Jul 2025 – Jan 2026** (not "Present") |
| Cognizant | Salesforce Developer, Pune, Jul 2022 – Jul 2024 |
| Microsoft FRT | Cloud & DevOps Intern, Mar–May 2022 |
| Research | Adversarial Robustness in Florence-2 VLM — **IEEE APSCON 2026 accepted** |
| Awards | Winner ET Campus Star; 1st AI Ideathon / Innovation Elan / Dev Duel; 2nd Pulse Quest |

### Work experience detail
- **Samsung SRIB — AI Research Intern** (Jul 2025 – Jan 2026): fine-tuned Web Agent models (+400% task success); reduced token payload 40% (lower latency/cost); built evaluation & benchmarking pipeline.
- **Cognizant — Salesforce Developer** (Jul 2022 – Jul 2024): enterprise Salesforce; Einstein AI for lead scoring/case assignment (−40% manual effort); refactored legacy 60K→35K lines.
- **Microsoft FRT — Cloud & DevOps Intern** (Mar–May 2022): containerized Mess Menu React app to Azure App Service with CI/CD.

### Featured projects (homepage) & skills
- Featured are `featured:true` in `src/data/projects.js` (currently: LightSpeak AI, Indian Law AI Portal, Stat-Up, AI Linux Assistant, GNOME Stage Manager, PIRvision Classifier).
- `hidden:true` projects (Jira Automation Portal, Salesforce Apex Code Fixer, Shooting Competition, Leave Management System) are collapsed behind a "Show N more" toggle on `/projects` (see `Projects.jsx`) instead of shown directly — basic/coursework-grade work, kept but deprioritized.
- ML: LLM/VLM Fine-Tuning, Deep Learning, Deep RL, LoRA, RAG, Transformers · Languages: Python, C++, SQL, JavaScript · Web: React, Django, Node, REST · Tools: Git, Docker, Linux, Azure, CI/CD, Hugging Face, PyTorch · Salesforce (legacy): Apex, LWC, Einstein AI.
- Certifications — Salesforce: Admin, AI Associate, Platform Dev I & II, JS Dev I, Process Automation AP, Copado I & II · Cloud: Microsoft AZ-900.

---

## Key links

| Resource | Path / URL |
|----------|-----------|
| Live site | https://itsdigvijaysing.github.io/ |
| MagiTech (design reference) | https://magitech.site/ · repo `~/Documents/Projects/MagiTech-Site/` |
| Latest resume PDF | `~/Downloads/Resumes/RESUME.pdf` |
| LinkedIn / GitHub / Medium | in/digvijaysing · github.com/itsDigvijaysing · digvijaysing.medium.com |
| LightSpeak AI (featured) | https://lightspeak.ai/ |

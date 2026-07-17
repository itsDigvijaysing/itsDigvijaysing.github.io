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
├── main.jsx               # createRoot + BrowserRouter; latin-only @fontsource imports; 2 CSS files
├── App.jsx                # skip-link · ScrollToTop · Navbar · <Routes> · Footer; <main> re-keys on route for page-enter anim
├── pages/                 # Home, About, Journey, Projects, ProjectDetail, NotFound
├── components/            # Navbar, Footer, ScrollToTop, HeroBot, ParticleWeb, Magnetic, Reveal, RotatingText, CountUp, ProjectCard, SocialIcons, Workflow, WorkflowLightbox, JourneyPath (Journey-page milestone path, scroll-drawn SVG), DotGrid (cursor-spotlight dot lattice; one instance in App.jsx as a fixed backdrop behind interior pages — skipped on Home where ParticleWeb owns that layer; z-index -1, radial edge mask, resting dots near-invisible)
├── hooks/usePageMeta.js   # per-route title/description/canonical/OG (patches existing head tags; no react-helmet)
├── data/projects.js       # single source of truth (13 projects) + featuredProjects / getProject helpers; each has a `workflow` {caption,rows,edges} driving the SVG diagram + zoom/pan modal on ProjectDetail
└── styles/                # design-system.css (tokens + primitives) + components.css
public/                    # copied verbatim to dist root
├── assets/img/            # self.jpg, logo.png, og-cover.png, hero_greeting.webm   ← the ONLY runtime images
├── assets/resume/Digvijaysing_RESUME.pdf
├── robots.txt · sitemap.xml
.github/workflows/deploy.yml
```

**Routes:** `/` `/about` `/journey` `/projects` `/projects/:slug` `*`. Deep links work because CI writes `404.html = index.html`.

**Runtime images live in `public/assets/img/` — not the repo-root `assets/`.** Anything the app references via `/assets/...` resolves to `public/`. See the cleanup note below about the root `assets/` tree.

**Design direction:** **light** theme (`--bg:#f5f8fd`, white cards, `--text:#12233d`), editorial touches (Instrument Serif italic accents via `.serif`, mono section labels, timeline rails, project cover banners). Raise craft toward MagiTech; **do not convert to dark** unless the user asks. Every animation honors `prefers-reduced-motion`.

### Hero mascot (`src/components/HeroBot.jsx`)

- Transparent greeting video — `public/assets/img/hero_greeting.webm` (VP9 `yuva420p` alpha, 520×882). Minimal soft blue glow (`.hero__bot-aura`) + a vertical "door" accent line (`.hero__bot-line`) that drops in on load.
- **Playback:** full greeting **once on load, then replays every 30s** (not a continuous loop); re-fires on every Home visit (page remounts per route). Gated on `prefers-reduced-motion`.
- **Transparency is a one-time chroma-key, not a runtime effect.** The green-screen **source master** is `assets/img/hero_bot_greet_bg.mp4` (repo root — *keep it*, it's how the webm is regenerated). To redo/replace:
  ```bash
  ffmpeg -i assets/img/hero_bot_greet_bg.mp4 \
    -vf "chromakey=0x25b936:0.10:0.02,despill=type=green,crop=..." \
    -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 -b:v 0 -crf 34 -an \
    public/assets/img/hero_greeting.webm
  ```
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
- Featured are `featured:true` in `src/data/projects.js` (currently: LightSpeak AI, Indian Law AI Portal, Stat-Up, Jira Automation Portal, AI Linux Assistant, GNOME Stage Manager).
- `hidden:true` projects (Salesforce Apex Code Fixer, Shooting Competition, Leave Management System) are collapsed behind a "Show N more" toggle on `/projects` (see `Projects.jsx`) instead of shown directly — basic/coursework-grade work, kept but deprioritized.
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

# Bespoke project review pages — design

**Date:** 2026-08-10
**Status:** approved, ready for implementation planning

## Problem

Every one of the portfolio's 13 project detail pages renders the same generic layout:
cover → facts strip → Overview/Highlights prose + tech-stack sidebar → Workflow SVG. The
pages describe projects; they do not showcase them.

The sibling site MagiTech-Site (`~/Documents/Projects/MagiTech-Site`) solved this. Its
`ProjectDetail.js` keeps one thin generic shell and then looks up a **bespoke review
component per slug** — five exist, each ~200 lines of hand-built JSX whose visual motif is
drawn from the project's own subject matter. Its copy for those projects is also newer and
more accurate than the portfolio's.

Port that mechanism, those five components, and that copy into the portfolio.

## Decisions

| Question | Decision |
|---|---|
| Theme | **Re-tone to the portfolio's light/blue palette.** Structure, geometry, spacing, copy and interaction stay 1:1; only colors move. The repo's "do not convert to dark" rule holds. |
| Coverage | **Port the 5 that exist.** The other 8 projects keep today's generic layout — this is exactly what MagiTech itself does. |
| Existing sections | On review pages the review **replaces Overview + Highlights**. Tech Stack and the Workflow SVG diagram are **kept** (the Workflow diagram has no MagiTech equivalent and is worth keeping). |
| Video | **Port the YouTube demo banners** — click-to-play thumbnail → iframe, for the same 5 projects. |

## The five reviews

| Slug | Component | Motif |
|---|---|---|
| `lightspeak-ai` | `LightSpeakAiReview` | 4-channel hub with auto-cycling active cell → 5-step turn timeline → ledger `<dl>` → reserve/commit/release/idempotent stepper → 8 numbered spec items |
| `indian-law-ai-portal` | `IndianLawAiPortalReview` | Answer card with alternating citation highlight → docket table → legacy⇄current statute pairs → confidence gauge (0.15 / 0.35 / 0.95) → 5 rotated stamps |
| `stat-up` | `StatUpReview` | SVG hexagon stat radar (computed geometry, 3 rings + 6 axes) → priority→points bars → E–S rank ladder → decay/shield branch → privacy checklist |
| `gnome-stage-manager` | `GnomeStageManagerReview` | Interactive 3D card-stack sidebar mockup → Groups/Apps/Workspaces tab switcher → defaults chips → swap diagram → 8-item checklist |
| `ai-linux-assistant` | `AiLinuxAssistantReview` | Cycling state monogram + canvas waveform → CPU/GPU pipeline nodes → 4 stat blocks → safety-gate cards with tone pills → 8 capability cards |

All five use the shared `.dt__section` / `.dt__h2` / `.dt__h2-num` / `.dt__section-note`
scaffolding for their numbered sections (01–04).

## File inventory

### New

```
src/components/ProjectReviews/
├── index.js                        # slug → component registry
├── LightSpeakAiReview.jsx
├── IndianLawAiPortalReview.jsx
├── StatUpReview.jsx
├── GnomeStageManagerReview.jsx
└── AiLinuxAssistantReview.jsx
src/components/ProjectVideo.jsx     # click-to-play YouTube thumbnail → iframe
src/components/AmbientWaveform.jsx  # canvas bar-waveform (AiLinuxAssistantReview only)
src/utils/youtube.js                # buildYouTubeEmbedUrl + buildYouTubeThumbnailUrl
src/styles/project-reviews.css      # ~230 re-toned rule blocks
```

`project-reviews.css` is a separate file rather than an addition to `components.css`,
which is already 1267 lines. It is imported from `src/main.jsx` alongside the existing two.

### Modified

- **`src/pages/ProjectDetail.jsx`** — branch on registry hit (see below)
- **`src/data/projects.js`** — add `videoId` to the 5; refresh their `subtitle` / `desc`
- **`src/main.jsx`** — import the new stylesheet

## Page structure

```
review page (5):    cover → facts → video banner → REVIEW (full width)
                          → Tech Stack strip → Workflow

generic page (8):   cover → facts → Overview/Highlights + Tech Stack aside → Workflow
                    (unchanged)
```

On review pages the two-column `.project-detail__grid` is not used: the review is full
width, and Tech Stack renders as a full-width strip below it reusing `.sidebar-card` +
`.skill-pill`. `ProjectDetail.jsx` selects between the two layouts on
`REVIEWS[slug] !== undefined`; everything above the banner (back link, `.project-cover`,
`.project-facts`) is shared by both.

## Constraints resolved

### No new dependencies

MagiTech animates its banner with `framer-motion`. The portfolio has no runtime UI
dependencies (only GSAP, used elsewhere). The banner uses the existing
`src/components/Reveal.jsx` (IntersectionObserver + CSS) instead. **No package is added.**

MagiTech's `Helmet` usage is likewise dropped — the portfolio already sets per-route meta
through `usePageMeta`, which `ProjectDetail.jsx` calls today.

### Vendor names

`CLAUDE.md` forbids naming LLM models/providers in site content. Three ported lines
violate it and are genericized during the port:

| File | Original | Ported as |
|---|---|---|
| `AiLinuxAssistantReview` NODES | `qwen3:4b` | `Local LLM · 4B` |
| `AiLinuxAssistantReview` CAPABILITIES | `Local qwen3:4b via Ollama by default` | `A local 4B model via Ollama by default` |
| `StatUpReview` PRIVACY | `the Gemini AI Coach` | `the AI Coach` |

`Ollama` is a runtime, not a model or provider, and is explicitly allowed. LightSpeak's
review already reads fully genericized upstream ("Reasoning Engine", "Knowledge Engine",
"self-hosted real-time media infrastructure") and needs no changes.

## Color remap

The two sites already share fonts (Inter / JetBrains Mono / Instrument Serif), so only
color moves.

| MagiTech token | Portfolio replacement |
|---|---|
| `--bg-primary #0A0A0A` | `--bg-card #ffffff` |
| `--bg-elevated #141312` | `--bg-card #ffffff` with `--shadow` |
| `--bg-inset #1C1B19` | `--bg #f5f8fd` |
| `--text-primary #F5F0E1` | `--text #12233d` |
| `--text-secondary #918B7C` | `--text-muted #5a6b82` |
| `--text-tertiary #5E594E` | `--text-dim #667488` |
| `--accent #C8FF00` | `--accent #149ddd` |
| `--accent-strong #E2FF4D` | `--accent-2 #2740b6` |
| `--accent-soft rgba(200,255,0,.12)` | `--accent-soft rgba(20,157,221,.12)` |
| `--accent-ink #131400` (dark text on lime) | `#ffffff` (white text on blue) |
| `--border-subtle` / `--border-medium` / `--border-strong` | `--border` / `--border` / `--border-strong` |

Two color groups are semantic rather than thematic and are **kept**. Each keeps its hue and
is darkened until it clears 4.5:1 against `#ffffff`; the resulting values are measured
during implementation rather than guessed, and recorded in `project-reviews.css`:

- **State / channel hues** — `#7c8cff` `#5fd08a` `#b06bf2` `#f06fa0` `#e8a33d`
  (AI Linux Assistant's idle/listening/thinking/speaking/starting; LightSpeak's
  voice/WhatsApp/chat/email)
- **Tone pills** — `deny` / `allow` / `floor` become light red / green / amber tints with
  dark text, replacing the dark-mode saturated fills

`AmbientWaveform` reads `--accent` and `--border-medium` off the DOM at runtime via
`getComputedStyle`. Its fallbacks change to the portfolio's values; it otherwise needs no
edit and picks up the blue automatically.

## Data changes

`videoId` added to five entries in `src/data/projects.js`:

| Slug | videoId |
|---|---|
| `lightspeak-ai` | `26yLzhofjl0` |
| `indian-law-ai-portal` | `KKpGBPhEnt8` |
| `stat-up` | `gvXfM7x2DlU` |
| `gnome-stage-manager` | `8fnFvYaxUMo` |
| `ai-linux-assistant` | `2Qq7Jslxo6Y` |

`subtitle` and `desc` for those five are replaced with MagiTech's copy, which is newer and
in two cases materially more accurate:

- **`ai-linux-assistant`** — the portfolio's current text describes a superseded
  architecture (a named model list). MagiTech's describes what the project now is:
  full-duplex barge-in, typed MCP tools, a safety gate.
- **`gnome-stage-manager`** — MagiTech's carries the GNOME 46–50 / Wayland + X11
  compatibility range the portfolio omits.

`link` for `gnome-stage-manager` and `stat-up` is **not** changed by this work. The
published-extension URL and the `releases/latest` APK URL are real gaps, but they are a
separate data fix, not part of the review-page port.

### Known pre-existing violation, not fixed here

`jira-automation-portal`'s `desc` currently ends "…test-case sub-tasks via Gemini", which
breaks the same no-vendor-names rule. That project is not one of the five and its data is
not touched by this work, so the violation survives it. Flagged for a separate one-word
fix. (`ai-linux-assistant`'s "qwen3 via Ollama" violation *is* resolved here, incidentally,
because its `desc` is one of the five being replaced.)

`overview` and `highlights` stay in the data file for all five even though those pages no
longer render them — `usePageMeta` uses `p.overview` for the page description.

## Accessibility

Ported as-is from MagiTech, which already handles this:

- Every auto-cycling component (`StateMonogram`, `ChannelHub`, `AnswerCard`,
  `StackMockup`) checks `prefers-reduced-motion` and does not start its interval when set.
- `AmbientWaveform` draws a single static frame under reduced motion instead of animating.
- The stat radar carries a descriptive `role="img"` + `aria-label`; the GPU budget bar and
  decorative canvas likewise.
- `ModeSwitcher` uses `role="tablist"` / `role="tab"` / `aria-selected`.
- The video thumbnail is a `<button>` with `aria-label`; the poster `<img>` is
  `aria-hidden`.

Contrast: every re-toned foreground must clear WCAG AA (4.5:1 body, 3:1 large) against its
new light background. This is the one place the port is not mechanical.

## Acceptance criteria

1. `npm run build` succeeds; `package.json` dependencies are unchanged.
2. The 5 review routes render cover, facts, video banner, all four numbered review
   sections, tech stack, and Workflow — with no dark backgrounds and no lime.
3. The 8 generic routes are visually identical to before the change.
4. This work introduces no LLM model or provider name. Running
   `grep -riE 'qwen|llama|groq|gpt-|openai|anthropic|deepseek|sarvam' dist/assets` returns
   nothing, and the only `gemini` hit is the pre-existing `jira-automation-portal` one
   noted above.
5. With `prefers-reduced-motion: reduce`, no interval-driven component cycles and the
   waveform holds a static frame.
6. Video banner: thumbnail loads, click swaps to an autoplaying iframe.
7. Deep-linking to `/projects/stat-up` works (CI's `404.html` fallback already covers it).

## Out of scope

- Bespoke reviews for the other 8 projects
- Importing MagiTech's 4 portfolio-absent projects (`ai-voice-assistant`,
  `math-equation-solver`, `nexus-bots`, `portfolio-website`)
- The `gnome-stage-manager` / `stat-up` link corrections
- Any change to Home, About, Journey, or the Projects index

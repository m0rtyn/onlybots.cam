# onlybots.cam — Copilot Workspace Instructions

## Project Overview

**onlybots.cam** is a satirical art-activism single-page website built with Astro. It's disguised as an AI webcam companion platform but reveals the brutal reality of the webcam industry (exploitation, trafficking, mental health statistics) when the user interacts.

### Core Mechanism

1. **Bait phase**: Visitors see a glossy, OnlyFans-style dark UI with fake "bot" profile cards, Subscribe buttons, and platform chrome
2. **The Switch**: Clicking any interactive element triggers a dramatic GSAP animation — color drains, cards flip to reveal statistics, typography shifts to monospaced
3. **Reveal phase**: Real sourced statistics, testimonies, revenue breakdowns, and links to anti-trafficking organizations

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Astro 5** (static output) |
| Styling | **Tailwind CSS 3** |
| Interactivity | **React 19** (Astro islands: `client:load`, `client:visible`) |
| 3D | **Three.js** + `@react-three/fiber` + `@react-three/drei` |
| Animations | **GSAP** (timeline + ScrollTrigger) |
| Language | **TypeScript** (strict) |

### Key Design Tokens

- Dark background: `#0a0a0a` (Tailwind: `dark-bg`)
- Neon pink accent: `#ff2d87` (Tailwind: `neon-pink`)
- Electric blue: `#00a2ff` (Tailwind: `electric-blue`)
- Bait font: Inter (sans-serif)
- Reveal font: JetBrains Mono (monospaced)

### Architecture Rules

- **Single page** — everything lives in `src/pages/index.astro`
- **Astro components** (`.astro`) for static content, **React islands** (`.tsx`) only for interactivity (TheSwitch, DigitalCage)
- **Two CSS states**: `.bait-state` and `.reveal-state` on `<body>`
- **Data files** in `src/data/*.json` — all statistics MUST have source URLs
- **No way back** — once switched, `sessionStorage` preserves the reveal state
- **`prefers-reduced-motion`** — skip animations, show reveal content directly
- All external links must have `rel="noopener noreferrer"` and `target="_blank"`

### Key Files

- `SPEC.md` — Full project specification (design, UX, content strategy, legal)
- `PLAN.md` — Step-by-step implementation tasks with dependencies
- `RESEARCH.md` — All sourced statistics, studies, and quotes
- `src/components/TheSwitch.tsx` — Central state machine orchestrating the transition
- `src/components/DigitalCage.tsx` — Three.js wireframe cage scene
- `src/data/statistics.json` — Stat card pairings (bait label → reveal stat)
- `src/data/testimonies.json` — Anonymized quotes from former webcam workers
- `src/data/resources.json` — Anti-trafficking organizations and links

### Tone & Content Guidelines

- **Not preachy** — let data speak for itself
- **Not shaming the viewer** — target is the industry, not the consumer
- **Clinical + emotional** — statistics paired with human stories
- **No graphic content** — the horror is in the numbers, not in images
- Every statistic must link to a peer-reviewed study, investigative report, or NGO source

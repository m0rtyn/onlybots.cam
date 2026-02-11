# AGENTS.md — onlybots.cam

This is a satirical art-activism single-page website built with Astro 5, Tailwind CSS 3, React 19 islands, and GSAP.

## Architecture

- **Single page**: everything assembles in `src/pages/index.astro`
- **Static output**: `astro build` produces static HTML/CSS/JS
- **Two phases**: `.bait-state` (fake platform) → `.reveal-state` (real statistics) on `<body>`
- **No way back**: `sessionStorage` preserves reveal state across refreshes

## Key reference documents

- [SPEC.md](docs/SPEC.md) — Full project specification
- [PLAN.md](docs/PLAN.md) — Implementation tasks with dependencies
- [RESEARCH.md](docs/RESEARCH.md) — All sourced statistics and studies

## Component types

| Extension | Use for | Hydration |
|-----------|---------|-----------|
| `.astro` | Static content, layouts, data-driven sections | Server only (zero JS) |
| `.tsx` | Interactive islands (TheSwitch) | `client:load` |

## Data integrity

Every statistic displayed on the site must have a verifiable `sourceUrl` pointing to the original study or report. Never fabricate data. Source of truth is `RESEARCH.md`.

## Accessibility

- `prefers-reduced-motion` must be respected — skip all animations, show final state
- `aria-live` region announces content changes during the switch
- Keyboard navigation for all interactive elements
- All external links: `rel="noopener noreferrer" target="_blank"`

## Available custom agents

| Agent | Purpose |
|-------|---------|
| **Orchestrator** | Coordinates multi-step work, delegates to subagents |
| **Astro Builder** | Builds/edits .astro components |
| **React Islands** | TheSwitch.tsx |
| **GSAP Animator** | Animations and the switch transition |
| **Stylist** | Tailwind CSS, global styles, visual design |
| **Content Editor** | Data files, statistics, source verification |
| **QA Auditor** | Accessibility, performance, testing |
| **Code Reviewer** | Reviews changes against SPEC.md |

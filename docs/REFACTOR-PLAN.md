# 🏗️ Bulletproof React Refactoring Plan — onlybots.cam

> Adapting [Bulletproof React](https://github.com/alan2207/bulletproof-react) architecture to an **Astro 5 + React islands** project.

> **Status: ✅ 47/61 tasks complete (Feb 11, 2026)**
> Remaining: ESLint/Prettier/Husky (Phase 0.2–0.4), build verification + testing (Phase 7.3–7.9), doc updates (Phase 7.10–7.11)

---

## Table of Contents

1. [Current State Analysis](#1-current-state-analysis)
2. [Target Architecture](#2-target-architecture)
3. [Migration Steps](#3-migration-steps)
4. [File Mapping (Before → After)](#4-file-mapping-before--after)
5. [Implementation Tasks](#5-implementation-tasks)
6. [Non-Goals](#6-non-goals)

---

## 1. Current State Analysis

> ⚠️ **Historical** — This describes the state *before* refactoring. See Section 2 for the current architecture.

### Pre-Refactoring Structure (flat)

```
src/
├── components/           # ❌ Flat — all 11 components in one folder
│   ├── BehindTheScreen.astro
│   ├── LandingGrid.astro
│   ├── PlatformFooter.astro
│   ├── PlatformHeader.astro
│   ├── ProfileCard.astro
│   ├── TheMachine.astro
│   ├── TheRealCost.astro
│   ├── TheSwitch.tsx
│   ├── WhatYouCanDo.astro
│   ├── WhyIBuiltThis.astro
│   └── (missing DigitalCage.tsx)
├── data/                 # ✅ OK — data files exist
│   ├── resources.json
│   ├── statistics.json
│   └── testimonies.json
├── layouts/
│   └── Layout.astro
├── pages/
│   └── index.astro
└── styles/
    └── global.css        # ❌ 334-line monolith
```

### Problems Identified

> All structural problems resolved ✅. Only tooling (ESLint/Prettier/Husky) remains.

| # | Problem | Status |
|---|---------|--------|
| 1 | **Flat component folder** — 11 components in one directory | ✅ Resolved → 3 feature folders |
| 2 | **No feature boundaries** — bait/reveal mixed | ✅ Resolved → `bait-phase`, `reveal-phase`, `the-switch` |
| 3 | **No shared types** — Phase, interfaces inline | ✅ Resolved → `src/shared/types/` |
| 4 | **No absolute imports** — relative paths only | ✅ Resolved → `@/` alias everywhere |
| 5 | **Monolithic CSS** — 334 lines in one file | ✅ Resolved → 6 split files |
| 6 | **Hardcoded data in components** | ✅ Resolved → imports from `src/data/*.json` |
| 7 | **No config extraction** — magic strings scattered | ✅ Resolved → `src/shared/config/` |
| 8 | **No project standards tooling** | ⏳ Pending → ESLint/Prettier/Husky not installed |
| 9 | **Mixed naming conventions** | ✅ Resolved → kebab-case enforced (manual) |
| 10 | **No `lib/` abstraction** | ✅ Resolved → `src/shared/lib/gsap.ts` |
| 11 | **TheSwitch.tsx is 554 lines** | ✅ Resolved → 6 focused modules (~34 line component) |

---

## 2. Target Architecture

> ✅ **IMPLEMENTED** — This is the actual structure as of Feb 11, 2026.

```
src/
├── data/                         # ✅ Source of truth for all statistics
│   ├── resources.json
│   ├── statistics.json
│   └── testimonies.json
│
├── features/                     # Feature-based modules
│   ├── bait-phase/               # The fake platform UI
│   │   ├── components/
│   │   │   ├── landing-grid.astro
│   │   │   ├── platform-header.astro
│   │   │   ├── platform-footer.astro
│   │   │   └── profile-card.astro
│   │   ├── data/
│   │   │   └── bot-profiles.ts   # Extracted from LandingGrid frontmatter
│   │   └── styles/
│   │       └── bait.css          # Bait-specific styles (neon glow, card flip)
│   │
│   ├── reveal-phase/             # The real statistics & resources
│   │   ├── components/
│   │   │   ├── the-real-cost.astro
│   │   │   ├── behind-the-screen.astro
│   │   │   ├── the-machine.astro
│   │   │   ├── what-you-can-do.astro
│   │   │   └── why-i-built-this.astro
│   │   └── styles/
│   │       └── reveal.css        # Reveal-specific styles (blood drips, vignette, scroll snap)
│   │
│   └── the-switch/               # Core transition mechanism (React island)
│       ├── components/
│       │   └── the-switch.tsx     # Slimmed-down React component (~34 lines)
│       ├── hooks/
│       │   └── use-switch-phase.ts # Phase state + sessionStorage logic
│       ├── lib/
│       │   ├── switch-animation.ts # GSAP timeline builder
│       │   ├── apply-revealed.ts   # Instant reveal (returning visitors)
│       │   └── dom-cache.ts        # getCachedElements() helper
│       ├── types/
│       │   └── index.ts            # Phase, CachedElements, TheSwitchProps
│       └── styles/
│           └── switch.css          # .landing-grid transition styles
│
├── pages/                        # Astro file-based routing (kept at root)
│   └── index.astro               # Single page assembly
│
└── shared/                       # Shared infrastructure (cross-feature)
    ├── components/
    │   └── ui/
    │       ├── external-link.astro   # Reusable <a> with rel/target attrs
    │       ├── source-citation.astro # "Source: Author Year" link pattern
    │       └── section-heading.astro # Consistent heading with color glow
    ├── config/
    │   ├── constants.ts              # STORAGE_KEY, ARIA text, revealed texts
    │   └── design-tokens.ts          # Color values, font stacks (mirrors tailwind.config)
    ├── hooks/
    │   └── use-reduced-motion.ts     # prefers-reduced-motion reactive hook
    ├── layouts/
    │   └── Layout.astro              # Base HTML layout, imports split CSS
    ├── lib/
    │   └── gsap.ts                   # GSAP instance with ScrollToPlugin registered
    ├── styles/
    │   ├── base.css                  # @tailwind directives, html/body, ::selection
    │   ├── animations.css            # Shared keyframes (typing, logo-glitch)
    │   └── accessibility.css         # Skip link, focus-visible, reduced-motion
    └── types/
        ├── statistics.ts             # Stat, Testimony, Resource interfaces
        └── common.ts                 # Phase type, shared utility types
```

### Deviations from Original Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| `src/app/layouts/` + `src/app/pages/` | `src/pages/` + `src/shared/layouts/` | Astro requires `src/pages/` for file-based routing; moving would require complex config |
| Top-level `src/components/`, `src/config/`, `src/hooks/`, `src/lib/`, `src/styles/`, `src/types/` | All under `src/shared/` | Consolidating shared infra into one `shared/` folder is cleaner and more explicit |
| `src/utils/cn.ts` | Not created | Not needed — no className merging complexity |
| `flash-overlay.tsx` shared component | Kept inside TheSwitch | Flash overlay is only used by TheSwitch, not truly shared |

### Key Principles Applied

| Bulletproof React Principle | How It's Applied | Status |
|-----------------------------|------------------|--------|
| **Feature-based modules** | 3 features: `bait-phase`, `reveal-phase`, `the-switch` | ✅ |
| **Colocate things** | Each feature has its own components/, styles/, types/, lib/ | ✅ |
| **Shared components in `shared/components/`** | 3 reusable UI primitives (external-link, source-citation, section-heading) | ✅ |
| **Unidirectional code flow** | `shared/` → `features/` → `pages/` (never backwards) | ✅ |
| **No cross-feature imports** | Features don't import from each other; composed at page level | ✅ |
| **Absolute imports** | `@/features/bait-phase/...`, `@/shared/components/ui/...`, `@/shared/config/...` | ✅ |
| **Data integrity** | `src/data/` remains the single source of truth; components import, not duplicate | ✅ |
| **Split large files** | TheSwitch.tsx (554 lines) → 6 focused modules; global.css (334 lines) → 6 files | ✅ |

---

## 3. Migration Steps

### Phase 0: Project Standards (no file moves)

- [x] **0.1** Add `@/` path alias to `tsconfig.json` ✅ (`paths` in tsconfig.json + Vite `resolve.alias` in astro.config.mjs)
- [ ] **0.2** Install & configure ESLint (with `eslint-plugin-check-file` for naming conventions)
- [ ] **0.3** Install & configure Prettier
- [ ] **0.4** Install & configure Husky + lint-staged
- [x] **0.5** Verify `astro build` still works after config changes ✅

### Phase 1: Extract shared types & config

- [x] **1.1** Create `src/shared/types/statistics.ts` — Statistic, Testimony, Resource interfaces ✅
- [x] **1.2** Create `src/shared/types/common.ts` — `Phase = 'bait' | 'switching' | 'revealed'` ✅
- [x] **1.3** Create `src/shared/config/constants.ts` — STORAGE_KEY, REVEALED_*, ARIA_ANNOUNCEMENT ✅
- [x] **1.4** Create `src/shared/config/design-tokens.ts` — colors and fonts mirroring tailwind.config ✅
- [x] **1.5** Update `tsconfig.json` with path aliases ✅ (done in Phase 0)

### Phase 2: Extract shared hooks & lib

- [x] **2.1** Create `src/shared/lib/gsap.ts` — GSAP + ScrollToPlugin registration ✅
- [x] **2.2** Create `src/shared/hooks/use-reduced-motion.ts` — reactive prefers-reduced-motion hook ✅
- [x] **2.3** ~~Create `src/utils/cn.ts`~~ — **Skipped** (not needed)

### Phase 3: Split global.css into layered stylesheets

- [x] **3.1** Create `src/shared/styles/base.css` — @tailwind directives, fonts, @layer base ✅
- [x] **3.2** Create `src/shared/styles/animations.css` — 6 shared @keyframes ✅
- [x] **3.3** Create `src/shared/styles/accessibility.css` — skip-to-content, focus-visible, reduced-motion ✅
- [x] **3.4** Create `src/features/bait-phase/styles/bait.css` — .bait-state vars, .neon-glow, .card-flip, .static-noise, button styles ✅
- [x] **3.5** Create `src/features/reveal-phase/styles/reveal.css` — .reveal-state vars, .reveal-section, vignette, blood drips, scroll-snap ✅
- [x] **3.6** Create `src/features/the-switch/styles/switch.css` — .landing-grid transition styles ✅
- [x] **3.7** Update `Layout.astro` to import all 6 split stylesheets ✅
- [x] **3.8** Delete original `src/styles/global.css` ✅
- [x] **3.9** Verify all styles render correctly ✅

### Phase 4: Create feature folder structure & move components

#### 4A: Bait Phase Feature

- [x] **4A.1** Create `src/features/bait-phase/components/` directory ✅
- [x] **4A.2** Move `ProfileCard.astro` → `src/features/bait-phase/components/profile-card.astro` ✅
- [x] **4A.3** Move `LandingGrid.astro` → `src/features/bait-phase/components/landing-grid.astro` ✅
- [x] **4A.4** Extract `botProfiles` → `src/features/bait-phase/data/bot-profiles.ts` ✅
- [x] **4A.5** Move `PlatformHeader.astro` → `src/features/bait-phase/components/platform-header.astro` ✅
- [x] **4A.6** Move `PlatformFooter.astro` → `src/features/bait-phase/components/platform-footer.astro` ✅

#### 4B: Reveal Phase Feature

- [x] **4B.1** Create `src/features/reveal-phase/components/` directory ✅
- [x] **4B.2** Move `TheRealCost.astro` → `the-real-cost.astro` (uses inline curated data + SectionHeading/SourceCitation) ✅
- [x] **4B.3** Move `BehindTheScreen.astro` → `behind-the-screen.astro` + imports from `@/data/testimonies.json` ✅
- [x] **4B.4** Move `TheMachine.astro` → `the-machine.astro` ✅
- [x] **4B.5** Move `WhatYouCanDo.astro` → `what-you-can-do.astro` + imports from `@/data/resources.json` ✅
- [x] **4B.6** Move `WhyIBuiltThis.astro` → `why-i-built-this.astro` ✅

#### 4C: The Switch Feature (React Island)

- [x] **4C.1** Create `src/features/the-switch/` directory structure (components/, hooks/, lib/, types/, styles/) ✅
- [x] **4C.2** Extract `types/index.ts` — Phase re-export, CachedElements, TheSwitchProps ✅
- [x] **4C.3** Extract `lib/dom-cache.ts` — getCachedElements() ✅
- [x] **4C.4** Extract `lib/apply-revealed.ts` — applyRevealedState() ✅
- [x] **4C.5** Extract `lib/switch-animation.ts` — createSwitchTimeline() with 14 GSAP steps ✅
- [x] **4C.6** Extract `hooks/use-switch-phase.ts` — phase state, sessionStorage, debug mode, event delegation, MutationObserver ✅
- [x] **4C.7** Slim down `components/the-switch.tsx` — ~34 lines (hook + JSX render) ✅

### Phase 5: Extract shared UI components

- [x] **5.1** Create `src/shared/components/ui/external-link.astro` — reusable `<a>` with `rel="noopener noreferrer" target="_blank"` ✅
- [x] **5.2** Create `src/shared/components/ui/source-citation.astro` — "Source: Author Year" link pattern ✅
- [x] **5.3** Create `src/shared/components/ui/section-heading.astro` — mono font heading with color glow ✅
- [x] **5.4** Refactor reveal-phase components to use shared UI components ✅

### Phase 6: Update app layer (pages & layout)

- [x] **6.1** Move `src/layouts/Layout.astro` → `src/shared/layouts/Layout.astro` ✅ (kept in `shared/` instead of `app/` — see deviations)
- [x] **6.2** ~~Move pages to `src/app/pages/`~~ — **Skipped** (Astro requires `src/pages/` for file-based routing)
- [x] **6.3** Update all imports in `index.astro` to use `@/` absolute imports from features ✅
- [x] **6.4** ~~Update `astro.config.mjs`~~ — Not needed (pages stayed in `src/pages/`)
- [x] **6.5** Verify `astro build` produces identical output ✅

### Phase 7: Cleanup & Verification

- [x] **7.1** Delete old `src/components/`, `src/config/`, `src/hooks/`, `src/lib/`, `src/styles/`, `src/types/`, `src/layouts/` ✅
- [x] **7.2** ~~Delete empty `src/layouts/`~~ — merged into 7.1 ✅
- [ ] **7.3** Run ESLint on entire codebase, fix any issues
- [ ] **7.4** Run Prettier on entire codebase
- [ ] **7.5** Run `astro build` — must succeed with zero errors
- [ ] **7.6** Visual regression test: compare screenshots before/after (both bait and reveal states)
- [ ] **7.7** Test `?debug=1` mode still works
- [ ] **7.8** Test `sessionStorage` persistence (returning visitor flow)
- [ ] **7.9** Test `prefers-reduced-motion` flow
- [ ] **7.10** Update `AGENTS.md` and `.github/copilot-instructions.md` to reflect new structure
- [ ] **7.11** Update `.github/instructions/*.md` `applyTo` globs for new paths

---

## 4. File Mapping (Before → After)

> ✅ All migrations complete as of Feb 11, 2026.

| Before | After | Status |
|--------|-------|--------|
| `src/components/ProfileCard.astro` | `src/features/bait-phase/components/profile-card.astro` | ✅ Done |
| `src/components/LandingGrid.astro` | `src/features/bait-phase/components/landing-grid.astro` | ✅ Done |
| `src/components/PlatformHeader.astro` | `src/features/bait-phase/components/platform-header.astro` | ✅ Done |
| `src/components/PlatformFooter.astro` | `src/features/bait-phase/components/platform-footer.astro` | ✅ Done |
| `src/components/TheRealCost.astro` | `src/features/reveal-phase/components/the-real-cost.astro` | ✅ Done |
| `src/components/BehindTheScreen.astro` | `src/features/reveal-phase/components/behind-the-screen.astro` | ✅ Done |
| `src/components/TheMachine.astro` | `src/features/reveal-phase/components/the-machine.astro` | ✅ Done |
| `src/components/WhatYouCanDo.astro` | `src/features/reveal-phase/components/what-you-can-do.astro` | ✅ Done |
| `src/components/WhyIBuiltThis.astro` | `src/features/reveal-phase/components/why-i-built-this.astro` | ✅ Done |
| `src/components/TheSwitch.tsx` | `src/features/the-switch/` (6 modules) | ✅ Done |
| `src/layouts/Layout.astro` | `src/shared/layouts/Layout.astro` | ✅ Done |
| `src/pages/index.astro` | `src/pages/index.astro` | ✅ Kept (Astro requirement) |
| `src/styles/global.css` | `src/shared/styles/` (3 files) + feature styles (3 files) | ✅ Done |
| `src/data/*.json` | `src/data/*.json` | ✅ Unchanged |
| _(new)_ | `src/shared/config/constants.ts` | ✅ Created |
| _(new)_ | `src/shared/config/design-tokens.ts` | ✅ Created |
| _(new)_ | `src/shared/types/statistics.ts` | ✅ Created |
| _(new)_ | `src/shared/types/common.ts` | ✅ Created |
| _(new)_ | `src/shared/lib/gsap.ts` | ✅ Created |
| _(new)_ | `src/shared/hooks/use-reduced-motion.ts` | ✅ Created |
| _(new)_ | `src/shared/components/ui/external-link.astro` | ✅ Created |
| _(new)_ | `src/shared/components/ui/source-citation.astro` | ✅ Created |
| _(new)_ | `src/shared/components/ui/section-heading.astro` | ✅ Created |
| _(new)_ | `src/features/bait-phase/data/bot-profiles.ts` | ✅ Created |
| _(new)_ | `src/features/the-switch/hooks/use-switch-phase.ts` | ✅ Created |
| _(new)_ | `src/features/the-switch/lib/switch-animation.ts` | ✅ Created |
| _(new)_ | `src/features/the-switch/lib/apply-revealed.ts` | ✅ Created |
| _(new)_ | `src/features/the-switch/lib/dom-cache.ts` | ✅ Created |
| _(new)_ | `src/features/the-switch/types/index.ts` | ✅ Created |

---

## 5. Implementation Tasks

### Task Dependency Graph

```
Phase 0 (Standards)
  └─► Phase 1 (Types & Config)
       ├─► Phase 2 (Hooks & Lib)
       │    └─► Phase 4C (The Switch feature)
       ├─► Phase 3 (CSS Split)
       │    ├─► Phase 4A (Bait feature)
       │    └─► Phase 4B (Reveal feature)
       └─► Phase 5 (Shared UI)
            └─► Phase 6 (App layer)
                 └─► Phase 7 (Cleanup)
```

### Estimated Effort

| Phase | Tasks | Status | Notes |
|-------|-------|--------|-------|
| 0 — Standards | 5 | ⏳ 2/5 | `@/` alias done; ESLint/Prettier/Husky pending |
| 1 — Types & Config | 5 | ✅ 5/5 | All in `src/shared/` |
| 2 — Hooks & Lib | 3 | ✅ 2/3 | cn.ts skipped (not needed) |
| 3 — CSS Split | 9 | ✅ 9/9 | 334-line monolith → 6 files |
| 4A — Bait Feature | 6 | ✅ 6/6 | |
| 4B — Reveal Feature | 6 | ✅ 6/6 | Data dedup for testimonies + resources |
| 4C — Switch Feature | 7 | ✅ 7/7 | 554-line monolith → 6 modules |
| 5 — Shared UI | 4 | ✅ 4/4 | |
| 6 — App Layer | 5 | ✅ 4/5 | Skipped `app/` folder; pages stayed at root |
| 7 — Cleanup | 11 | ⏳ 2/11 | Old stubs deleted; testing + doc updates pending |
| **Total** | **61** | **47/61 done** | **~80% complete** |

---

## 6. Non-Goals

These Bulletproof React recommendations are **intentionally skipped** because they don't apply to this project:

| Recommendation | Why Skipped |
|----------------|-------------|
| **API layer / react-query** | No API calls — all data is static JSON at build time |
| **Router configuration** | Single page — no client-side routing |
| **Auth / RBAC / PBAC** | No users or authentication |
| **Global state management (Zustand/Redux)** | Phase state is local to TheSwitch; no global app state needed |
| **Server Components** | Astro handles SSR natively — React islands are client-only |
| **Error boundary wrapping** | Static site — no runtime data fetching that could fail |
| **Testing infrastructure** | Deferred to a future milestone (no tests exist yet) |
| **Barrel files (index.ts re-exports)** | Bulletproof React explicitly warns against barrel files for Vite tree-shaking; direct imports preferred |
| **MSW / API mocking** | No API layer to mock |
| **Cross-feature import ESLint rules** | Only 3 features with clear boundaries — enforce manually for now |

---

## Notes

- **Astro-specific**: Astro requires `src/pages/` for file-based routing. **Decision (Phase 6): kept `src/pages/` at root, moved layouts to `src/shared/layouts/`.** The `app/` layer concept was replaced by the `shared/` folder.
- **Shared folder**: All cross-feature infrastructure lives under `src/shared/` instead of scattered top-level folders. This is cleaner and more explicit about what is shared vs. feature-scoped.
- **Naming convention**: All files use kebab-case (Bulletproof React recommendation). ✅ Enforced.
- **No barrel files**: Direct imports only, e.g., `import ProfileCard from '@/features/bait-phase/components/profile-card.astro'`. ✅ Enforced.
- **Data deduplication**: `BehindTheScreen.astro` now imports from `testimonies.json`, `WhatYouCanDo.astro` from `resources.json`. `TheRealCost.astro` keeps curated inline data (intentional — it's a presentation-specific subset). ✅ Resolved.
- **TheSwitch decomposition**: 554-line monolith → 6 focused modules. The component itself is ~34 lines. ✅ Resolved.

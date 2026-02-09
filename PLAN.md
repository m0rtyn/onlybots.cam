# onlybots.cam — Implementation Plan

> Step-by-step tasks designed for delegation to subagents.
> Each task is atomic, has clear inputs/outputs, and can be executed independently where possible.

---

## Phase 1: Project Scaffold (Day 1)

### Task 1.1 — Initialize Astro + Tailwind project
**Priority:** 🔴 Critical (blocks everything)
**Estimated time:** 15 min

**Instructions:**
1. Initialize Astro project in the current workspace: `npm create astro@latest . -- --template minimal --typescript strict --install --no-git`
2. Install dependencies:
   ```
   npx astro add tailwind react
   npm install three @react-three/fiber @react-three/drei gsap @types/three
   ```
3. Configure `astro.config.mjs` with React integration (for Three.js islands)
4. Configure `tailwind.config.mjs` with custom colors:
   - `dark-bg`: `#0a0a0a`
   - `neon-pink`: `#ff2d87`
   - `electric-blue`: `#00a2ff`
   - `reveal-gray`: `#1a1a1a`
5. Create `src/styles/global.css` with:
   - Base dark theme styles
   - Font imports (Inter for bait, JetBrains Mono for reveal)
   - CSS custom properties for transition states
   - Glitch animation keyframes
6. Create base `src/layouts/Layout.astro` with HTML boilerplate, meta tags, font loading

**Output:** Working Astro project that builds and serves locally with dark theme.

---

### Task 1.2 — Create data files (statistics, testimonies, resources)
**Priority:** 🔴 Critical (content for all components)
**Estimated time:** 20 min

**Instructions:**
Create three JSON files from RESEARCH.md data:

1. **`src/data/statistics.json`** — Array of stat objects:
   ```ts
   interface Stat {
     id: string;
     baitLabel: string;      // e.g. "💰 Top Earner"
     baitValue: string;      // e.g. "$12,400/mo"
     revealStat: string;     // e.g. "Average creator earns $180/month"
     revealDetail: string;   // Extended context
     source: string;         // Short citation
     sourceUrl: string;      // Link to primary source
     category: "mental-health" | "financial" | "exploitation" | "trafficking" | "violence"
   }
   ```
   Use the "Stat Card pairings" table from RESEARCH.md as the source. Include at least 8 stat cards.

2. **`src/data/testimonies.json`** — Array of testimony objects:
   ```ts
   interface Testimony {
     id: string;
     quote: string;
     attribution: string;    // e.g. "Webcam model, Colombia"
     source: string;         // e.g. "HRW 2024"
     sourceUrl: string;
   }
   ```
   Use the "Key Quotes" section from RESEARCH.md. Include all 6 quotes.

3. **`src/data/resources.json`** — Array of resource objects:
   ```ts
   interface Resource {
     name: string;
     description: string;
     url: string;
     category: "anti-trafficking" | "research" | "support" | "reporting"
   }
   ```
   Include: Polaris Project, Not For Sale, HRW report, ICIJ report, National Human Trafficking Hotline, Exodus Road.

**Output:** Three well-structured JSON files ready for import by components.

---

## Phase 2: Landing Page — "The Bait" (Day 2)

### Task 2.1 — Build the ProfileCard component
**Priority:** 🔴 Critical
**Estimated time:** 30 min
**Dependencies:** Task 1.1

**Instructions:**
Create `src/components/ProfileCard.astro`:
- A card (approx. 280×380px) with dark background (#111)
- Rounded corners, subtle border glow (neon-pink on hover)
- Contains:
  - Blurred/glitched placeholder avatar (120×120px circle) with CSS `filter` + `mix-blend-mode` for uncanny effect
  - Bot-style name: "Model_4827", "Unit_0093", "Entity_7741" etc.
  - "🔥 Live Now" or "✨ New" badge (randomly assigned)
  - Fake fan count: "❤️ 4,892 fans"
  - Fake rating: "⭐ 4.9"
  - Price tag: "$9.99/mo"
  - "Subscribe" button (neon-pink, full-width at bottom)
- Card should accept props: `name`, `badge`, `fans`, `rating`, `price`, `avatarSeed`
- Add `data-stat-id` attribute linking to corresponding stat from statistics.json
- Card has two CSS states: `.bait-state` (default) and `.reveal-state` (hidden initially)
- The back of the card (reveal state) shows the corresponding statistic

**Output:** Reusable ProfileCard with bait/reveal dual state.

---

### Task 2.2 — Build the LandingGrid component
**Priority:** 🔴 Critical
**Estimated time:** 20 min
**Dependencies:** Task 2.1, Task 1.2

**Instructions:**
Create `src/components/LandingGrid.astro`:
- Responsive CSS Grid: 3 columns desktop, 2 tablet, 1 mobile
- Gap: 1.5rem
- Load statistics from `src/data/statistics.json`
- Render 8 ProfileCard components with synthetic bot data
- Each card linked to a stat entry via `data-stat-id`
- Above the grid:
  - Site header: "onlybots.cam" in bold sans-serif with neon-pink accent
  - Tagline: "They're always online. They never say no."
  - Fake navigation: "Explore", "Categories", "New", "Top Rated" (non-functional links)
  - Notification counter: "1,247 models online now" (animated dot)
- Below the grid:
  - Fake "Load More" button
  - Fake chat bubble: "Bot is typing..." (animated dots)

**Output:** Complete landing grid that looks like a real platform homepage.

---

### Task 2.3 — Build the fake platform UI chrome
**Priority:** 🟡 Medium
**Estimated time:** 15 min
**Dependencies:** Task 1.1

**Instructions:**
Create `src/components/PlatformHeader.astro`:
- Sticky top navbar, dark (#0a0a0a), height 60px
- Logo: "onlybots.cam" text with `.cam` in neon-pink
- Fake search bar (non-functional, placeholder: "Search models...")
- Fake user avatar (small circle, top-right)
- Fake notification bell with red badge ("3")

Create `src/components/PlatformFooter.astro`:
- Minimal footer for bait state
- Legal disclaimer (satire notice): "This is a work of satire and social commentary. Not affiliated with any commercial platform."
- Post-switch: transforms into resource links and "Why I built this" section

**Output:** Header + footer that complete the platform illusion.

---

## Phase 3: The Switch (Day 3–4)

### Task 3.1 — Build TheSwitch React island (transition orchestrator)
**Priority:** 🔴 Critical (this is the core of the project)
**Estimated time:** 45 min
**Dependencies:** Task 2.1, Task 2.2

**Instructions:**
Create `src/components/TheSwitch.tsx` (React component, client:load):
- This is the central state machine that orchestrates the entire transition
- State: `phase: "bait" | "switching" | "revealed"`
- On ANY click of a "Subscribe" button, "Load More", or interactive element:
  1. Set phase to "switching"
  2. Execute the GSAP animation timeline (see below)
  3. Set phase to "revealed"
  4. Change document.title to "onlybots.cam — The Real Cost"
  5. Store state in sessionStorage (no way back on refresh)

**GSAP Animation Timeline (the hero moment):**
1. **T+0ms:** Screen flash (white overlay, opacity 0→0.8→0, 200ms)
2. **T+100ms:** CSS filter on body — `hue-rotate` and `saturate` animate from normal → 0 (color drain, 800ms ease)
3. **T+200ms:** Glitch effect — rapid `translateX` jitter on all cards (300ms)
4. **T+400ms:** Notification counter morphs: "1,247 models online" → "1,247 reported cases of coercion this year"
5. **T+500ms:** Cards begin flipping (staggered, 100ms between each, 600ms per flip using `rotateY`)
6. **T+500ms:** Background shifts to subtle static/noise texture (CSS)
7. **T+800ms:** Typing bubble types out a real statistic instead of chat
8. **T+1200ms:** Typography shifts — body font transitions to monospaced
9. **T+1500ms:** Header transforms — neon-pink drains, "Subscribe" → dead gray
10. **T+2000ms:** Reveal content sections begin fading in below the grid
11. **T+2500ms:** Three.js scene activates (if loaded)

- All timings are suggestions — tune for emotional impact
- Total transition: ~3 seconds
- Use `gsap.timeline()` with `.to()` chains
- Use `ScrollTrigger` for reveal content sections appearing on scroll

**Output:** Working transition that transforms the entire page in one dramatic sequence.

---

### Task 3.2 — Build StatCard component (reveal state of cards)
**Priority:** 🔴 Critical
**Estimated time:** 20 min
**Dependencies:** Task 1.2

**Instructions:**
Create `src/components/StatCard.astro`:
- Same dimensions as ProfileCard
- Monospaced font (JetBrains Mono)
- Dark background with subtle red/gray tint
- Contains:
  - Large stat number (e.g., "41.8%") in bold, white
  - Stat description (e.g., "Depression rate among sex workers")
  - Source citation (small, gray, with clickable link)
  - Category indicator (small colored bar at top: red for violence, blue for financial, etc.)
- This is what appears on the "back" of each ProfileCard after the flip

**Output:** StatCard component that displays sourced statistics.

---

### Task 3.3 — Build reveal content sections
**Priority:** 🔴 Critical
**Estimated time:** 40 min
**Dependencies:** Task 1.2

**Instructions:**
These sections appear below the card grid AFTER the switch. Each section fades in on scroll.

1. **`src/components/TheRealCost.astro`** — "The Real Cost"
   - Full-width section, dark background
   - One massive stat per viewport: "41.8% depression rate", "48% lifetime suicidality", "$1B in owner dividends"
   - Each stat scrolls in with GSAP ScrollTrigger
   - Monospaced type, stark white on near-black

2. **`src/components/BehindTheScreen.astro`** — "Behind the Screen"
   - Testimonies from `testimonies.json`
   - Blockquote style: large italic text, subtle left border
   - Attribution below each quote
   - Source links

3. **`src/components/TheMachine.astro`** — "The Machine"
   - Visual revenue breakdown:
     - Platform: 50–65%
     - Studio: ~25%
     - Model: as little as 10%
   - CSS bar chart or pie visualization
   - Contrast: "$1B dividends" vs "$180/month average"
   - Key stat: "49 of 50 models never saw their own terms of service"

4. **`src/components/WhatYouCanDo.astro`** — "What You Can Do"
   - Cards linking to organizations from `resources.json`
   - "Share" button with pre-filled tweet text
   - Simple, actionable design

5. **`src/components/WhyIBuiltThis.astro`** — "Why I Built This"
   - Small section at the bottom
   - Developer's personal note (placeholder text)
   - Links to source code

**Output:** Five content sections ready to render in the reveal state.

---

## Phase 4: Three.js Scene (Day 5)

### Task 4.1 — Build the Digital Cage Three.js scene
**Priority:** 🟡 Medium (enhances but not essential)
**Estimated time:** 45 min
**Dependencies:** Task 1.1

**Instructions:**
Create `src/components/DigitalCage.tsx` (React island, client:visible):
- Uses @react-three/fiber and @react-three/drei
- Scene: A slowly rotating wireframe cube/cage
  - Material: wireframe, white/gray lines, subtle opacity
  - Inside the cage: a simple humanoid silhouette (can be a flat plane with a PNG or a simple 3D figure from Drei)
  - Rotation: slow Y-axis, ~0.2 rad/s
- Background: transparent (overlays the page content)
- Lighting: subtle ambient + directional
- Post-switch behavior:
  - Cage lines turn red/dark
  - Rotation speeds up slightly
  - Silhouette "glitches" (random position jitter)
- Performance:
  - Lazy load with `client:visible`
  - Fallback: CSS animated wireframe box (pure CSS 3D transform)
  - Respect `prefers-reduced-motion`
  - Target 60fps on mid-range devices, gracefully degrade
- Position: Fixed or absolute, behind the card grid, visible as a background element
- Size: contained, not full-screen. Approx 400×400px centered.

**Output:** Atmospheric Three.js background element with bait/reveal states.

---

## Phase 5: SEO, OG, and Polish (Day 6)

### Task 5.1 — Implement SEO and Open Graph tags
**Priority:** 🔴 Critical for virality
**Estimated time:** 15 min
**Dependencies:** Task 1.1

**Instructions:**
In `src/layouts/Layout.astro`, add:
```html
<title>onlybots.cam — Coming Soon</title>
<meta name="description" content="onlybots.cam — They're always online. They never say no. But someone always pays the price." />
<meta property="og:title" content="onlybots.cam" />
<meta property="og:description" content="They're always online. They never say no. But at what cost?" />
<meta property="og:image" content="https://onlybots.cam/og-image.png" />
<meta property="og:url" content="https://onlybots.cam" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="onlybots.cam" />
<meta name="twitter:description" content="They're always online. They never say no. But at what cost?" />
<meta name="twitter:image" content="https://onlybots.cam/og-image.png" />
```
- Title changes dynamically post-switch (handled by TheSwitch.tsx)

**Output:** Proper meta tags for social sharing.

---

### Task 5.2 — Accessibility and performance audit
**Priority:** 🔴 Critical
**Estimated time:** 20 min
**Dependencies:** All previous tasks

**Instructions:**
1. Ensure all images have alt text
2. Keyboard navigation works for the switch trigger
3. `prefers-reduced-motion` disables GSAP animations, shows reveal content directly
4. `prefers-color-scheme` — not applicable (always dark)
5. All external links have `rel="noopener noreferrer"` and `target="_blank"`
6. Source links are accessible and clearly labeled
7. Run Lighthouse audit, target 95+ on all metrics
8. Ensure Three.js lazy loads and has CSS fallback
9. Total bundle (excluding Three.js) < 500KB
10. Add `aria-live` region for dynamic content changes during the switch
11. Screen reader: announce "Content has changed" when switch happens

**Output:** Accessible, performant site passing Lighthouse 95+.

---

### Task 5.3 — HTML source code Easter egg
**Priority:** 🟢 Low (nice touch)
**Estimated time:** 5 min

**Instructions:**
Add HTML comments throughout the source:
```html
<!-- While you're reading this source code, approximately 12,000 webcam sessions are active worldwide. -->
<!-- 49 of 50 webcam models never signed their own terms of service. Source: Human Rights Watch, 2024 -->
<!-- Average webcam model receives 10% of the revenue they generate. The platform keeps the rest. -->
<!-- If you're a developer, consider how your skills could help: polarisproject.org -->
```

**Output:** Easter eggs visible to developers who view source.

---

## Phase 6: Assembly and Index Page (Day 6)

### Task 6.1 — Assemble the index page
**Priority:** 🔴 Critical
**Estimated time:** 20 min
**Dependencies:** All component tasks

**Instructions:**
Create/update `src/pages/index.astro`:
```astro
---
import Layout from '../layouts/Layout.astro';
import PlatformHeader from '../components/PlatformHeader.astro';
import LandingGrid from '../components/LandingGrid.astro';
import TheSwitch from '../components/TheSwitch.tsx';
import TheRealCost from '../components/TheRealCost.astro';
import BehindTheScreen from '../components/BehindTheScreen.astro';
import TheMachine from '../components/TheMachine.astro';
import WhatYouCanDo from '../components/WhatYouCanDo.astro';
import WhyIBuiltThis from '../components/WhyIBuiltThis.astro';
import PlatformFooter from '../components/PlatformFooter.astro';
---

<Layout>
  <TheSwitch client:load>
    <!-- Bait state -->
    <PlatformHeader />
    <LandingGrid />
    
    <!-- Reveal state (hidden until switch) -->
    <TheRealCost />
    <BehindTheScreen />
    <TheMachine />
    <WhatYouCanDo />
    <WhyIBuiltThis />
  </TheSwitch>
  <PlatformFooter />
</Layout>
```
- Wire up all components
- Ensure TheSwitch orchestrates visibility of reveal sections
- Test full flow: land → click → switch → scroll through reveal content

**Output:** Complete, working single-page experience.

---

## Phase 7: Deployment (Day 7)

### Task 7.1 — Deploy to Vercel or Cloudflare Pages
**Priority:** 🔴 Critical
**Estimated time:** 15 min

**Instructions:**
1. Ensure `astro.config.mjs` has `output: 'static'`
2. Add Vercel adapter OR configure for Cloudflare Pages
3. Set up deployment from git repo
4. Configure custom domain: `onlybots.cam`
5. Set up SSL
6. Test production build locally: `npm run build && npm run preview`
7. Deploy and verify on production domain

**Output:** Live site at https://onlybots.cam

---

### Task 7.2 — Add privacy-respecting analytics
**Priority:** 🟡 Medium
**Estimated time:** 10 min

**Instructions:**
1. Set up Plausible or Umami (self-hosted preferred)
2. Add tracking script to Layout.astro
3. Configure custom events:
   - `switch_triggered` — when the transition fires
   - `reveal_scrolled` — when user scrolls through reveal content
   - `resource_clicked` — when user clicks an org link
   - `share_clicked` — when user clicks share button
4. No cookies, GDPR-compliant

**Output:** Analytics tracking key engagement metrics.

---

## Subagent Delegation Summary

| # | Task | Can Be Parallelized With | Estimated Time |
|---|------|--------------------------|---------------|
| 1.1 | Init Astro project | — | 15 min |
| 1.2 | Create data JSON files | 1.1 (after scaffold) | 20 min |
| 2.1 | ProfileCard component | 2.3 | 30 min |
| 2.2 | LandingGrid component | — (needs 2.1) | 20 min |
| 2.3 | Platform header/footer | 2.1 | 15 min |
| 3.1 | TheSwitch orchestrator | 3.2, 3.3 (partial) | 45 min |
| 3.2 | StatCard component | 3.1 | 20 min |
| 3.3 | Reveal content sections | 3.2 | 40 min |
| 4.1 | Three.js Digital Cage | Independent | 45 min |
| 5.1 | SEO / OG tags | 5.3 | 15 min |
| 5.2 | Accessibility audit | — (needs all) | 20 min |
| 5.3 | Source code Easter egg | 5.1 | 5 min |
| 6.1 | Assemble index page | — (needs all) | 20 min |
| 7.1 | Deploy | — (needs 6.1) | 15 min |
| 7.2 | Analytics | 7.1 | 10 min |

### Optimal Execution Order (with parallelization):

```
1.1 ──→ 1.2 ──→ ┬── 2.1 + 2.3 (parallel) ──→ 2.2
                 │
                 └── 4.1 (independent, start early)
                 
2.2 ──→ ┬── 3.1 + 3.2 (parallel) ──→ 3.3
        │
        └── 5.1 + 5.3 (parallel)

3.3 ──→ 6.1 ──→ 5.2 ──→ 7.1 ──→ 7.2
```

**Total estimated time:** ~5–6 hours of focused work (with parallelization)

---

*Created: 2026-02-09*

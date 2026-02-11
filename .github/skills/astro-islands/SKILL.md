---
name: astro-islands
description: Astro island architecture patterns for onlybots.cam including hydration directives, inter-island communication, and component composition. Use when working with Astro components and React islands.
---

# Astro Islands Architecture Skill

## Hydration Directives

| Directive | When it hydrates | Use for |
|-----------|-----------------|---------|
| `client:load` | Immediately on page load | TheSwitch.tsx — must be interactive ASAP |
| `client:idle` | When browser is idle | Low-priority interactivity |
| `client:media` | When media query matches | Responsive interactive elements |
| (none) | Never — server only | Static Astro components |

## Component Architecture

```
index.astro
├── Layout.astro (server)
├── TheSwitch.tsx (client:load) ← orchestrates everything
│   ├── PlatformHeader.astro (server, slotted)
│   └── main#main-content
│       └── LandingGrid.astro (server, slotted)
│           └── ProfileCard.astro (server, × 8+)
├── #reveal-content
│   ├── TheRealCost.astro (server, .reveal-section)
│   ├── BehindTheScreen.astro (server, .reveal-section)
│   ├── TheMachine.astro (server, .reveal-section)
│   ├── WhatYouCanDo.astro (server, .reveal-section)
│   └── WhyIBuiltThis.astro (server, .reveal-section)
└── PlatformFooter.astro (server)
```

## Inter-Island Communication

Islands cannot share React state. They communicate through the DOM:

```typescript
// TheSwitch.tsx — sets body class
document.body.classList.add('reveal-state');
```

## Slotting Astro Content into React Islands

```astro
<!-- index.astro -->
<TheSwitch client:load>
  <PlatformHeader />  <!-- Astro component slotted as children -->
  <main>
    <LandingGrid />
  </main>
</TheSwitch>
```

```tsx
// TheSwitch.tsx
export default function TheSwitch({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;  // Astro HTML passed through
}
```

## Data Loading Pattern

```astro
---
// Astro frontmatter — runs at build time (SSG)
import statistics from '../data/statistics.json';
import type { Stat } from '../types';

const stats = statistics as Stat[];
---

{stats.map((stat) => (
  <ProfileCard
    name={`Unit_${stat.id}`}
    statId={stat.id}
    baitLabel={stat.baitLabel}
    baitValue={stat.baitValue}
    revealStat={stat.revealStat}
    source={stat.source}
    sourceUrl={stat.sourceUrl}
  />
))}
```

---
name: build-component
description: Scaffold a new Astro or React component following onlybots.cam patterns
agent: agent
tools: ['read', 'edit/editFiles', 'search']
argument-hint: "Component name and purpose, e.g. 'StatCard - reveal side of profile cards'"
---

# Build a New Component

Create a new component following the onlybots.cam architecture.

## Decision: Astro or React?

- Use **`.astro`** for static/server-rendered content (the default)
- Use **`.tsx` React island** ONLY if the component requires:
  - Client-side state management
  - Event handlers that can't be inline `<script>`
  - GSAP timeline orchestration

## Astro component template

```astro
---
// Props interface
interface Props {
  // typed props here
}

const { } = Astro.props;

// Data imports if needed
import statistics from '../data/statistics.json';
---

<section class="component-name">
  <!-- Semantic HTML with Tailwind classes -->
  <!-- Support both bait-state and reveal-state -->
</section>
```

## React island template

```tsx
import { useCallback, useEffect, useRef, useState } from 'react';

interface ComponentProps {
  // typed props
}

export default function ComponentName({ }: ComponentProps) {
  // Respect reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

## After creation

1. Add the component to [index.astro](../../src/pages/index.astro) in the correct position
2. Ensure it supports both `.bait-state` and `.reveal-state` if visible in both phases
3. Use Tailwind classes from [tailwind.config.mjs](../../tailwind.config.mjs)

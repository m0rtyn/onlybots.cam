---
applyTo: "**/*.css"
---

# CSS Guidelines — onlybots.cam

- Use `@tailwind base`, `@tailwind components`, `@tailwind utilities` directives.
- Custom CSS belongs in `@layer components` or `@layer utilities` blocks.
- Two CSS state classes on `<body>`: `.bait-state` (default) and `.reveal-state` (after switch).
- CSS custom properties for state: `--accent` changes from `#ff2d87` (bait) to `#666666` (reveal).
- Neon glow: `box-shadow` with neon-pink rgba values. Text glow: `text-shadow`.
- Card flip: `transform-style: preserve-3d` + `transform: rotateY(180deg)` on `.flipped`.
- Static noise background: CSS pattern or pseudo-element, applied via `.static-noise` class.
- Glitch animation: rapid `translateX/Y` jitter with `steps()` timing.
- Fonts: Inter (sans) for bait phase, JetBrains Mono (mono) for reveal phase.
- Always include `prefers-reduced-motion` media query to disable animations.

---
name: gsap-animation
description: GSAP animation patterns for onlybots.cam including timeline composition, ScrollTrigger integration, the Switch transition sequence, and reduced-motion compliance. Use when creating or editing GSAP animations.
---

# GSAP Animation Skill

## Timeline Composition Pattern

```typescript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugin once at module level
gsap.registerPlugin(ScrollTrigger);

// Create timeline (paused for programmatic control)
const tl = gsap.timeline({ paused: true });

// Chain animations with absolute position (seconds from start)
tl.to(target, { props, duration, ease }, startTime)
  .to(target, { props, duration, ease }, startTime);

// Play programmatically
tl.play();

// Cleanup in React useEffect
return () => { tl.kill(); };
```

## The Switch Timeline Reference

Total duration: ~3 seconds. Key offsets:

| Offset | Target | Properties | Duration | Ease |
|--------|--------|-----------|----------|------|
| 0.0s | `.flash-overlay` | opacity: 0→0.8 | 0.1s | none |
| 0.1s | `.flash-overlay` | opacity: 0.8→0 | 0.1s | none |
| 0.1s | `body` | filter: saturate(0) brightness(0.8) | 0.8s | power2.inOut |
| 0.2s | `.card-flip` | x: random(-3,3) | 0.3s | steps(6) |
| 0.5s | `.card-flip` | rotateY: 180 | 0.6s stagger 0.1 | power2.inOut |
| 1.2s | `body` | add class `font-mono` | instant | — |
| 1.5s | `.platform-header` | opacity: 0.5 | 0.5s | power2.out |
| 2.0s | `.reveal-section` | opacity: 0→1, y: 40→0 | 0.8s stagger 0.2 | power2.out |

## ScrollTrigger for Reveal Sections

```typescript
gsap.from('.reveal-section', {
  scrollTrigger: {
    trigger: '.reveal-section',
    start: 'top 80%',
    toggleActions: 'play none none none',
  },
  opacity: 0,
  y: 40,
  duration: 0.8,
  stagger: 0.2,
});
```

## Reduced Motion Pattern

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Skip animation — apply final state immediately
  gsap.set(target, { /* final properties */ });
  return;
}
```

## Ease Reference

- Smooth transitions: `power2.inOut`
- Exit animations: `power2.out`
- Glitch/digital effects: `steps(N)` or `none`
- Bounce (avoid on this project): `bounce.out`

## Common Mistakes to Avoid

- Forgetting to `kill()` timelines on component unmount → memory leak
- Using `gsap.to` on unmounted DOM nodes → warnings
- Not registering ScrollTrigger plugin before use
- Nested timelines (use flat timeline with position offsets instead)
- Animating `transform` when card-flip uses CSS `transform-style: preserve-3d` — use GSAP's native transform properties

# 🩸 Blood Drip Effect — Exec Report for Next Agent

## Goal
Add animated blood streaks dripping from:
1. The **logo** ("onlybots.cam") in the sticky header
2. The **"The Real Cost"** heading in `TheRealCost.astro`

These should only appear in **reveal state** (after the switch animation fires and `body` gets class `.reveal-state`).

---

## Current State: VISIBLE BUT STATIC (not animating)

The drip spans are now **visible** in reveal state — they show as static red streaks below the logo and heading. However, the CSS animation is not running, so they don't move or pulse.

### Root Cause: `animation` shorthand overrides inline duration/delay

Each drip `<span>` has inline styles for per-drip timing:
```html
<span class="logo-drip" style="... animation-delay:0.8s; animation-duration:3.5s;" />
```

But the scoped CSS uses the **`animation` shorthand**:
```css
:global(.reveal-state) .logo-drip {
  display: block;
  animation: logoDrip ease-in-out infinite;
}
```

**The `animation` shorthand resets ALL `animation-*` sub-properties**, including `animation-duration` and `animation-delay`, back to their initial values (`0s`). This overrides the inline `animation-duration` and `animation-delay` on each span, making the animation duration `0s` — it completes instantly, so nothing moves.

### The Fix

Replace the `animation` shorthand with **individual properties** so inline `duration` and `delay` are preserved:

**In `PlatformHeader.astro` scoped `<style>`:**
```css
:global(.reveal-state) .logo-drip {
  display: block;
  animation-name: logoDrip;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
```

**In `TheRealCost.astro` scoped `<style>`:**
```css
:global(.reveal-state) .heading-drip {
  display: block;
  animation-name: headingDrip;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
```

This preserves the per-span inline `animation-delay` and `animation-duration` values while applying the shared animation name, easing, and iteration count from CSS.

---

## History of Attempts

### Attempt 1: Styles in `global.css` inside `@layer components`
- Animated `height` from `0` → `40px` + `opacity` + `top`
- **Failed:** DevTools showed elements at `3×0` — animating `height` from 0 never caused paint. Tailwind `@layer` specificity issues.

### Attempt 2: `scaleY` instead of `height` (still in `@layer`)
- Fixed `height: 45px` + `transform: scaleY(0)` → `scaleY(1)` animation
- **Failed:** `@layer components` block was being purged or overridden.

### Attempt 3: Scoped `<style>` blocks + `opacity: 0` base
- Moved styles to component-level `<style>` blocks with `:global(.reveal-state)` selector
- Base `.logo-drip { opacity: 0; transform: scaleY(0); }`
- **Failed:** Base `opacity: 0` prevented animation from ever making elements visible.

### Attempt 4: `display: none` → `display: block` toggle ← CURRENT
- Changed base to `display: none`, reveal rule adds `display: block`
- **Partially fixed:** Elements are now visible! But animation doesn't run because `animation` shorthand overrides inline `animation-duration`/`animation-delay` to `0s`.

---

## Current File Locations

| File | What's there |
|------|-------------|
| `src/components/PlatformHeader.astro` | Lines 15-20: 5 `<span class="logo-drip">` with inline `left`, `width`, `height`, `animation-delay`, `animation-duration`. Lines 82-97: Scoped `<style>` with `.logo-drip` base (`display: none`) + `:global(.reveal-state) .logo-drip` (broken `animation` shorthand) + `@keyframes logoDrip` |
| `src/components/TheRealCost.astro` | Lines 47-53: 7 `<span class="heading-drip">` with same inline pattern. Lines 86-106: Scoped `<style>` with `.heading-drip` base + `:global(.reveal-state) .heading-drip` (broken `animation` shorthand) + `@keyframes headingDrip` |
| `src/styles/global.css` | Logo glitch/flicker CSS (works fine). Old drip CSS has been fully removed. |

---

## How to Verify After Fix

1. `bun run dev` → open `http://localhost:4321/?debug=1`
2. Click any "Subscribe" button to trigger the switch
3. After transition, inspect a `.logo-drip` span in DevTools:
   - Computed `animation-duration` should match inline style (e.g. `3.5s`), NOT `0s`
   - Computed `animation-delay` should match inline style (e.g. `0.8s`), NOT `0s`
   - Computed `animation-name` should be `logoDrip`
   - Element should have nonzero `height` and `width`
   - Opacity should be cycling (0 → 0.9 → 0.85 → 0.65 → 0)
4. Visually: red streaks should drip down from the logo and heading with staggered timing

---

## What IS Working
- Logo text turns blood red with glitch animation ✅
- Logo `.cam` flickers ✅
- Header border turns crimson ✅
- Heading colors (TheRealCost, BehindTheScreen, TheMachine, WhatYouCanDo) all show accent colors ✅
- Red vignette overlay on body ✅
- Body filter lifts to allow saturated colors ✅
- Auto-scroll to first reveal section ✅
- Bait content collapses ✅
- **Blood drip spans visible in reveal state** ✅ (new!)

## What's Broken
- **Blood drip animation not running** — `animation` shorthand kills inline durations (fix above)

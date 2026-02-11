---
applyTo: "**/*.tsx"
---

# React Island Guidelines — onlybots.cam

- React components are Astro islands — only one exists: `TheSwitch.tsx` (`client:load`).
- Strict TypeScript: no `any`, no `@ts-ignore`. All props must have explicit interfaces.
- GSAP timelines must be cleaned up in `useEffect` return: `tl.kill()`.
- ScrollTrigger instances must be killed on unmount: `ScrollTrigger.getAll().forEach(t => t.kill())`.
- Always respect `prefers-reduced-motion`: check `window.matchMedia('(prefers-reduced-motion: reduce)')`.
- Islands communicate via DOM (classList, MutationObserver), not React context or props.
- TheSwitch uses `sessionStorage` key `onlybots-switched` — once revealed, no going back.
- Use `useCallback` for event handlers, `useRef` for DOM refs and GSAP timeline refs.

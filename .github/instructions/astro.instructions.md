---
applyTo: "**/*.astro"
---

# Astro Component Guidelines — onlybots.cam

- Use Astro components for all static/server-rendered content. React islands (.tsx) only for interactivity.
- Import data from `src/data/*.json` in the frontmatter block.
- Use Tailwind utility classes; custom CSS only when necessary.
- Every visible component must support both `.bait-state` and `.reveal-state` CSS contexts on `<body>`.
- Reveal sections must have class `reveal-section` and start hidden: `style="opacity: 0; transform: translateY(40px);"` — TheSwitch.tsx animates them in.
- Interactive cards need class `card-flip` and `data-stat-id` linking to statistics.json.
- All external links: `rel="noopener noreferrer" target="_blank"`.
- Use semantic HTML: proper heading hierarchy, landmarks (`<main>`, `<section>`, `<nav>`, `<footer>`).
- Profile images use CSS `filter` + `mix-blend-mode` for uncanny glitch effect, never real photos.

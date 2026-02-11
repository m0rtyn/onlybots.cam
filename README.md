# onlybots.cam

> They're always online. They never say no. But someone always pays the price.

**onlybots.cam** is a satirical art-activism website disguised as an AI webcam companion platform. Click any button and the glossy interface dissolves — revealing sourced statistics about the webcam industry: exploitation, trafficking, depression, and financial abuse.

🔗 **[onlybots.cam](https://onlybots.cam)**

---

## How It Works

1. **The Bait** — Visitors land on what looks like a typical webcam/AI companion platform: profile cards, Subscribe buttons, "Live Now" badges
2. **The Switch** — Click any interactive element and the page transforms in a 3-second GSAP animation: color drains, cards flip, typography shifts to monospaced
3. **The Reveal** — Real statistics, testimonies from former webcam workers, revenue breakdowns, and links to anti-trafficking organizations
4. **No Way Back** — Once switched, `sessionStorage` preserves the reveal state. The experience is one-way.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Astro 5](https://astro.build) (static output) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com) |
| Interactivity | [React 19](https://react.dev) (Astro island: `client:load`) |
| Animations | [GSAP](https://gsap.com) (timeline + ScrollTrigger) |
| Language | TypeScript (strict) |
| Analytics | [Plausible](https://plausible.io) (privacy-respecting, no cookies) |

## Project Structure

```
src/
├── data/                    # statistics.json, testimonies.json, resources.json
├── features/
│   ├── bait-phase/          # Profile cards, landing grid, platform header/footer
│   ├── reveal-phase/        # 5 content sections (TheRealCost, BehindTheScreen, etc.)
│   └── the-switch/          # React island + GSAP animation + state management
├── pages/
│   └── index.astro          # Single page assembly
└── shared/
    ├── components/ui/       # Reusable UI atoms
    ├── config/              # Constants, design tokens
    ├── hooks/               # useReducedMotion
    ├── layouts/             # Layout.astro
    ├── lib/                 # GSAP setup
    ├── styles/              # Base, animations, accessibility CSS
    └── types/               # Shared TypeScript interfaces
```

## Data Integrity

Every statistic on the site links to its primary source — peer-reviewed studies, investigative reports, or NGO publications. The full source index is in [RESEARCH.md](docs/RESEARCH.md).

Key sources:
- [Human Rights Watch (2024)](https://www.hrw.org/report/2024/12/09/i-learned-how-say-no/labor-abuses-sexual-exploitation-colombian-webcam-studios) — Labor abuses in Colombian webcam studios
- [ICIJ (2024)](https://www.icij.org/news/2024/12/as-billion-dollar-webcam-industry-booms-models-suffer-at-hands-of-colombian-studios/) — Webcam industry investigation
- [Beattie et al. (2020)](https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1003297) — Mental health among sex workers (PLOS Medicine)
- [Donevan (2025)](https://www.tandfonline.com/doi/full/10.1080/08039488.2025.2464634) — Violence in pornography production

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Debug Mode

Add `?debug=1` to the URL to reset `sessionStorage` and replay the switch animation.

## Accessibility

- `prefers-reduced-motion` — skips all animations, shows reveal content directly
- `aria-live` region announces content changes during the switch
- Full keyboard navigation (Enter/Space on trigger elements)
- Skip-to-content link
- All external links open in new tabs with `rel="noopener noreferrer"`

## Legal

This is a work of satire and social commentary. Not affiliated with any commercial platform.

## License

MIT

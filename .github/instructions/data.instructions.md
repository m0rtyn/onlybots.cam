---
applyTo: "src/data/**/*.json"
---

# Data File Guidelines — onlybots.cam

- All statistics MUST have `source` (short citation) and `sourceUrl` (full URL) fields.
- Source URLs must point to peer-reviewed studies, investigative journalism, or NGO reports.
- Never invent or extrapolate statistics — use only data from RESEARCH.md.
- Stat pairings: `baitLabel`/`baitValue` (fake platform metric) ↔ `revealStat`/`revealDetail` (real industry data).
- Categories: `"mental-health"`, `"financial"`, `"exploitation"`, `"trafficking"`, `"violence"`.
- Testimonies must be anonymized. Attribution format: "Role, Location" (e.g., "Webcam model, Colombia").
- Resources must include `name`, `description`, `url`, and `category`.
- Keep JSON valid and properly formatted. Use consistent indentation (2 spaces).
- Each entry needs a unique `id` in kebab-case.

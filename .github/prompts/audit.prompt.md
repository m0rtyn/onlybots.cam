---
name: audit
description: Run a full accessibility and performance audit against SPEC.md requirements
agent: QA Auditor
---

# Full Site Audit

Run the complete audit checklist from SPEC.md Task 5.2.

## Steps

1. Read all component files in `src/features/` and `src/shared/`
2. Check each item in the QA Auditor's checklist
3. Build the project and verify it compiles
4. Report findings in severity order

## Focus areas

- `prefers-reduced-motion` support in TheSwitch.tsx
- `aria-live` region for the switch content change
- External link attributes (`rel="noopener noreferrer" target="_blank"`)
- Keyboard accessibility of Subscribe buttons and interactive elements
- GSAP timeline cleanup on unmount

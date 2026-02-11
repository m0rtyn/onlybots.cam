---
name: add-stat
description: Add a new sourced statistic to statistics.json with proper bait/reveal pairing
agent: agent
tools: ['read', 'edit/editFiles', 'web/fetch']
argument-hint: "Describe the statistic to add"
---

# Add a Sourced Statistic

Add a new statistic entry to [statistics.json](../../src/data/statistics.json).

## Steps

1. Read [RESEARCH.md](../../docs/RESEARCH.md) to find the relevant data point
2. Read [statistics.json](../../src/data/statistics.json) to understand the existing format and avoid duplicates
3. Verify the source URL is accessible using #tool:fetch
4. Create a compelling bait/reveal pairing:
   - **baitLabel**: A seductive platform-style metric (e.g., "💰 Top Earner", "🔥 Trending")
   - **baitValue**: A fake impressive number (e.g., "$12,400/mo")
   - **revealStat**: The actual industry reality
   - **revealDetail**: 2-3 sentences of context with the full picture
5. Add to statistics.json with a unique `id` and correct `category`

## Schema

```json
{
  "id": "unique-kebab-case-id",
  "baitLabel": "emoji + marketing label",
  "baitValue": "impressive fake number",
  "revealStat": "Real industry statistic",
  "revealDetail": "Extended context with source details",
  "source": "Short citation (Author Year)",
  "sourceUrl": "https://full-url-to-source",
  "category": "mental-health | financial | exploitation | trafficking | violence"
}
```

## Rules

- Never invent statistics — only use data from RESEARCH.md
- Source URL must be verifiable
- Tone: clinical, not preachy

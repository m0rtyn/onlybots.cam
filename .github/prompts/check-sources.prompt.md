---
name: check-sources
description: Verify all source URLs in data JSON files are accessible and accurate
agent: agent
tools: ['read', 'web/fetch']
---

# Check All Source URLs

Verify every `sourceUrl` in the data files is accessible and points to the correct source.

## Files to check

1. [statistics.json](../../src/data/statistics.json) — every entry has `sourceUrl`
2. [testimonies.json](../../src/data/testimonies.json) — every entry has `sourceUrl`
3. [resources.json](../../src/data/resources.json) — every entry has `url`

## For each URL

1. Fetch the URL using #tool:fetch
2. Verify it returns a 200 status (or valid redirect)
3. Verify the page content is related to the claimed statistic/source
4. Cross-reference with [RESEARCH.md](../../RESEARCH.md) for consistency

## Report format

| File | Entry ID | URL | Status | Notes |
|------|----------|-----|--------|-------|
| statistics.json | depression-rate | https://... | ✅ OK | |
| statistics.json | ... | https://... | ❌ 404 | Needs replacement |

## If a URL is broken

- Search RESEARCH.md for an alternative source
- Suggest a replacement URL
- Do NOT automatically edit the file — report only

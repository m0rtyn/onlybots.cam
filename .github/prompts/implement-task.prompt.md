---
name: implement-task
description: Implement a specific task from PLAN.md by task number (e.g., "2.1", "3.1")
agent: agent
tools: ['read', 'edit/editFiles', 'search', 'web/fetch', 'agent']
argument-hint: "Task number from PLAN.md, e.g. 3.1"
---

# Implement Task from PLAN.md

The user wants to implement a specific task from [PLAN.md](../../PLAN.md).

## Steps

1. Read [PLAN.md](../../PLAN.md) and find the task matching the user's input: `${input:taskNumber:Task number e.g. 3.1}`
2. Read the task's dependencies — check if they are already completed by examining the existing source files
3. Read [SPEC.md](../../SPEC.md) for any relevant design requirements
4. Read [RESEARCH.md](../../RESEARCH.md) if the task involves statistics or content
5. Implement the task exactly as specified in PLAN.md
6. After implementation, verify:
   - TypeScript compiles without errors
   - Component follows the two-state pattern (bait-state / reveal-state)
   - All external links have `rel="noopener noreferrer" target="_blank"`
   - Data references match the JSON schema in PLAN.md

## Output

Summarize what was implemented and list any remaining work or blockers.

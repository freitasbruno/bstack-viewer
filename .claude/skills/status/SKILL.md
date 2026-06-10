---
name: status
description: "Project status snapshot for BStack projects. Shows what is currently in progress and where the roadmap stands. Simple and direct — no commentary."
---

# /status — Project Status

Read:
1. All .claude/memory/wip/*.md — exclude anything inside _archive/
2. .claude/memory/roadmap/index.md

## Output

### In progress

If wip files exist, for each one:

  [feature-slug] — [one-line description] ([status])
  Last: [most recent session log entry]

If no wip files exist: "Nothing in progress."

### Roadmap

Render the features table from roadmap/index.md exactly as written.

If the table is empty or the file does not exist: "Roadmap is empty."

No commentary. No recommendations. No next steps. Just the facts.

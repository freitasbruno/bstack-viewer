---
name: import
description: "Knowledge import skill for BStack projects. Reads an existing codebase, documents, roadmaps, user stories, or any combination and populates the memory layer. Never generates or modifies code — reads only to extract knowledge. Handles fresh, partial, and merge imports. Re-runnable safely."
---

# /import — Import and Onboard

You are onboarding a project into BStack. Your input might be a 
codebase, documents, or both. Your output is always memory files — 
you never generate, modify, or handle code directly.

This is a conversation. Read what you can, ask about what you cannot 
infer, propose where information is missing. Never block on missing 
information — make a reasonable proposal and let the user confirm 
or correct.

## On start

Detect the current state:
- No memory files exist → Fresh import
- Some memory files exist → Partial import — read what exists first
- Memory files exist and new information is being provided → Merge

Ask: "What are you importing? Point me to the codebase path, 
documents, or both."

Read CLAUDE.md if it exists.

## Reading phase

Read everything provided before asking any questions.

If a codebase:
- Read the full directory structure
- Read package.json — infer stack, dependencies, scripts
- Read all migration files — build schema understanding
- Scan src/ or app/ — infer routes, components, services, hooks
- Read any existing documentation

If documents:
- Vision docs → project identity, goals, target users
- User stories → features, roadmap structure
- Roadmaps → phases, features, status
- Design files → components, patterns, tokens
- ERDs → tables, relationships, domains

## Gap resolution

After reading everything, identify what is missing. Work through 
gaps one at a time — never dump a list of questions.

For each gap:
- State what you found or inferred
- Ask one specific question
- If the user says "propose something" — make a reasonable proposal, 
  show it, ask for confirmation

If the import is complex, break it into logical modules and complete 
each one before moving to the next:
1. Project identity and stack
2. Environments and repos
3. Schema and ERDs
4. Roadmap and features
5. Component registry
6. Patterns and utilities

Complete and confirm each module before starting the next.

## Findings

As you read, note anything concerning:
- Dead code → .claude/memory/known-bugs.md
- Dead tables → .claude/memory/known-bugs.md
- Duplicate components → .claude/memory/technical-debt.md
- Inconsistent patterns → .claude/memory/technical-debt.md
- Missing tests → .claude/memory/technical-debt.md
- Security surfaces → .claude/memory/known-bugs.md

Do not let findings block the import. Present the findings report 
after memory files are written.

## Scaffold missing harness structure

Before writing memory files, ensure these paths exist (create if absent —
never overwrite existing content):

- .claude/memory/mockups/_backup/
- .claude/memory/schema/_backup/
- .claude/memory/roadmap/_backup/
- .claude/memory/registry/_backup/
- .claude/memory/tests/_backup/
- .claude/memory/wip/_archive/

Create .claude/memory/mockups/index.md if it does not exist:

# Mockups Index

Tracks all mockups produced during planning and build. Updated whenever
a mockup is saved — never left stale.

| Feature | Name | File | Created |
|---------|------|------|---------|

Copy .claude/memory-viewer.html from the bstack source if it does not
exist in this project. Clone bstack to a temp dir, copy the file,
then remove the temp dir.

## Writing memory files

Write or merge each file in this order. Back up any existing file 
before updating it.

1. CLAUDE.md
2. .claude/memory/techstack.md
3. .claude/memory/environments.md
4. .claude/memory/schema/index.md + erd-[domain].md files
5. .claude/memory/roadmap/index.md + [feature-slug].md files
6. .claude/memory/registry/components.md
7. .claude/memory/registry/patterns.md
8. .claude/memory/registry/utils.md
9. .claude/memory/known-bugs.md
10. .claude/memory/technical-debt.md

Merge rules:
- Existing content is never silently overwritten
- If new information conflicts with existing memory, flag the conflict 
  and ask the user which is correct
- Always show a summary of what changed before writing

## Final report

Import complete: [mode — fresh / partial / merge]

Memory files written:
- [list each file with brief note on what was populated]

Harness files ensured:
- .claude/memory/mockups/index.md
- .claude/memory-viewer.html

Findings:
- Known bugs: [N items added]
- Technical debt: [N items added]

Gaps remaining:
- [anything unresolved — flagged for future /import runs]

Ready. Run /plan to start your next feature.

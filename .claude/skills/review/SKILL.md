---
name: review
description: "Post-build review skill for BStack projects. Audits completed implementation for quality, consistency, dead code, dead tables, duplicate components, and convention drift. Surfaces manual tests. Always runs after /build, before /verify."
---

# /review — Post-Build Review

You are a meticulous senior engineer doing a final quality pass. 
You are not rubber-stamping the build — you are actively looking 
for problems. Standard: would I be comfortable if someone else 
read this code tomorrow?

## Fix or flag rule

Fix directly — unambiguous issues with no side effects:
- Missing dark: classes
- Unused imports
- console.log left in
- Hardcoded values that should be constants
- Minor TypeScript improvements with no behaviour change

Flag and discuss — anything with potential consequences:
- Logic that looks wrong but might be intentional
- Components that should be refactored but are used elsewhere
- Patterns that deviate from the registry
- Performance concerns
- Security surface changes

## On start

1. Read CLAUDE.md
2. Read .claude/memory/wip/[feature-slug].md
   Append to .claude/audit.log using the Edit tool:
   `YYYY-MM-DD HH:mm | review | [feature-slug] | START`
   (Substitute today's date and current time from your session context. Do not use shell date substitution.)
3. Confirm status is reviewing
4. Read .claude/memory/registry/components.md
5. Read .claude/memory/known-bugs.md
6. Read .claude/memory/schema/index.md if feature touched DB

## Dimension 1 — Correctness

Read every file changed in this feature:
- Does implementation match approved requirements in the wip?
- Are edge cases from the plan handled?
- Any obvious runtime errors?

## Dimension 2 — Dead code and dead tables

Code:
- Unreferenced functions, components, hooks, utilities?
- Files that exist but are no longer imported?
- Temporary code that should have been removed?

DB:
- Did this feature make any existing tables or columns redundant?
- If yes: propose a cleanup migration. Get explicit approval 
  before adding to the plan. Handle in this cycle unless scope 
  makes it impractical — if so, create a new task.

## Dimension 3 — Component consistency

Cross-reference every UI element against registry/components.md:
- Any new components that duplicate something in the registry?
- Any existing components used inconsistently?
- Any new reusable components that should be added to the registry?

## Dimension 4 — Convention adherence

- Types defined before use?
- Server vs client boundary respected?
- Signed URLs for all storage access?
- RLS policies for new tables?
- No external component libraries not in techstack.md?
- Dark mode alongside light mode?
- Admin routes double-protected?

## Dimension 5 — Known bugs cross-reference

Read .claude/memory/known-bugs.md:
- Did this feature accidentally fix a known bug? Mark resolved.
- Did this feature introduce anything new? Add to known-bugs.
- Were bugs deferred during build? Add them now.

## Dimension 6 — Manual tests

Based on the test plan in the wip file, produce the manual 
test checklist:

## Manual tests required before shipping
- [ ] [Specific action] → [Expected result]

Be precise. Minimise this list — only what genuinely requires 
human eyes.

Present the list and get confirmation all items have been checked 
before proceeding.

## On completion

When all dimensions reviewed, flagged items resolved, and manual 
tests confirmed:

1. Update wip status to verifying
2. Add review summary to session log
3. Back up and update registry/components.md if new components added
4. Back up and update known-bugs.md if bugs added or resolved
5. Append to .claude/audit.log using the Edit tool:
   `YYYY-MM-DD HH:mm | review | [feature-slug] | END`
   (Substitute today's date and current time from your session context.)

Tell the user: "Review complete. Run /verify."

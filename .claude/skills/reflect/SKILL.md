---
name: reflect
description: "Retrospective skill for BStack. Runs at the end of a project or milestone. Reads wip archives and session logs to identify recurring patterns, friction points, and gaps in the harness. Produces a prioritised list of improvement proposals — does not implement anything. Hand off proposals to /evolve to action them."
---

# /reflect — Retrospective

You are running a retrospective on a completed project or milestone. 
Your job is to read the evidence, identify patterns, and produce 
honest findings. You propose — you never implement.

## On start

Ask: "Are we reflecting on the full project or a specific milestone?"

Read CLAUDE.md to orient yourself on the project.

## Evidence gathering

Read .claude/memory/wip/_archive/ — all archived wip files relevant 
to the scope.

For each archived wip, read the session log. Look for:
- Steps repeated multiple times before succeeding
- Verify failures that sent work back to build
- Decisions revisited after being locked in planning
- Open issues that were never resolved
- Gaps where a skill gave no useful guidance
- Anything noted as friction, unexpected, or deferred repeatedly

Also read:
- .claude/memory/known-bugs.md — bugs that accumulated vs. were resolved
- .claude/memory/technical-debt.md — debt added vs. resolved ratio
- .claude/memory/roadmap/index.md — features deferred or stalled

Build a pattern inventory. One incident is noise. Two is a signal. 
Three is a pattern worth naming.

## Findings report

Present findings grouped by theme, not by feature:

---
## Reflection: [project or milestone name]
### Period: [date range from wip archives]

### Pattern: [name]
Observed in: [feature-slug-1], [feature-slug-2], ...
What happened: [description of the recurring situation]
Impact: [what it cost — rework, confusion, deferred work]
Likely root cause: [which skill, step, or memory structure is weak]

[repeat for each pattern]

### What worked well
[Patterns of smooth execution worth preserving]

### Debt and bug ratio
- Bugs opened: [N] / resolved: [N]
- Debt opened: [N] / resolved: [N]
- Assessment: [improving / stable / accumulating]
---

Present the report and discuss. Do not propose solutions yet — 
make sure the diagnosis is right first.

## Proposals

After the user confirms the findings, produce one proposal per pattern:

### Proposal: [title]
Pattern it addresses: [name]
Skill affected: [skill name, or "new skill needed"]
Type: [tweak / add step / add rule / new skill / memory structure change]
Suggested change: [high-level description — not implementation]
Priority: [high / medium / low]

Keep proposals high-level. The implementation happens in /evolve.

## Handoff

Once proposals are reviewed and prioritised:

"To action these, run /evolve for each one. Start with the 
highest priority."

## What /reflect never does

- Never implements changes to skill files
- Never proposes based on a single incident
- Never skips the diagnosis confirmation step

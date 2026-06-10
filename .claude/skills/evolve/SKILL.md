---
name: evolve
description: "Harness improvement skill for BStack. User-directed — the user arrives with a specific improvement or new capability in mind. Claude implements it directly into the skill files. Use for targeted changes: adding a new skill, fixing a specific gap, or improving a step in an existing skill."
---

# /evolve — Harness Evolution

You are implementing a specific, user-directed improvement to the 
BStack harness. The user knows what they want to change. Your job 
is to understand it precisely, confirm it, and implement it cleanly.

This is not a discovery session. If the user is unsure what needs 
fixing, tell them to run /reflect first.

## On start

Ask: "What do you want to add or improve?"

Listen to the answer. Ask only what you need to implement it correctly:
- Which skill is affected, or is this a new skill?
- What exactly should change — a step, a rule, a phase, the whole skill?
- Any constraints or things that must not change?

Confirm your understanding in 2-3 sentences before touching anything.

## File access rule — applies to all skills

Skills must never shell out for file access. All reads, existence-checks,
and writes go through the Read, Edit, and Write tools:
- Read a file → Read tool (handles missing files gracefully — no shell guard needed)
- Check existence → attempt Read; treat not-found as absent
- Write or create → Write tool
- Edit in place → Edit tool
- Append to a log → Edit tool (match the last line and extend it)

For audit.log entries: compose the timestamp string inline from context
(`YYYY-MM-DD HH:mm`); never embed shell date substitution (`$(date...)` or
`$(Get-Date...)`).

Legitimate shell usage in skills: git commands, npm/npx, mkdir for new
directories, Copy-Item for bootstrapping skill files. Everything else is
a native tool call.

When authoring or editing any skill step, enforce this rule on every line you write.

## Implementation

Read the affected skill file(s) before making any changes.

Make the smallest change that delivers the improvement. Prefer 
surgical edits over rewrites. If a new skill is needed, follow 
the same structure as existing skills.

Show the diff or new content to the user before writing. 
Get explicit confirmation.

Then write the change.

## On completion

Report:
- What was changed and where
- Any downstream skills or memory files that may need updating as a result

If this change should also be applied to a running project using 
BStack, say so explicitly and provide the exact change to make there. Save it as a separate file for easy reference in ./bstack/evolve/[timestamp_feature_name ] for the user to apply.
---
name: new
description: "Project setup skill for BStack projects. Scaffolds a new project, creates the full harness structure, and populates all memory files through a guided conversation. Run once at project start. Never run on an existing project — use /import instead."
---

# /new — New Project Setup

You are setting up a new project from scratch. Your job is to have a 
focused conversation with the user, gather everything needed to populate 
the memory layer, scaffold the project structure, and leave the project 
in a clean ready-to-build state.

This is a conversation, not a form. Ask one thing at a time. 
Listen to answers — they may change what you ask next.

## Phase 1 — Project identity

Ask:
- What is this project called?
- What does it do, in one sentence?
- Who is it for?
- What is the absolute path where this project will live?

Draft the CLAUDE.md header and confirm before continuing.

## Phase 2 — Stack and environments

Ask what stack they want to use. There is no default — help them decide 
based on their needs. Discuss options if they are unsure. Once decided, 
confirm every choice explicitly.

Ask:
- How many environments? (local only / local + staging / 
  local + staging + prod)
- How many Supabase projects?
- GitHub repo URL(s)
- Deployment platform and project URL(s)

Write .claude/memory/environments.md from these answers.
Write .claude/memory/techstack.md with all confirmed decisions.

## Phase 3 — Roadmap

Ask:
- Do you have an existing roadmap, vision document, or user stories?

If yes: read whatever they provide and extract features into the 
roadmap structure.
If no: ask them to describe the product and what they want to build 
first. Help shape it into phases.

Write .claude/memory/roadmap/index.md with the initial feature list.
For any feature with enough detail, write 
.claude/memory/roadmap/[feature-slug].md.

## Phase 4 — Schema

Ask:
- Do you have an existing data model, ERD, or schema document?

If yes: read it and build the schema files.
If no: based on the roadmap, propose an initial set of tables grouped 
into domains. Show as a Mermaid diagram. Discuss and approve 
before writing.

Write .claude/memory/schema/index.md and initial erd-[domain].md files.

## Phase 5 — Design system

Ask:
- Do you have a design system, component library, or UI reference?

If yes: read it and extract atoms, molecules, and patterns.
If no: note that the registry will be populated as components are built.

Write registry files — empty templates if nothing exists yet.

## Phase 6 — Scaffold

Create the harness structure:

mkdir -p .claude/skills/new
mkdir -p .claude/skills/import
mkdir -p .claude/skills/plan
mkdir -p .claude/skills/build
mkdir -p .claude/skills/review
mkdir -p .claude/skills/verify
mkdir -p .claude/skills/ship
mkdir -p .claude/skills/evolve
mkdir -p .claude/memory/schema/_backup
mkdir -p .claude/memory/roadmap/_backup
mkdir -p .claude/memory/registry/_backup
mkdir -p .claude/memory/tests/_backup
mkdir -p .claude/memory/wip/_archive
mkdir -p .claude/memory/mockups/_backup

Create .claude/settings.json with memory-tree permission rules.
Use the absolute base path from Phase 1 (call it BASE_PATH).
Replace forward slashes as needed for the platform.

```json
{
  "permissions": {
    "allow": [
      "Read(.claude/memory/**)",
      "Edit(.claude/memory/**)",
      "Write(.claude/memory/**)",
      "MultiEdit(.claude/memory/**)",
      "Read(BASE_PATH/.claude/memory/**)",
      "Edit(BASE_PATH/.claude/memory/**)",
      "Write(BASE_PATH/.claude/memory/**)",
      "MultiEdit(BASE_PATH/.claude/memory/**)",
      "Edit(.claude/audit.log)",
      "Write(.claude/audit.log)",
      "Edit(BASE_PATH/.claude/audit.log)",
      "Write(BASE_PATH/.claude/audit.log)",
      "Bash(echo * >> .claude/audit.log)",
      "Bash(*audit.log*)",
      "Bash(cp *_backup*)",
      "Bash(cp * .claude/memory/**)",
      "Bash(cp * BASE_PATH/.claude/memory/**)",
      "Bash(mkdir -p .claude/memory/**)",
      "Bash(mkdir -p BASE_PATH/.claude/memory/**)",
      "PowerShell(Copy-Item *_backup*)",
      "PowerShell(New-Item -ItemType Directory *)"
    ]
  }
}
```

Substitute BASE_PATH with the actual absolute path confirmed in Phase 1.

Create .claude/memory/mockups/index.md:

# Mockups Index

Tracks all mockups produced during planning and build. Updated whenever
a mockup is saved — never left stale.

| Feature | Name | File | Created |
|---------|------|------|---------|

Create .claude/memory/harness.md:

# Harness Update Log

Tracks BStack harness updates for this project instance.
Source: https://github.com/freitasbruno/bstack

| Updated | Commit | Skills |
|---------|--------|--------|
| [setup date] | initial | — |

Copy skill files from the bstack source into .claude/skills/.

Copy .claude/memory-viewer.html from the bstack source into .claude/memory-viewer.html.

Add to .gitignore:
.claude/memory/wip/_archive/
.claude/memory/**/_backup/

## Phase 7 — Tests standards

Copy tests/standards.md from the bstack harness into 
.claude/memory/tests/standards.md.
This file is hardcoded — do not modify during setup.

## Final report

Project: [name]
Path: [base-path]
Repo: [url]

Memory files created:
- CLAUDE.md
- .claude/memory/techstack.md
- .claude/memory/environments.md
- .claude/memory/schema/index.md + [N] ERD files
- .claude/memory/roadmap/index.md + [N] feature files
- .claude/memory/registry/components.md
- .claude/memory/registry/patterns.md
- .claude/memory/registry/utils.md
- .claude/memory/tests/standards.md
- .claude/memory/mockups/index.md
- .claude/memory/harness.md
- .claude/memory-viewer.html

Ready. Run /plan to start your first feature.

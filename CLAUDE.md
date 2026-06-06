# BStack Memory Viewer
Electron app — multi-project workspace hub for navigating and managing `.claude/memory/` files across BStack projects.

## Base path
D:\CLAUDE\bstack-viewer

## Repositories
- Production: https://github.com/freitasbruno/bstack-viewer

## Pipeline
Work always follows this order. Never skip a step.

| Skill    | Purpose                                                                 | When                   |
|----------|-------------------------------------------------------------------------|------------------------|
| /plan    | Explore, challenge, detail feature, optional design, technical eval, test plan | Before any code |
| /build   | Implement with conventions enforced                                     | After plan approved    |
| /review  | Dead code, dead tables, duplicate components, drift                     | After build            |
| /verify  | tsc, lint, automated tests, human test checklist                        | Before commit          |
| /ship    | Commit, push, update memory files                                       | After verify passes    |
| /reflect | Retrospective — read archives, identify patterns, produce proposals     | End of project or milestone |
| /evolve  | Implement a specific harness improvement (user-directed)                | After /reflect, or on demand |

## Utility skills
Non-blocking tools that can be used at any point without interrupting flow.

| Skill  | Usage                        | Purpose                                              |
|--------|------------------------------|------------------------------------------------------|
| /note   | `/note [topic]`              | Capture an observation from context → notes.md       |
| /update | `/update`                    | Pull latest skill files from bstack source repo      |

## Memory index
Load only what the current task requires.

| File                                      | Load when                                      |
|-------------------------------------------|------------------------------------------------|
| .claude/memory/techstack.md               | Adding a dependency, debugging a build issue   |
| .claude/memory/environments.md            | Ship phase, deployment questions               |
| .claude/memory/schema/index.md            | Any feature touching data                      |
| .claude/memory/schema/erd-[domain].md     | When specific tables are being changed         |
| .claude/memory/roadmap/index.md           | Every planning session                         |
| .claude/memory/roadmap/[feature].md       | When detailing or building that specific feature |
| .claude/memory/registry/components.md     | Any feature with UI                            |
| .claude/memory/registry/patterns.md       | New service, auth surface, storage use         |
| .claude/memory/registry/utils.md          | Before writing any helper function             |
| .claude/memory/tests/standards.md         | Plan phase and verify phase                    |
| .claude/memory/known-bugs.md              | Review phase, any bug-related work             |
| .claude/memory/technical-debt.md          | Planning phase, review phase                   |
| .claude/memory/mockups/index.md           | Any feature with UI                            |
| .claude/memory/harness.md                 | Before running /update                         |
| .claude/memory/notes.md                   | Every /plan, /reflect, and /evolve session     |

## Memory update rule
Before writing to any file in .claude/memory/ (except techstack.md 
and environments.md):
1. Create a timestamped backup: copy the file to the same directory's 
   _backup/ folder
2. Filename format: [filename].YYYY-MM-DD-HHhmm.md
3. Then write the update
4. Never skip the backup step

This rule applies to every skill, every session, no exceptions.

## Memory autonomy rule
Files in .claude/memory/ are internal working files. Never ask for 
confirmation before reading or writing them. Back up first per the 
rule above, then write directly — no questions asked.

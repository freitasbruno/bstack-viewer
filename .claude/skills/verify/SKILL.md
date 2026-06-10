---
name: verify
description: "Pre-ship verification gate for BStack projects. Runs all automated checks — tsc, lint, and tests. Never fixes anything. If anything fails, sends back to /build with specific instructions. Always runs after /review, before /ship."
---

# /verify — Verification Gate

You are a CI pipeline, not a developer. You run checks and report 
results honestly. You fix nothing. You decide nothing. If anything 
fails, you stop and send the work back to /build.

## On start

1. Read CLAUDE.md
2. Read .claude/memory/wip/[feature-slug].md
   Append to .claude/audit.log using the Edit tool:
   `YYYY-MM-DD HH:mm | verify | [feature-slug] | START`
   (Substitute today's date and current time from your session context. Do not use shell date substitution.)
3. Confirm status is verifying — if not, stop and tell the user 
   which step is missing
4. Read .claude/memory/tests/standards.md

## Run all checks in order

Do not proceed to the next check if the current one fails.

### Check 1 — TypeScript

npx tsc --noEmit 2>&1

Pass: zero errors → continue
Fail: stop immediately

Report:
TypeScript: FAILED
[list every error with file:line]

Return to /build with these specific errors.
Once fixed, run /review then /verify again.

Update wip status back to building.

### Check 2 — Lint

npm run lint 2>&1

Pass: zero warnings → continue
Fail: stop immediately

Report:
Lint: FAILED
[list every warning with file:line]

Return to /build with these specific errors.
Once fixed, run /review then /verify again.

### Check 3 — Automated tests

npm test 2>&1

Pass: all tests pass → continue
Fail: stop immediately

Report:
Tests: FAILED
[list failing tests with details]

Failing tests may indicate unintended side effects.
Return to /build with these specific failures.

No test suite found:
Tests: WARNING — no test suite configured
Proceeding, but this should be addressed.

### Check 4 — Smell check

Scan for things that should never ship:

grep -rn "console\.log" src/ --include="*.ts" --include="*.tsx"
grep -rn "localhost:" src/ --include="*.ts" --include="*.tsx"
grep -rn "<<<<<<\|>>>>>>\|=======" src/ --include="*.ts" --include="*.tsx"

Any hits → flag and stop. Return to /build.

### Check 5 — TODO / FIXME scan

grep -rn "TODO\|FIXME\|HACK" src/ --include="*.ts" --include="*.tsx"

Do not block on these. Note them — they will be handled during 
/ship reflection.

## On full pass

1. Update wip status to shipping
2. Add verify pass note to session log with timestamp
3. Append to .claude/audit.log using the Edit tool:
   `YYYY-MM-DD HH:mm | verify | [feature-slug] | END`
   (Substitute today's date and current time from your session context.)

Report:
Verify: PASSED
TypeScript:  ✅ 0 errors
Lint:        ✅ 0 warnings
Tests:       ✅ [N] passed
Smells:      ✅ clean
TODOs found: [N] — will be added to roadmap during /ship

Run /ship to commit.

## The rule

/verify never makes changes. Ever.
If a fix is needed, it goes back to /build.

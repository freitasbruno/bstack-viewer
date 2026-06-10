---
name: update
description: "Harness update skill for BStack projects. Fetches the latest skill files from github.com/freitasbruno/bstack and overwrites .claude/skills/ in the current project. Tracks update history in .claude/memory/harness.md. Never modifies CLAUDE.md, memory files, or project settings."
---

# /update — Update Harness

You are updating the BStack skill files in this project to the latest 
version from the source repository. Only .claude/skills/ is updated. 
CLAUDE.md, memory files, and project settings are never touched.

## On start

1. Check .claude/memory/harness.md — if it exists, report the last 
   update date and commit hash. If not, note this is the first 
   recorded update.

2. Clone the bstack source to a temp directory:

   $ts = Get-Date -Format 'yyyyMMddHHmmss'
   $tmp = "$env:TEMP\bstack-update-$ts"
   git clone --depth 1 https://github.com/freitasbruno/bstack $tmp

   If clone fails: report the error and stop.

3. Get the commit hash:

   Set-Location $tmp
   git rev-parse --short HEAD

4. List all skill files that will be overwritten and ask once:
   "Proceed with update?"

## Apply update

On confirmation:

1. Copy skill files into the project:

   Copy-Item -Path "$tmp\.claude\skills\*" `
     -Destination ".claude\skills\" -Recurse -Force

2. Copy the memory viewer:

   Copy-Item -Path "$tmp\.claude\memory-viewer.html" `
     -Destination ".claude\memory-viewer.html" -Force

3. Clean up:

   Remove-Item -Recurse -Force $tmp

## On completion

1. Run `Get-Date -Format "yyyy-MM-dd HH:mm"` to get the real timestamp.

2. Write or append to .claude/memory/harness.md:

   If creating for the first time:

   # Harness Update Log

   Tracks BStack harness updates for this project instance.
   Source: https://github.com/freitasbruno/bstack

   | Updated | Commit | Skills |
   |---------|--------|--------|

   Then append the row:

   | [timestamp] | [commit-hash] | [N] |

3. Report:

   Updated: [N] skill files
   From:    https://github.com/freitasbruno/bstack @ [commit-hash]
   Logged:  .claude/memory/harness.md

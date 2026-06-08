# markdown-renderer
Port the custom inline markdown renderer from the HTML reference as a TypeScript utility + React component.

## Status
verifying

## Requirements
- `src/renderer/src/utils/md.ts` — MD.parse(text: string): string, direct port from memory-viewer.html
- `src/renderer/src/components/MarkdownView.tsx` — renders MD.parse output, fires onNavigate on relative links, shell.openExternal on external links
- All .md-body CSS from the HTML reference, expressed as Tailwind utilities where possible, global CSS for complex selectors (tables, code blocks)
- fadeUp animation on mount

## Design reference
.claude/memory-viewer.html — MD and MarkdownRenderer sections

## Technical decisions
- MD.parse is pure TypeScript, no dependencies
- XSS safety: all text content HTML-escaped via esc() before innerHTML
- External links: ipcRenderer → shell.openExternal in main (renderer cannot call shell directly)

## Test plan

### Automated
none

### Human verification required
- [ ] Render a memory file with h1–h3, table, code block, blockquote, checklist → all styled correctly
- [ ] Relative link click fires onNavigate with correct relPath
- [ ] External link opens in system browser, not Electron window

## Open issues
none

## Session log
- 2026-06-06 Plan approved

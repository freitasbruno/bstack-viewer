// Browser-safe Windows path utilities for the renderer process.
// Paths received from main are always Windows-style (backslash).

export function winJoin(...parts: string[]): string {
  return parts
    .filter(Boolean)
    .join('\\')
    .replace(/\\+/g, '\\')
}

export function memoryRoot(rootPath: string): string {
  return winJoin(rootPath, '.claude', 'memory')
}

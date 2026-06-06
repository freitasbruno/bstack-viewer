export interface Module {
  name: string
  canHandle(fileName: string, relPath: string): boolean
  render(content: string, relPath: string): string
}

const registry: Module[] = []

export const ModuleRegistry = {
  register(module: Module): void {
    registry.push(module)
  },
  dispatch(fileName: string, relPath: string): Module {
    return registry.find((m) => m.canHandle(fileName, relPath)) ?? MarkdownModule
  }
}

export const MarkdownModule: Module = {
  name: 'Markdown',
  canHandle: (_fileName, relPath) => relPath.endsWith('.md'),
  render: (content) => content
}

// Phase 2 stubs — fall back to markdown
export const SchemaModule: Module = {
  name: 'Schema',
  canHandle: (_fileName, relPath) => relPath.startsWith('schema/') && relPath.endsWith('.md'),
  render: (content) => content
}

export const MockupModule: Module = {
  name: 'Mockup',
  canHandle: (_fileName, relPath) => relPath.startsWith('mockups/'),
  render: (content) => content
}

ModuleRegistry.register(MockupModule)
ModuleRegistry.register(SchemaModule)
ModuleRegistry.register(MarkdownModule)

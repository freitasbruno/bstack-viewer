export interface Module {
  name: string
  type: 'markdown' | 'mockup'
  canHandle(fileName: string, relPath: string): boolean
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
  type: 'markdown',
  canHandle: (_fileName, relPath) => relPath.endsWith('.md'),
}

export const SchemaModule: Module = {
  name: 'Schema',
  type: 'markdown',
  canHandle: (_fileName, relPath) => relPath.startsWith('schema/') && relPath.endsWith('.md'),
}

export const MockupModule: Module = {
  name: 'Mockup',
  type: 'mockup',
  canHandle: (fileName) => fileName.endsWith('.html'),
}

ModuleRegistry.register(MockupModule)
ModuleRegistry.register(SchemaModule)
ModuleRegistry.register(MarkdownModule)

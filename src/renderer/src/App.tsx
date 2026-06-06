import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProjectsProvider } from './context/ProjectsContext'
import ProjectHub from './views/ProjectHub'
import MemoryBrowser from './views/MemoryBrowser'

export default function App(): JSX.Element {
  return (
    <ProjectsProvider>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<ProjectHub />} />
          <Route path="/project/:projectId" element={<MemoryBrowser />} />
        </Routes>
      </MemoryRouter>
    </ProjectsProvider>
  )
}

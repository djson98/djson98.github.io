import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { TooltipProvider } from '@/components/ui/tooltip'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider delayDuration={300}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="w-full flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
          </Routes>
        </main>
        <footer
          aria-label="Site footer"
          className="border-t border-border/50 px-4 py-8 text-center text-[13px] text-muted-foreground sm:text-sm"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
            <span>Copyright © 2026 Dongju Son</span>
            <span className="hidden text-border sm:inline" aria-hidden="true">
              ·
            </span>
            <span className="text-muted-foreground/90">Last updated April 7, 2026</span>
          </div>
        </footer>
      </div>
      </TooltipProvider>
    </BrowserRouter>
  )
}

import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'

export default function App() {
  return (
    <div className="min-h-screen bg-obsidian text-ivory flex flex-col font-sans selection:bg-gold selection:text-obsidian">
      {/* Responsive Navigation Header */}
      <Navbar />

      {/* Main Content Landmark */}
      <main className="flex-1 flex flex-col">
        {/* Phase 2 Visual Milestone: Cinematic Hero Section */}
        <Hero />
      </main>
    </div>
  )
}

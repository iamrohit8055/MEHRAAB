import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { CulinaryMenu } from './components/CulinaryMenu'

export default function App() {
  return (
    <div className="min-h-screen bg-obsidian text-ivory flex flex-col font-sans selection:bg-gold selection:text-obsidian">
      {/* Responsive Navigation Header */}
      <Navbar />

      {/* Main Content Landmark */}
      <main className="flex-1 flex flex-col">
        {/* Cinematic Hero Section */}
        <Hero />

        {/* Culinary Philosophy & Signature Menu */}
        <CulinaryMenu />
      </main>
    </div>
  )
}

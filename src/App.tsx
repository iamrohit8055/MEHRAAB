import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { CulinaryMenu } from './components/CulinaryMenu'
import { ArchitectureSpaces } from './components/ArchitectureSpaces'
import { PrivateDining } from './components/PrivateDining'
import { ReservationSection } from './components/ReservationSection'
import { Footer } from './components/Footer'

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

        {/* Architectural Spaces & Heritage Gallery */}
        <ArchitectureSpaces />

        {/* Exclusive Private Dining Salon */}
        <PrivateDining />

        {/* Table & Salon Reservations Experience */}
        <ReservationSection />
      </main>

      {/* Editorial Luxury Footer */}
      <Footer />
    </div>
  )
}

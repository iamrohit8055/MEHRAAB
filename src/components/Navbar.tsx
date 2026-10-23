import { useState, useEffect } from 'react'
import { BrandLogo } from './BrandLogo'
import { useNavigation } from '../hooks/useNavigation'

interface NavItem {
  label: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'The Experience', href: '#experience' },
  { label: 'Culinary Menu', href: '#menu' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Private Dining', href: '#private-dining' },
  { label: 'Find Booking', href: '#lookup' },
]

export function Navbar() {
  const { navigateTo } = useNavigation()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Subtle elevation change when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile drawer on Escape key for keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#141210]/95 backdrop-blur-md border-b border-gold/20 shadow-2xl shadow-obsidian/80 py-3.5'
            : 'bg-gradient-to-b from-obsidian/90 via-obsidian/70 to-transparent backdrop-blur-sm border-b border-gold/10 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Brand Logo & Arch Symbol */}
          <BrandLogo size="sm" />

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-8 lg:gap-10"
            aria-label="Main Navigation"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative font-sans text-xs uppercase tracking-[0.2em] text-ivory/80 hover:text-gold transition-colors duration-300 py-1 group"
              >
                {item.label}
                {/* Refined underline indicator that expands from center */}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 ease-out group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action: Table Reservation & Lookup CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#reservations"
              className="relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-sans text-xs uppercase tracking-[0.22em] text-gold border border-gold/50 rounded-xs transition-all duration-500 ease-out hover:text-obsidian group"
            >
              {/* Background fill sliding up on hover */}
              <span className="absolute inset-0 w-full h-full bg-gold -translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0" />
              <span className="relative z-10 font-medium">Reservations</span>
            </a>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-expanded={isOpen}
            aria-label="Open navigation menu"
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-ivory hover:text-gold focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <span className="w-full h-[1.5px] bg-current" />
              <span className="w-3/4 h-[1.5px] bg-current" />
              <span className="w-full h-[1.5px] bg-current" />
            </div>
          </button>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Overlay - 100% Solid Dark Obsidian */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className={`md:hidden fixed inset-0 z-50 bg-[#141210] flex flex-col justify-between overflow-y-auto transition-all duration-300 ease-out ${
          isOpen
            ? 'opacity-100 pointer-events-auto visible'
            : 'opacity-0 pointer-events-none invisible'
        }`}
        style={{
          backgroundColor: '#141210',
        }}
      >
        {/* Top Header inside Drawer */}
        <div className="px-6 sm:px-8 py-5 border-b border-gold/15 flex items-center justify-between shrink-0">
          <BrandLogo size="sm" />
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
            className="w-10 h-10 rounded-full border border-gold/30 text-ivory hover:text-gold flex items-center justify-center transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex flex-col justify-center px-8 py-8 gap-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold/60 font-sans border-b border-gold/15 pb-2">
            Sanctuary Navigation
          </span>
          {NAV_ITEMS.map((item, idx) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="font-serif text-3xl tracking-wider text-ivory hover:text-gold transition-colors duration-300"
              style={{ transitionDelay: `${idx * 40}ms` }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile Drawer Footer with Details & CTA */}
        <div className="p-8 border-t border-gold/15 flex flex-col gap-5 bg-espresso/20 shrink-0">
          <div className="grid grid-cols-2 gap-3 text-xs font-sans">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                navigateTo('lookup')
              }}
              className="py-2.5 px-3 border border-gold/30 text-gold uppercase tracking-wider text-[11px] rounded-xs text-center hover:bg-gold/10 font-medium"
            >
              Find Booking
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                navigateTo('admin')
              }}
              className="py-2.5 px-3 border border-gold/20 text-ivory/70 uppercase tracking-wider text-[11px] rounded-xs text-center hover:text-gold font-medium"
            >
              Maître D' Portal
            </button>
          </div>

          <div className="space-y-1 text-xs font-sans text-ivory/60 font-light">
            <p className="text-gold uppercase tracking-wider text-[11px]">Timings</p>
            <p>Café: 08:00 — 16:00 · Fine Dining: 18:30 — 23:30</p>
            <p>Ballard Estate, Fort · Mumbai</p>
          </div>

          <a
            href="#reservations"
            onClick={() => setIsOpen(false)}
            className="w-full text-center py-3.5 bg-gold text-obsidian font-sans text-xs uppercase tracking-[0.25em] font-semibold hover:bg-gold/90 transition-colors duration-300"
          >
            Reserve Your Experience
          </a>
        </div>
      </div>
    </>
  )
}

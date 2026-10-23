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
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isOpen
          ? 'bg-[#141210] border-b border-gold/30 shadow-2xl py-4'
          : isScrolled
          ? 'bg-[#141210]/95 backdrop-blur-md border-b border-gold/20 shadow-2xl shadow-obsidian/80 py-3.5'
          : 'bg-gradient-to-b from-obsidian/90 via-obsidian/70 to-transparent backdrop-blur-sm border-b border-gold/10 py-5'
      }`}
      style={isOpen ? { backgroundColor: '#141210' } : undefined}
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

        {/* Mobile Menu Button (Hamburger morphing into X) */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="md:hidden relative w-10 h-10 flex items-center justify-center text-ivory hover:text-gold focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
        >
          <div className="w-5 h-4 relative flex flex-col justify-between">
            <span
              className={`w-full h-[1.5px] bg-current transition-all duration-300 origin-left ${
                isOpen ? 'rotate-45 translate-x-0.5 -translate-y-0.5' : ''
              }`}
            />
            <span
              className={`w-3/4 h-[1.5px] bg-current transition-all duration-300 ${
                isOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`w-full h-[1.5px] bg-current transition-all duration-300 origin-left ${
                isOpen ? '-rotate-45 translate-x-0.5 translate-y-0.5' : ''
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Drawer Overlay - Solid Luxury Dark Obsidian to completely obscure back text */}
      <div
        className={`md:hidden fixed inset-x-0 top-full h-[calc(100dvh-100%)] bg-[#141210] border-t border-gold/20 shadow-2xl transition-all duration-300 ease-in-out flex flex-col justify-between p-6 sm:p-8 overflow-y-auto ${
          isOpen
            ? 'opacity-100 pointer-events-auto translate-y-0 visible'
            : 'opacity-0 pointer-events-none -translate-y-2 invisible'
        }`}
        style={{
          backgroundColor: '#141210',
        }}
      >
        <div className="flex flex-col gap-6 pt-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold/60 font-sans border-b border-gold/15 pb-2">
            Navigation
          </span>
          {NAV_ITEMS.map((item, idx) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="font-serif text-2xl tracking-wider text-ivory hover:text-gold transition-colors duration-300"
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile Drawer Footer with Details & CTA */}
        <div className="flex flex-col gap-5 border-t border-gold/15 pt-5">
          <div className="grid grid-cols-2 gap-3 text-xs font-sans">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                navigateTo('lookup')
              }}
              className="py-2.5 px-3 border border-gold/30 text-gold uppercase tracking-wider text-[11px] rounded-xs text-center hover:bg-gold/10"
            >
              Find Booking
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                navigateTo('admin')
              }}
              className="py-2.5 px-3 border border-gold/20 text-ivory/70 uppercase tracking-wider text-[11px] rounded-xs text-center hover:text-gold"
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
    </header>
  )
}

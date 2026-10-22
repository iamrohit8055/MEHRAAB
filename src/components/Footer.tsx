import { useState, type FormEvent } from 'react'
import { BrandLogo } from './BrandLogo'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="relative bg-[#121212] text-ivory border-t border-gold/20 overflow-hidden pt-20 pb-12">
      {/* Decorative background arch silhouette */}
      <div
        className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/3 w-[600px] h-[600px] opacity-5 pointer-events-none"
        aria-hidden="true"
      >
        <svg viewBox="0 0 48 56" fill="none" className="w-full h-full stroke-gold">
          <path d="M 6 54 V 28 C 6 15 16 7 24 2 C 32 7 42 15 42 28 V 54" strokeWidth="0.8" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Top Grid: Brand & Gazette Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-gold/15">
          {/* Brand Presentation */}
          <div className="lg:col-span-5 space-y-6">
            <BrandLogo size="md" />

            <p className="font-serif italic text-gold text-lg max-w-md">
              “An entrance to extraordinary.”
            </p>

            <p className="font-sans font-light text-xs sm:text-sm text-ivory/70 leading-relaxed max-w-md">
              A contemporary Indian café, fine dining salon, and architectural sanctuary rooted in the
              historic port quarter of Ballard Estate, Mumbai.
            </p>

            <div className="pt-2 text-xs font-sans text-gold/80 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Welcoming Guests · Reservations Open for Autumn 2026</span>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-8 text-xs font-sans">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-light block mb-4">
                Exploration
              </span>
              <ul className="space-y-3 text-ivory/70">
                <li>
                  <a href="#experience" className="hover:text-gold transition-colors">
                    The Experience
                  </a>
                </li>
                <li>
                  <a href="#menu" className="hover:text-gold transition-colors">
                    Culinary Menu
                  </a>
                </li>
                <li>
                  <a href="#architecture" className="hover:text-gold transition-colors">
                    Architecture
                  </a>
                </li>
                <li>
                  <a href="#private-dining" className="hover:text-gold transition-colors">
                    Private Dining
                  </a>
                </li>
                <li>
                  <a href="#reservations" className="hover:text-gold transition-colors">
                    Reservations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-light block mb-4">
                Hours & Service
              </span>
              <ul className="space-y-3 text-ivory/70 font-light text-[11px]">
                <li>
                  <strong className="text-ivory block font-medium">Morning Café</strong>
                  08:00 — 16:00
                </li>
                <li>
                  <strong className="text-ivory block font-medium">Twilight Dining</strong>
                  18:30 — 23:30
                </li>
                <li>
                  <strong className="text-ivory block font-medium">Weekend Brunch</strong>
                  10:00 — 16:30
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Signup: The Mehraab Gazette */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-light block">
              The Mehraab Gazette
            </span>
            <h4 className="font-serif text-xl sm:text-2xl text-ivory font-light">
              Invitations to Seasonal Tastings
            </h4>
            <p className="font-sans font-light text-xs text-ivory/70 leading-relaxed">
              Subscribe to receive private invitations to our solstice tasting banquets, guest chef collaborations,
              and rare botanical distillations.
            </p>

            {subscribed ? (
              <div className="p-4 bg-espresso/40 border border-gold/40 text-gold text-xs font-sans rounded-xs flex items-center gap-2">
                <span>✓ Thank you. You have been added to our private register.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-obsidian border border-gold/30 text-ivory p-3 text-xs font-sans rounded-xs placeholder:text-ivory/40 focus:outline-none focus:border-gold"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 bg-gold text-obsidian font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:bg-ivory transition-colors duration-200"
                  >
                    Join
                  </button>
                </div>
                <span className="text-[10px] text-ivory/40 block font-light">
                  We respect your discretion. Published bi-monthly.
                </span>
              </form>
            )}
          </div>
        </div>

        {/* Middle Meta Details: Address, Contact, Coordinates */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans text-ivory/70 border-b border-gold/10">
          <div>
            <strong className="text-gold uppercase tracking-wider block text-[10px] mb-1">
              Sanctuary Address
            </strong>
            <p className="font-light">
              Mehraab House, 14 Calicut Road, Ballard Estate, Fort, Mumbai 400001
            </p>
          </div>

          <div>
            <strong className="text-gold uppercase tracking-wider block text-[10px] mb-1">
              Direct Inquiries
            </strong>
            <p className="font-light">
              Telephone: +91 (022) 4920 1800 <br />
              Concierge: concierge@mehraab.in
            </p>
          </div>

          <div>
            <strong className="text-gold uppercase tracking-wider block text-[10px] mb-1">
              Geographic Coordinates
            </strong>
            <p className="font-light">
              18.9388° N, 72.8354° E · Arabian Sea Maritime Quarter
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-sans text-ivory/50">
          <p>© 2026 MEHRAAB HOSPITALITY GROUP. ALL RIGHTS RESERVED.</p>
          <p className="tracking-wider">
            CONTEMPORARY INDIAN GASTRONOMY · ARCHITECTURE BY STUDIO MUMBAI
          </p>
        </div>
      </div>
    </footer>
  )
}

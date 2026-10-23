import { useEffect } from 'react'
import { AUTUMN_TASTING_MENU } from '../../data/tastingMenuData'

interface TastingMenuModalProps {
  isOpen: boolean
  onClose: () => void
  onReserve?: () => void
}

export function TastingMenuModal({ isOpen, onClose, onReserve }: TastingMenuModalProps) {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const menu = AUTUMN_TASTING_MENU

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Autumn Tasting Menu"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-obsidian/95 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#171614] border border-gold/40 rounded-xs shadow-2xl text-ivory p-6 sm:p-12 my-8 max-h-[92vh] overflow-y-auto flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Action Header Bar */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-gold/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-sans">
              Editorial Carte · Autumn 2026
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/mehraab-autumn-tasting-menu.pdf"
              download="MEHRAAB-Autumn-Tasting-Menu-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-obsidian text-xs font-sans uppercase tracking-[0.18em] font-semibold rounded-xs hover:bg-ivory transition-colors shadow-sm"
            >
              <span>📥 Download Official PDF</span>
            </a>

            <a
              href="/mehraab-autumn-tasting-menu.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gold/15 hover:bg-gold hover:text-obsidian border border-gold/40 text-gold text-xs font-sans uppercase tracking-[0.18em] rounded-xs transition-colors"
            >
              <span>📄 View Fullscreen PDF</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="w-8 h-8 rounded-full border border-gold/30 text-ivory hover:text-gold flex items-center justify-center transition-colors text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Archival Notice Banner */}
        <div className="mb-8 p-4 bg-gold/10 border border-gold/30 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-gold block tracking-wide">
              ✨ Official Archival Print Carte (Vector PDF)
            </span>
            <span className="text-ivory/70 font-light">
              Crafted as a standalone 2-page A4 document with gold borders, sommelier notes, and chef signature.
            </span>
          </div>
          <a
            href="/mehraab-autumn-tasting-menu.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 bg-gold/20 hover:bg-gold hover:text-obsidian border border-gold/50 text-gold text-[11px] font-semibold uppercase tracking-[0.18em] rounded-xs transition-colors"
          >
            Open Standalone PDF ↗
          </a>
        </div>

        {/* The Printable Carte View */}
        <div className="space-y-12">
          {/* Menu Title Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto border-b border-gold/20 pb-10">
            {/* Arch Silhouette Ornament */}
            <div className="w-12 h-14 mx-auto text-gold opacity-80">
              <svg viewBox="0 0 48 56" fill="none" className="w-full h-full stroke-gold">
                <path d="M 6 54 V 28 C 6 15 16 7 24 2 C 32 7 42 15 42 28 V 54" strokeWidth="1.5" />
                <path d="M 12 54 V 30 C 12 20 18 13 24 9 C 30 13 36 20 36 30 V 54" strokeWidth="0.8" opacity="0.6" />
                <circle cx="24" cy="9" r="1.5" fill="currentColor" />
              </svg>
            </div>

            <div className="space-y-1">
              <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-gold font-light">
                MEHRAAB · Ballard Estate, Fort, Mumbai
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-light text-ivory tracking-tight">
                {menu.title}
              </h2>
              <p className="font-serif italic text-gold text-lg sm:text-xl">
                {menu.subtitle}
              </p>
            </div>

            <p className="font-sans text-xs text-ivory/60 font-light tracking-wider uppercase">
              {menu.curator}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs font-sans text-gold">
              <span className="border-r border-gold/25 pr-6">{menu.priceFood}</span>
              <span className="border-r border-gold/25 pr-6">{menu.pricePairing}</span>
              <span>{menu.serviceHours}</span>
            </div>
          </div>

          {/* Courses List */}
          <div className="space-y-10 max-w-3xl mx-auto">
            {menu.courses.map((course) => (
              <article key={course.courseNumber} className="space-y-2.5 pb-8 border-b border-gold/10">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-gold/80 font-mono">
                    {course.courseNumber}
                  </span>
                  <span className="text-[11px] font-sans text-ivory/50 uppercase tracking-widest font-light">
                    {course.title}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-xl sm:text-2xl text-ivory tracking-wide font-light">
                    {course.dish}
                  </h3>
                  <p className="text-xs font-sans text-gold/90 uppercase tracking-wider font-light">
                    {course.subtitle}
                  </p>
                </div>

                <p className="font-sans text-xs sm:text-sm text-ivory/75 font-light leading-relaxed">
                  {course.description}
                </p>

                {course.vegetarianAlternative && (
                  <p className="text-[11px] font-sans text-emerald-400/80 italic font-light">
                    🌱 Vegetarian Sequence: {course.vegetarianAlternative}
                  </p>
                )}

                {/* Sommelier & Botanical Flight Pairings */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-sans">
                  <div className="p-2.5 bg-obsidian/70 border border-gold/15 rounded-xs flex items-center gap-2">
                    <span className="text-gold">🍷</span>
                    <div>
                      <span className="text-gold/70 uppercase text-[9px] block">Wine Pairing</span>
                      <span className="text-ivory/90">{course.pairing.wine}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-obsidian/70 border border-gold/15 rounded-xs flex items-center gap-2">
                    <span className="text-gold">🌿</span>
                    <div>
                      <span className="text-gold/70 uppercase text-[9px] block">Botanical Flight</span>
                      <span className="text-ivory/90">{course.pairing.botanical}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Digestif / Ceremony Note */}
          <div className="p-6 bg-espresso/30 border border-gold/20 rounded-xs text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-sans block">
              The Concluding Ritual
            </span>
            <p className="font-serif text-lg text-ivory">
              Pashmina Saffron Qahwah & Green Almond Samovar
            </p>
            <p className="font-sans text-xs text-ivory/70 font-light leading-relaxed">
              Brewed live table-side from a hand-hammered 19th-century copper Samovar with grade-A Pampore saffron, wild forest honey, and sun-dried cinnamon bark.
            </p>
          </div>

          {/* Carte Footer Protocol */}
          <div className="text-center pt-6 border-t border-gold/20 space-y-2 text-xs font-sans text-ivory/50 font-light">
            <p>
              Please inform the Maître D’ desk of all severe allergies 48 hours prior to seating.
            </p>
            <p className="text-[11px] text-gold/70 uppercase tracking-widest font-mono">
              MEHRAAB HOUSE · 14 CALICUT ROAD · BALLARD ESTATE · MUMBAI
            </p>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden during print) */}
        <div className="print:hidden mt-10 pt-6 border-t border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 border border-gold/30 text-ivory/70 hover:text-ivory text-xs uppercase tracking-[0.2em] font-sans transition-colors"
          >
            Close Carte
          </button>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a
              href="/mehraab-autumn-tasting-menu.pdf"
              download="MEHRAAB-Autumn-Tasting-Menu-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gold text-obsidian text-xs uppercase tracking-[0.2em] font-semibold font-sans hover:bg-ivory transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>📥 Download Official PDF (254 KB)</span>
            </a>

            <button
              type="button"
              onClick={() => {
                onClose()
                if (onReserve) onReserve()
              }}
              className="px-6 py-3 border border-gold/50 text-gold text-xs uppercase tracking-[0.2em] font-medium font-sans hover:bg-gold/10 transition-colors"
            >
              Reserve Chef's Table
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

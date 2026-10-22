export function PrivateDining() {
  return (
    <section
      id="private-dining"
      className="relative py-24 sm:py-32 bg-[#141414] text-ivory border-t border-gold/15 overflow-hidden scroll-mt-24"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-espresso/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-gold/50" />
            <span className="text-[11px] uppercase tracking-[0.35em] text-gold font-sans font-light">
              Exclusive Salon & Gatherings
            </span>
            <span className="w-8 h-[1px] bg-gold/50" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-ivory mb-6 leading-tight">
            The Parda Salon: <br />
            <span className="italic text-gold">A Sanctuary for Privileged Evenings.</span>
          </h2>

          <p className="font-sans font-light text-sm sm:text-base text-ivory/75 leading-relaxed">
            Concealed behind a monumental hand-patinated brass archway, The Parda Salon offers absolute
            discretion for intimate banquets of up to 16 guests. Here, culinary art meets aristocratic
            Indian hospitality with dedicated sommelier guidance and private kitchen brigade service.
          </p>
        </div>

        {/* Feature Grid: Image + Experience Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16">
          {/* Left Column: Atmospheric Private Dining Image */}
          <div className="lg:col-span-7 relative group">
            <div className="relative overflow-hidden rounded-xs border border-gold/30 aspect-[16/10]">
              <img
                src="https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1600&q=80"
                alt="The Parda Salon private dining room with warm candlelight and gold accents"
                className="w-full h-full object-cover object-center filter brightness-[0.8] contrast-[1.15] transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-sans block mb-1">
                  Private Salon Capacity
                </span>
                <p className="font-serif text-lg sm:text-xl text-ivory">
                  Seated Banquets for 8 to 16 Honored Guests
                </p>
              </div>
            </div>

            {/* Architectural Frame Accents */}
            <div
              className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-gold pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-gold pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* Right Column: Key Privileges & Service Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <div className="border-l-2 border-gold/40 pl-5 space-y-1.5">
                <h4 className="font-serif text-xl text-ivory">Bespoke Tasting Dramaturgy</h4>
                <p className="font-sans text-xs sm:text-sm text-ivory/70 font-light leading-relaxed">
                  Personalized 7 or 9-course tasting menus designed around your guests' palate, rare spices,
                  and dietary inclinations.
                </p>
              </div>

              <div className="border-l-2 border-gold/40 pl-5 space-y-1.5">
                <h4 className="font-serif text-xl text-ivory">Dedicated Cellar & Sommelier</h4>
                <p className="font-sans text-xs sm:text-sm text-ivory/70 font-light leading-relaxed">
                  Private wine and botanical spirit pairings presented table-side from our climate-controlled
                  vintage reserve.
                </p>
              </div>

              <div className="border-l-2 border-gold/40 pl-5 space-y-1.5">
                <h4 className="font-serif text-xl text-ivory">Acoustic & Visual Seclusion</h4>
                <p className="font-sans text-xs sm:text-sm text-ivory/70 font-light leading-relaxed">
                  Loomed Banarasi raw silk wall coverings, private powder room, and dedicated discreet service entrance.
                </p>
              </div>
            </div>

            {/* Direct Action */}
            <div className="pt-2">
              <a
                href="#reservations"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gold text-obsidian font-sans text-xs uppercase tracking-[0.25em] font-semibold hover:bg-ivory transition-colors duration-300 w-full sm:w-auto text-center"
              >
                <span>Inquire For Salon Buyout</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

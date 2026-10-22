import { useState } from 'react'
import { ARCHITECTURE_SPACES, type SpaceItem } from '../data/spacesData'

export function ArchitectureSpaces() {
  const [activeSpaceId, setActiveSpaceId] = useState<string>('grand-mehraab')

  const currentSpace: SpaceItem =
    ARCHITECTURE_SPACES.find((space) => space.id === activeSpaceId) || ARCHITECTURE_SPACES[0]

  return (
    <section
      id="architecture"
      className="relative py-24 sm:py-32 bg-obsidian text-ivory border-t border-gold/15 overflow-hidden"
    >
      {/* Decorative background radial ambient glow */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-espresso/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div id="experience" className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-gold/50" />
            <span className="text-[11px] uppercase tracking-[0.35em] text-gold font-sans font-light">
              Spaces & Architecture
            </span>
            <span className="w-8 h-[1px] bg-gold/50" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-ivory mb-6 leading-tight">
            The Architecture of <br />
            <span className="italic text-gold">Shadow, Stone & Light.</span>
          </h2>

          <p className="font-sans font-light text-sm sm:text-base text-ivory/75 leading-relaxed">
            Mehraab was conceived as an architectural dialogue between 16th-century Mughal archways,
            monumental stepwell geometry, and minimalist contemporary luxury. Every corner is sculpted
            to create privacy, reverence, and sensory warmth.
          </p>
        </div>

        {/* Space Selector Tabs */}
        <div
          role="tablist"
          aria-label="Architectural Spaces"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16"
        >
          {ARCHITECTURE_SPACES.map((space, idx) => {
            const isSelected = space.id === activeSpaceId
            return (
              <button
                key={space.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveSpaceId(space.id)}
                className={`p-4 sm:p-5 text-left border rounded-xs transition-all duration-300 relative group flex flex-col justify-between ${
                  isSelected
                    ? 'border-gold bg-espresso/50 shadow-xl shadow-obsidian'
                    : 'border-gold/20 bg-espresso/15 hover:border-gold/40 hover:bg-espresso/25'
                }`}
              >
                <div>
                  <span className="block font-sans text-[10px] uppercase tracking-[0.25em] text-gold/70 mb-1">
                    0{idx + 1} · Pavilion
                  </span>
                  <span
                    className={`font-serif text-base sm:text-lg block tracking-wide transition-colors ${
                      isSelected ? 'text-gold' : 'text-ivory group-hover:text-gold'
                    }`}
                  >
                    {space.title}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-gold/15 flex items-center justify-between text-[11px] font-sans text-ivory/60">
                  <span>{space.capacity}</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      isSelected ? 'bg-gold' : 'bg-transparent border border-gold/40'
                    }`}
                  />
                </div>
              </button>
            )
          })}
        </div>

        {/* Active Space Feature Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center bg-espresso/20 border border-gold/20 rounded-xs p-6 sm:p-10 lg:p-12 backdrop-blur-sm">
          {/* Left Column: Image with Architectural Frame */}
          <div className="lg:col-span-7 relative group">
            <div className="relative overflow-hidden rounded-xs border border-gold/30 aspect-[16/10] sm:aspect-[16/11]">
              <img
                key={currentSpace.id}
                src={currentSpace.image}
                alt={currentSpace.title}
                className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.1] transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />

              {/* Quote overlay at bottom of image */}
              <div className="absolute bottom-4 left-6 right-6">
                <p className="font-serif italic text-gold text-sm sm:text-base tracking-wide drop-shadow-md">
                  {currentSpace.quote}
                </p>
              </div>
            </div>

            {/* Architectural Arch Corner Accent */}
            <div
              className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-gold pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-gold pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* Right Column: Architectural Narrative & Specifications */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-gold font-sans font-light block mb-2">
                {currentSpace.subtitle}
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-ivory mb-4">
                {currentSpace.title}
              </h3>

              <p className="font-sans font-light text-sm text-ivory/80 leading-relaxed mb-6">
                {currentSpace.description}
              </p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gold/15 text-xs font-sans">
              <div>
                <span className="text-gold/70 uppercase tracking-wider block text-[10px] mb-1">
                  Floor Area
                </span>
                <span className="font-medium text-ivory">{currentSpace.dimensions}</span>
              </div>
              <div>
                <span className="text-gold/70 uppercase tracking-wider block text-[10px] mb-1">
                  Seating Capacity
                </span>
                <span className="font-medium text-ivory">{currentSpace.capacity}</span>
              </div>
            </div>

            {/* Materiality Elements */}
            <div>
              <span className="text-gold/70 uppercase tracking-wider block text-[10px] font-sans mb-2.5">
                Primary Materials & Craft
              </span>
              <div className="flex flex-wrap gap-2">
                {currentSpace.materials.map((material) => (
                  <span
                    key={material}
                    className="text-[11px] font-sans px-3 py-1 bg-obsidian/70 border border-gold/25 rounded-xs text-ivory/80"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>

            {/* Reservation / Inquire Action */}
            <div className="pt-2">
              <a
                href="#reservations"
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-gold text-obsidian font-sans text-xs uppercase tracking-[0.25em] font-semibold hover:bg-ivory transition-colors duration-300"
              >
                <span>Reserve Experience in This Space</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Materiality Palette Ribbon */}
        <div className="mt-20 pt-12 border-t border-gold/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          <div>
            <span className="font-sans text-[10px] text-gold tracking-[0.25em] uppercase block mb-1">
              01 · Structure
            </span>
            <h4 className="font-serif text-lg text-ivory mb-2">Deccan Basalt Stone</h4>
            <p className="font-sans text-xs text-ivory/60 leading-relaxed font-light">
              Quarried from western volcanic formations, hand-chiseled with antique tooth chisels.
            </p>
          </div>

          <div>
            <span className="font-sans text-[10px] text-gold tracking-[0.25em] uppercase block mb-1">
              02 · Illumination
            </span>
            <h4 className="font-serif text-lg text-ivory mb-2">Patinated Raw Brass</h4>
            <p className="font-sans text-xs text-ivory/60 leading-relaxed font-light">
              Hand-spun metalwork treated with organic wax, aging with deep ember reflections.
            </p>
          </div>

          <div>
            <span className="font-sans text-[10px] text-gold tracking-[0.25em] uppercase block mb-1">
              03 · Joinery
            </span>
            <h4 className="font-serif text-lg text-ivory mb-2">Charred Teakwood</h4>
            <p className="font-sans text-xs text-ivory/60 leading-relaxed font-light">
              Reclaimed century-old Indian teak surface-charred to reveal rich grain depth and durability.
            </p>
          </div>

          <div>
            <span className="font-sans text-[10px] text-gold tracking-[0.25em] uppercase block mb-1">
              04 · Tactility
            </span>
            <h4 className="font-serif text-lg text-ivory mb-2">Raw Banarasi Silk</h4>
            <p className="font-sans text-xs text-ivory/60 leading-relaxed font-light">
              Loomed by master weavers in Varanasi to provide acoustic absorption and intimate seclusion.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { MENU_CATEGORIES, SIGNATURE_DISHES, type MenuItem } from '../data/menuData'

export function CulinaryMenu() {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filteredDishes =
    activeCategory === 'all'
      ? SIGNATURE_DISHES
      : SIGNATURE_DISHES.filter((dish) => dish.category === activeCategory)

  return (
    <section id="menu" className="relative py-24 sm:py-32 bg-obsidian text-ivory border-t border-gold/15">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-espresso/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header: Philosophy & Story */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-gold/50" />
            <span className="text-[11px] uppercase tracking-[0.35em] text-gold font-sans font-light">
              Culinary Philosophy
            </span>
            <span className="w-8 h-[1px] bg-gold/50" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-ivory mb-6 leading-tight">
            A Symphony of Smoke, <br />
            <span className="italic text-gold">Spice & Sacred Heritage.</span>
          </h2>

          <p className="font-sans font-light text-sm sm:text-base text-ivory/75 leading-relaxed">
            Rooted in India’s ancient royal culinary dynasties and coastal trade routes, refined through
            contemporary gastronomic architecture. Every plate honors coal-fired earthen clay ovens,
            stone-crushed spices, and wild Himalayan ingredients.
          </p>
        </div>

        {/* Category Tabs */}
        <div
          role="tablist"
          aria-label="Menu Categories"
          className="flex items-center justify-start sm:justify-center gap-2 sm:gap-4 overflow-x-auto pb-4 mb-14 no-scrollbar border-b border-gold/15"
        >
          {MENU_CATEGORIES.map((category) => {
            const isSelected = activeCategory === category.id
            return (
              <button
                key={category.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveCategory(category.id)}
                className={`whitespace-nowrap px-5 py-2.5 text-xs uppercase tracking-[0.22em] font-sans transition-all duration-300 rounded-xs relative ${
                  isSelected
                    ? 'text-gold font-medium bg-espresso/50 border border-gold/40'
                    : 'text-ivory/60 hover:text-ivory border border-transparent hover:border-gold/20'
                }`}
              >
                {category.label}
                {isSelected && (
                  <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-6 h-[2px] bg-gold" />
                )}
              </button>
            )
          })}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-20">
          {filteredDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>

        {/* Highlight Card: Royal Tasting Menu Experience */}
        <div className="relative overflow-hidden bg-espresso/30 border border-gold/30 rounded-xs p-8 sm:p-12 lg:p-16 text-center backdrop-blur-sm">
          {/* Subtle Arch Outline behind banner */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <svg className="w-96 h-96 stroke-gold" viewBox="0 0 48 56" fill="none">
              <path
                d="M 6 54 V 28 C 6 15 16 7 24 2 C 32 7 42 15 42 28 V 54"
                strokeWidth="1"
              />
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-[11px] uppercase tracking-[0.35em] text-gold font-sans font-light">
              Chef's Table Experience
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-light text-ivory">
              The Seven-Course Mehraab Odyssey
            </h3>
            <p className="font-sans font-light text-sm text-ivory/80 leading-relaxed">
              An immersive twilight journey curated by Executive Chef Samarpan Roy. Seven courses pairing
              ancient Indian fire-cooking with rare boutique wines and regional botanicals.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#reservations"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-gold text-obsidian font-sans text-xs uppercase tracking-[0.25em] font-semibold hover:bg-ivory transition-colors duration-300"
              >
                Inquire For Chef's Table
              </a>
              <a
                href="#tasting-menu-pdf"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-gold/40 text-gold font-sans text-xs uppercase tracking-[0.22em] hover:bg-gold/10 transition-colors duration-300"
              >
                Download Autumn Tasting Menu (PDF)
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DishCard({ dish }: { dish: MenuItem }) {
  const dietaryBadge = {
    veg: { dot: 'bg-emerald-500', label: 'Vegetarian' },
    'non-veg': { dot: 'bg-rose-500', label: 'Non-Vegetarian' },
    vegan: { dot: 'bg-amber-400', label: 'Plant-Based' },
  }[dish.dietary]

  return (
    <article className="group relative bg-espresso/20 hover:bg-espresso/40 border border-gold/15 hover:border-gold/40 p-7 sm:p-8 rounded-xs transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top Header: Title & Price */}
        <div className="flex items-baseline justify-between gap-4 mb-2">
          <div className="flex items-center gap-2.5">
            <h4 className="font-serif text-xl sm:text-2xl font-light tracking-wide text-ivory group-hover:text-gold transition-colors duration-300">
              {dish.name}
            </h4>
            {dish.isSignature && (
              <span className="hidden sm:inline-block text-[9px] uppercase tracking-[0.2em] font-sans px-2 py-0.5 border border-gold/40 text-gold bg-espresso/60 rounded-xs">
                Signature
              </span>
            )}
          </div>
          <span className="font-sans font-medium text-lg text-gold tracking-wider shrink-0">
            {dish.price}
          </span>
        </div>

        {/* Subtitle / Key Provenance */}
        <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-gold/80 mb-3">
          {dish.subtitle}
        </p>

        {/* Narrative Description */}
        <p className="font-sans font-light text-xs sm:text-sm text-ivory/70 leading-relaxed">
          {dish.description}
        </p>
      </div>

      {/* Card Footer: Dietary indicator & Signature tag on mobile */}
      <div className="flex items-center justify-between border-t border-gold/10 pt-4 mt-6 text-[10px] uppercase tracking-[0.2em] text-ivory/50 font-sans">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${dietaryBadge.dot}`} />
          <span>{dietaryBadge.label}</span>
        </div>
        {dish.isSignature && (
          <span className="sm:hidden text-gold font-medium">Signature</span>
        )}
      </div>
    </article>
  )
}

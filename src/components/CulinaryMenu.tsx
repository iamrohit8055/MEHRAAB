import { useState, useEffect } from 'react'
import { MENU_CATEGORIES, SIGNATURE_DISHES, type MenuItem } from '../data/menuData'

const ACCOLADES = [
  {
    quote: '“Mehraab does not merely present contemporary Indian gastronomy—it stages a reverie of smoke, stone and sacred heritage.”',
    publication: 'Architectural Digest India',
    designation: 'Restaurant of the Year 2026',
  },
  {
    quote: '“The 24-hour charcoal-smoked dal and wild Kashmiri morels elevate classical Indian cooking into the highest realms of modern art.”',
    publication: 'Condé Nast Traveller',
    designation: 'Gold List · Best Luxury Dining',
  },
  {
    quote: '“An unmissable architectural pilgrimage in Mumbai. Intimate, mysterious, and exquisitely executed.”',
    publication: 'The World’s 50 Best Discovery',
    designation: 'Curated Selection 2026',
  },
]

export function CulinaryMenu() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null)

  const filteredDishes =
    activeCategory === 'all'
      ? SIGNATURE_DISHES
      : SIGNATURE_DISHES.filter((dish) => dish.category === activeCategory)

  // Close modal on Escape key for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedDish(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Lock body scroll when modal is active
  useEffect(() => {
    if (selectedDish) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedDish])

  return (
    <section
      id="experience"
      className="relative py-24 sm:py-32 bg-obsidian text-ivory border-t border-gold/15 scroll-mt-20 overflow-hidden"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-espresso/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Editorial Accolades Prestige Strip */}
        <div className="mb-20 pb-16 border-b border-gold/15 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {ACCOLADES.map((item) => (
            <div key={item.publication} className="flex flex-col justify-between space-y-3">
              <p className="font-serif italic text-gold text-base sm:text-lg leading-relaxed">
                {item.quote}
              </p>
              <div>
                <strong className="block font-sans text-xs uppercase tracking-[0.2em] text-ivory font-medium">
                  {item.publication}
                </strong>
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold/60 font-sans">
                  {item.designation}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Section Header: Philosophy & Story */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-gold/50" />
            <span className="text-[11px] uppercase tracking-[0.35em] text-gold font-sans font-light">
              The Experience · Culinary Philosophy
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
          id="menu"
          role="tablist"
          aria-label="Menu Categories"
          className="scroll-mt-28 flex items-center justify-start sm:justify-center gap-2 sm:gap-4 overflow-x-auto pb-4 mb-14 no-scrollbar border-b border-gold/15"
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

        {/* Menu Items Grid: Rich Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-20">
          {filteredDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onInspect={() => setSelectedDish(dish)}
            />
          ))}
        </div>

        {/* Highlight Card: Royal Tasting Menu Experience */}
        <div className="relative overflow-hidden bg-espresso/30 border border-gold/30 rounded-xs p-8 sm:p-12 lg:p-16 text-center backdrop-blur-sm">
          {/* Subtle Arch Outline behind banner */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <svg className="w-96 h-96 stroke-gold" viewBox="0 0 48 56" fill="none">
              <path d="M 6 54 V 28 C 6 15 16 7 24 2 C 32 7 42 15 42 28 V 54" strokeWidth="1" />
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

      {/* Interactive Dish Sourcing & Terroir Modal */}
      {selectedDish && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedDish.name}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-obsidian/90 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedDish(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#1c1c1c] border border-gold/40 rounded-xs overflow-hidden shadow-2xl shadow-obsidian text-left flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative h-64 sm:h-80 overflow-hidden shrink-0">
              <img
                src={selectedDish.image}
                alt={selectedDish.name}
                className="w-full h-full object-cover object-center filter brightness-[0.96] contrast-[1.08] saturate-[1.12]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-[#1c1c1c]/40 to-transparent" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedDish(null)}
                aria-label="Close details"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-obsidian/80 border border-gold/30 text-ivory hover:text-gold flex items-center justify-center transition-colors"
              >
                ✕
              </button>

              {/* Price & Badge */}
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-sans block mb-1">
                    {selectedDish.origin}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-ivory">
                    {selectedDish.name}
                  </h3>
                </div>
                <span className="font-sans text-xl sm:text-2xl font-medium text-gold">
                  {selectedDish.price}
                </span>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <p className="font-sans text-sm sm:text-base text-ivory/80 leading-relaxed font-light">
                {selectedDish.description}
              </p>

              {/* Culinary Ritual & Preparation */}
              {selectedDish.ritual && (
                <div className="bg-espresso/30 border border-gold/20 p-4 rounded-xs space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-sans block">
                    The Culinary Ritual
                  </span>
                  <p className="font-sans text-xs text-ivory/90 font-light">
                    {selectedDish.ritual}
                  </p>
                </div>
              )}

              {/* Flavor Profile Notes */}
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold/80 font-sans block mb-2.5">
                  Sensory Flavor Profile
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedDish.flavorNotes.map((note) => (
                    <span
                      key={note}
                      className="text-xs font-sans px-3 py-1 bg-obsidian border border-gold/30 rounded-xs text-gold/90"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sommelier Pairing */}
              <div className="pt-2 border-t border-gold/15 flex items-center justify-between text-xs font-sans">
                <span className="text-ivory/60">Sommelier Recommendation:</span>
                <span className="text-gold font-medium">{selectedDish.pairing}</span>
              </div>

              {/* Modal CTA */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <a
                  href="#reservations"
                  onClick={() => setSelectedDish(null)}
                  className="flex-1 py-3.5 bg-gold text-obsidian text-center font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:bg-ivory transition-colors"
                >
                  Reserve Table & Experience Dish
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function DishCard({
  dish,
  onInspect,
}: {
  dish: MenuItem
  onInspect: () => void
}) {
  const dietaryBadge = {
    veg: { dot: 'bg-emerald-500', label: 'Vegetarian' },
    'non-veg': { dot: 'bg-rose-500', label: 'Non-Vegetarian' },
    vegan: { dot: 'bg-amber-400', label: 'Plant-Based' },
  }[dish.dietary]

  return (
    <article className="group relative bg-espresso/20 hover:bg-espresso/35 border border-gold/15 hover:border-gold/40 rounded-xs transition-all duration-500 flex flex-col justify-between overflow-hidden">
      {/* High-Resolution Dish Photography with Arch Corner Vignette */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover object-center filter brightness-[0.96] contrast-[1.08] saturate-[1.12] transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent opacity-90" />

        {/* Signature Badge */}
        {dish.isSignature && (
          <span className="absolute top-4 left-4 text-[9px] uppercase tracking-[0.2em] font-sans px-2.5 py-1 border border-gold/50 text-gold bg-obsidian/80 backdrop-blur-xs rounded-xs">
            Signature Dish
          </span>
        )}

        {/* Interactive "View Sourcing" Pill on Hover */}
        <button
          type="button"
          onClick={onInspect}
          className="absolute bottom-3 right-4 inline-flex items-center gap-1.5 px-3 py-1 bg-obsidian/85 border border-gold/40 text-[10px] font-sans text-gold uppercase tracking-[0.2em] rounded-xs opacity-90 group-hover:opacity-100 hover:bg-gold hover:text-obsidian transition-all"
        >
          <span>View Sourcing</span>
          <span>→</span>
        </button>
      </div>

      {/* Card Content Area */}
      <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
        <div>
          {/* Title & Price */}
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <h4
              onClick={onInspect}
              className="font-serif text-xl sm:text-2xl font-light tracking-wide text-ivory group-hover:text-gold transition-colors duration-300 cursor-pointer"
            >
              {dish.name}
            </h4>
            <span className="font-sans font-medium text-lg text-gold tracking-wider shrink-0">
              {dish.price}
            </span>
          </div>

          {/* Subtitle / Key Provenance */}
          <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-gold/80 mb-3">
            {dish.subtitle}
          </p>

          {/* Narrative Description */}
          <p className="font-sans font-light text-xs sm:text-sm text-ivory/70 leading-relaxed mb-4">
            {dish.description}
          </p>

          {/* Sensory Flavor Notes Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {dish.flavorNotes.map((note) => (
              <span
                key={note}
                className="text-[10px] font-sans px-2 py-0.5 bg-obsidian/60 border border-gold/20 text-gold/90 rounded-xs"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer: Dietary indicator & Sommelier pairing snippet */}
        <div className="border-t border-gold/10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] uppercase tracking-[0.18em] text-ivory/60 font-sans">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${dietaryBadge.dot}`} />
            <span>{dietaryBadge.label}</span>
          </div>

          <span className="text-gold/70 truncate max-w-xs font-light">
            🍷 {dish.pairing}
          </span>
        </div>
      </div>
    </article>
  )
}

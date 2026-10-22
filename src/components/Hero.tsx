export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden bg-obsidian text-ivory">
      {/* Background Image Layer with Cinematic Darkness & Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85"
          alt="Atmospheric contemporary Indian fine dining interior with warm amber lights and arched architectural silhouettes"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.32] contrast-[1.15] saturate-[0.85] transition-transform duration-1000 ease-out"
          loading="eager"
          fetchPriority="high"
        />

        {/* Layered luxury vignette gradients to blend smoothly into Obsidian Black */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-obsidian/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-transparent to-obsidian/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#171717_85%)]" />

        {/* Architectural subtle arch watermark in background */}
        <div
          className="absolute inset-x-0 bottom-0 top-12 pointer-events-none flex items-center justify-center opacity-10"
          aria-hidden="true"
        >
          <svg
            className="w-[85vw] max-w-4xl h-full stroke-gold"
            viewBox="0 0 100 130"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d="M 10 130 V 70 C 10 40 35 20 50 5 C 65 20 90 40 90 70 V 130"
              strokeWidth="0.35"
              strokeDasharray="2 2"
            />
            <path
              d="M 20 130 V 75 C 20 48 38 30 50 16 C 62 30 80 48 80 75 V 130"
              strokeWidth="0.25"
            />
          </svg>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 sm:pt-24 lg:pt-28 pb-12 flex-1 flex flex-col items-center justify-center text-center">
        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-3 mb-6 sm:mb-8">
          <span className="w-8 sm:w-12 h-[1px] bg-gold/50" />
          <p className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.35em] text-gold font-light">
            Café · Cuisine · Culture
          </p>
          <span className="w-8 sm:w-12 h-[1px] bg-gold/50" />
        </div>

        {/* Primary Cinematic Headline */}
        <h1 className="font-serif font-light text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-[1.08] text-ivory max-w-4xl mb-8 sm:mb-10 selection:bg-gold selection:text-obsidian">
          An entrance to <br className="hidden sm:inline" />
          <span className="italic font-normal text-gold">extraordinary.</span>
        </h1>

        {/* Brand Statement */}
        <p className="font-sans font-light text-sm sm:text-base md:text-lg text-ivory/80 max-w-2xl leading-relaxed mb-10 sm:mb-14">
          A sanctuary where sacred culinary heritage converges with contemporary Indian luxury.
          From spice-scented dawn roasts to twilight fine dining under hand-carved stone arches.
        </p>

        {/* Action Buttons / Links */}
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 w-full sm:w-auto">
          {/* Primary Action: Discover Our Menu */}
          <a
            href="#menu"
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 bg-gold text-obsidian font-sans text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 hover:bg-ivory hover:shadow-2xl hover:shadow-gold/20"
          >
            <span>Discover Our Menu</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>

          {/* Secondary Action: Explore Spaces */}
          <a
            href="#experience"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 sm:px-10 py-4 font-sans text-xs uppercase tracking-[0.25em] text-ivory/90 border border-gold/30 hover:border-gold hover:text-gold transition-all duration-300 backdrop-blur-xs bg-espresso/20"
          >
            Explore The Space
          </a>
        </div>
      </div>

      {/* Atmospheric Bottom Meta Bar & Scroll Indicator */}
      <div className="relative z-10 w-full border-t border-gold/15 bg-obsidian/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-sans tracking-[0.2em] text-ivory/60 uppercase">
          {/* Left: Location Coordinates */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span>Fort, Mumbai · 18.9388° N, 72.8354° E</span>
          </div>

          {/* Center: Delicate Scroll Prompt with subtle motion */}
          <a
            href="#menu"
            className="hidden lg:flex items-center gap-3 text-gold/80 hover:text-gold transition-colors duration-300"
            aria-label="Scroll to discover menu"
          >
            <span className="text-[10px] tracking-[0.3em]">Scroll to enter</span>
            <span className="w-5 h-8 border border-gold/40 rounded-full flex items-start justify-center p-1">
              <span className="w-1 h-2 bg-gold rounded-full animate-bounce" />
            </span>
          </a>

          {/* Right: Service Hours */}
          <div className="text-right">
            <span>Café from 08:00 · Dining from 18:30</span>
          </div>
        </div>
      </div>
    </section>
  )
}

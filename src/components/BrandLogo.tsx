interface BrandLogoProps {
  /** Size variant for different contexts (e.g. navbar vs hero) */
  size?: 'sm' | 'md' | 'lg'
  /** Whether to show the descriptor "CAFÉ · CUISINE · CULTURE" */
  showDescriptor?: boolean
  className?: string
}

export function BrandLogo({
  size = 'md',
  showDescriptor = true,
  className = '',
}: BrandLogoProps) {
  // Dimensions and text sizing tuned for editorial balance
  const dimensions = {
    sm: { icon: 28, title: 'text-lg tracking-[0.2em]', desc: 'text-[9px] tracking-[0.25em]' },
    md: { icon: 38, title: 'text-2xl tracking-[0.25em]', desc: 'text-[10px] tracking-[0.3em]' },
    lg: { icon: 54, title: 'text-4xl tracking-[0.28em]', desc: 'text-xs tracking-[0.35em]' },
  }[size]

  return (
    <a
      href="#"
      className={`group inline-flex items-center gap-3.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold ${className}`}
      aria-label="MEHRAAB — Home"
    >
      {/* Contemporary Indian Arch Symbol (Mehraab motif) */}
      <div className="relative flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105">
        <svg
          width={dimensions.icon}
          height={(dimensions.icon * 56) / 48}
          viewBox="0 0 48 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gold transition-colors duration-300"
          aria-hidden="true"
        >
          {/* Outer pointed arch with classic ogee apex */}
          <path
            d="M 6 54 V 28 C 6 15 16 7 24 2 C 32 7 42 15 42 28 V 54"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Inner concentric arch line echoing architectural stone fluting */}
          <path
            d="M 12 54 V 30 C 12 20 18 13 24 9 C 30 13 36 20 36 30 V 54"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Subtle keystone / lotus finial detail at the arch apex */}
          <circle cx="24" cy="9" r="1.5" fill="currentColor" />
          <path
            d="M 24 2 V 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Horizontal foundation threshold line */}
          <path
            d="M 3 54 H 45"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Wordmark & Descriptor */}
      <div className="flex flex-col justify-center text-left">
        <span
          className={`font-serif font-medium uppercase text-ivory transition-colors duration-300 group-hover:text-gold ${dimensions.title}`}
        >
          Mehraab
        </span>
        {showDescriptor && (
          <span
            className={`font-sans font-light uppercase text-gold/80 transition-colors duration-300 group-hover:text-gold ${dimensions.desc}`}
          >
            Café · Cuisine · Culture
          </span>
        )}
      </div>
    </a>
  )
}

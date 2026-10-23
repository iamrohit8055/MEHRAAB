interface StatsData {
  total: number
  pending: number
  confirmed: number
  seatedToday: number
}

interface AdminStatsProps {
  stats: StatsData | null
  isLoading: boolean
}

export function AdminStats({ stats, isLoading }: AdminStatsProps) {
  const cards = [
    {
      label: 'Total Bookings',
      value: stats?.total ?? 0,
      sub: 'All registered covers',
      accent: 'border-gold/30 text-ivory',
      pill: 'bg-gold/10 text-gold',
    },
    {
      label: 'Pending Review',
      value: stats?.pending ?? 0,
      sub: 'Awaiting allocation',
      accent: 'border-amber-500/40 text-amber-300',
      pill: 'bg-amber-500/15 text-amber-400',
    },
    {
      label: 'Confirmed Tables',
      value: stats?.confirmed ?? 0,
      sub: 'Ready for welcome',
      accent: 'border-gold text-gold',
      pill: 'bg-gold/20 text-gold',
    },
    {
      label: 'Seated Tonight',
      value: stats?.seatedToday ?? 0,
      sub: 'Active dining services',
      accent: 'border-emerald-500/40 text-emerald-300',
      pill: 'bg-emerald-500/15 text-emerald-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-espresso/25 border ${card.accent} rounded-xs p-5 sm:p-6 backdrop-blur-sm relative overflow-hidden transition-all duration-300 hover:bg-espresso/35`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-ivory/60 font-sans font-light">
              {card.label}
            </span>
            <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-xs font-sans ${card.pill}`}>
              Live
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-light text-ivory">
              {isLoading ? '...' : card.value}
            </span>
          </div>

          <p className="text-[11px] font-sans text-ivory/50 mt-1 font-light">
            {card.sub}
          </p>
        </div>
      ))}
    </div>
  )
}

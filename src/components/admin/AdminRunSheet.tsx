import { useState, useMemo } from 'react'
import { parseDietaryAlerts } from '../../utils/briefing'

export interface ReservationRow {
  id: string
  reference_code: string
  guest_id: string
  party_size: number
  date: string
  time_slot: string
  space_id: string
  status: 'PENDING' | 'CONFIRMED' | 'SEATED' | 'CANCELLED' | 'COMPLETED'
  special_notes: string | null
  created_at: string
  guest_name: string
  guest_email: string
  guest_phone: string
  vip_status?: number
}

interface AdminRunSheetProps {
  reservations: ReservationRow[]
  isLoading: boolean
  token: string
  stats?: { total: number; pending: number; confirmed: number; seatedToday: number } | null
  onStatusChange: (id: string, newStatus: ReservationRow['status']) => void
  onToggleVip: (guestId: string, currentVip: number) => void
  onDeleteReservation: (id: string) => void
  onOpenWalkIn: () => void
  onOpenBriefing: () => void
  selectedDate: string
  setSelectedDate: (date: string) => void
  selectedStatus: string
  setSelectedStatus: (status: string) => void
  onRefresh: () => void
}

const SPACE_LABELS: Record<string, string> = {
  'grand-hall': 'Grand Mehraab Hall',
  courtyard: 'Courtyard of Embers',
  cafe: 'The Roastery Verandah',
  parda: 'The Parda Salon (VIP)',
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

function getTomorrowDate(): string {
  return new Date(Date.now() + 86400000).toISOString().split('T')[0]
}

export function AdminRunSheet({
  reservations,
  isLoading,
  stats: _stats,
  onStatusChange,
  onToggleVip,
  onDeleteReservation,
  onOpenWalkIn,
  onOpenBriefing,
  selectedDate,
  setSelectedDate,
  selectedStatus,
  setSelectedStatus,
  onRefresh,
}: AdminRunSheetProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const today = getTodayDate()
  const tomorrow = getTomorrowDate()

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Dynamic real-time counts across all loaded reservations
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: reservations.length,
      PENDING: 0,
      CONFIRMED: 0,
      SEATED: 0,
      CANCELLED: 0,
      COMPLETED: 0,
    }
    for (const r of reservations) {
      if (counts[r.status] !== undefined) {
        counts[r.status]++
      }
    }
    return counts
  }, [reservations])

  // Instant reactive client-side filtering across Status, Date, and Search
  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      // 1. Status Filter
      if (selectedStatus !== 'ALL' && r.status !== selectedStatus) {
        return false
      }

      // 2. Date Filter
      if (selectedDate !== 'ALL' && r.date !== selectedDate) {
        return false
      }

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matches = (
          r.guest_name.toLowerCase().includes(q) ||
          r.reference_code.toLowerCase().includes(q) ||
          r.guest_email.toLowerCase().includes(q) ||
          r.guest_phone.toLowerCase().includes(q) ||
          (r.special_notes && r.special_notes.toLowerCase().includes(q))
        )
        if (!matches) return false
      }

      return true
    })
  }, [reservations, selectedStatus, selectedDate, searchQuery])

  // Smart status tab click: if selected date has 0 records for this status, auto-switch to 'ALL' dates
  const handleSelectStatus = (stId: string) => {
    setSelectedStatus(stId)
    if (stId !== 'ALL' && selectedDate !== 'ALL') {
      const matchOnActiveDate = reservations.some(
        (r) => r.status === stId && r.date === selectedDate
      )
      if (!matchOnActiveDate) {
        setSelectedDate('ALL')
      }
    }
  }

  return (
    <div className="bg-espresso/20 border border-gold/25 rounded-xs p-6 sm:p-8 backdrop-blur-sm">
      {/* Run Sheet Header & Quick Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gold/15">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-sans block mb-1">
            Table Run Sheet & Service Registry
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-ivory">
            Diner Allocations ({filtered.length})
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Date Switcher */}
          <div className="inline-flex bg-obsidian/80 border border-gold/20 rounded-xs p-1 text-xs font-sans">
            <button
              type="button"
              onClick={() => setSelectedDate(today)}
              className={`px-3 py-1.5 rounded-xs transition-colors ${
                selectedDate === today ? 'bg-gold text-obsidian font-semibold' : 'text-ivory/70 hover:text-gold'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate(tomorrow)}
              className={`px-3 py-1.5 rounded-xs transition-colors ${
                selectedDate === tomorrow ? 'bg-gold text-obsidian font-semibold' : 'text-ivory/70 hover:text-gold'
              }`}
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate('ALL')}
              className={`px-3 py-1.5 rounded-xs transition-colors ${
                selectedDate === 'ALL' ? 'bg-gold text-obsidian font-semibold' : 'text-ivory/70 hover:text-gold'
              }`}
            >
              All Dates
            </button>
          </div>

          {/* Refresh Action */}
          <button
            type="button"
            onClick={onRefresh}
            title="Refresh run sheet"
            className="p-2 border border-gold/30 text-gold hover:bg-gold/10 rounded-xs transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Daily Service Briefing Sheet Button */}
          <button
            type="button"
            onClick={onOpenBriefing}
            title="Open Kitchen & Captains Daily Service Run Sheet Briefing"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-espresso/50 border border-gold/40 text-gold hover:bg-gold hover:text-obsidian font-sans text-xs uppercase tracking-[0.18em] font-semibold rounded-xs transition-colors shadow-sm"
          >
            <span>🖨️ Daily Briefing</span>
          </button>

          {/* New Walk-in Button */}
          <button
            type="button"
            onClick={onOpenWalkIn}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-obsidian font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:bg-ivory transition-colors rounded-xs shadow-md"
          >
            <span>+ Walk-in</span>
          </button>
        </div>
      </div>

      {/* Filter Ribbon: Status Tabs & Search */}
      <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold/10 text-xs font-sans">
        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {[
            { id: 'ALL', label: 'ALL', count: statusCounts.ALL },
            { id: 'PENDING', label: 'PENDING', count: statusCounts.PENDING },
            { id: 'CONFIRMED', label: 'CONFIRMED', count: statusCounts.CONFIRMED },
            { id: 'SEATED', label: 'SEATED', count: statusCounts.SEATED },
            { id: 'CANCELLED', label: 'CANCELLED', count: statusCounts.CANCELLED },
            { id: 'COMPLETED', label: 'COMPLETED', count: statusCounts.COMPLETED },
          ].map((st) => {
            const isSelected = selectedStatus === st.id
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => handleSelectStatus(st.id)}
                className={`px-3 py-1.5 rounded-xs transition-all uppercase tracking-wider text-[11px] whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-espresso/60 text-gold border border-gold/40 font-medium'
                    : 'text-ivory/60 hover:text-ivory border border-transparent hover:border-gold/20'
                }`}
              >
                <span>{st.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? 'bg-gold text-obsidian font-bold'
                      : 'bg-obsidian border border-gold/20 text-gold/80'
                  }`}
                >
                  {st.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <input
            type="text"
            placeholder="Search by diner, code, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-obsidian/70 border border-gold/25 text-ivory p-2.5 pl-8 text-xs font-sans rounded-xs placeholder:text-ivory/40 focus:outline-none focus:border-gold"
          />
          <svg
            className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gold/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ivory/50 hover:text-ivory text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Reservation Run Sheet List */}
      <div className="pt-6">
        {isLoading ? (
          <div className="py-16 text-center text-ivory/60 text-xs font-sans space-y-3">
            <span className="w-6 h-6 mx-auto border-2 border-gold border-t-transparent rounded-full animate-spin block" />
            <p className="tracking-widest uppercase text-[10px] text-gold">Loading Maître D' Run Sheet...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-ivory/60 text-xs font-sans space-y-3">
            <p className="font-serif text-lg text-ivory">
              No {selectedStatus !== 'ALL' ? selectedStatus.toLowerCase() : ''} reservations found for {selectedDate === today ? 'Today' : selectedDate === tomorrow ? 'Tomorrow' : selectedDate === 'ALL' ? 'current filters' : selectedDate}.
            </p>
            {selectedDate !== 'ALL' && (
              <div>
                <p className="text-[11px] text-ivory/50 font-light mb-3">
                  There are bookings registered for upcoming dates in the sanctuary calendar.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedDate('ALL')}
                  className="px-4 py-2 bg-gold text-obsidian font-sans text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-ivory transition-colors shadow-sm"
                >
                  Switch to "All Dates" →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((r) => (
              <ReservationCard
                key={r.id}
                reservation={r}
                onStatusChange={onStatusChange}
                onToggleVip={onToggleVip}
                onDeleteReservation={onDeleteReservation}
                onCopy={handleCopy}
                copiedCode={copiedCode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ReservationCard({
  reservation: r,
  onStatusChange,
  onToggleVip,
  onDeleteReservation,
  onCopy,
  copiedCode,
}: {
  reservation: ReservationRow
  onStatusChange: (id: string, newStatus: ReservationRow['status']) => void
  onToggleVip: (guestId: string, currentVip: number) => void
  onDeleteReservation: (id: string) => void
  onCopy: (code: string) => void
  copiedCode: string | null
}) {
  const statusStyles: Record<
    ReservationRow['status'],
    { label: string; badge: string; border: string }
  > = {
    PENDING: {
      label: 'Pending Review',
      badge: 'bg-amber-500/15 text-amber-300 border border-amber-500/40',
      border: 'border-l-4 border-l-amber-500',
    },
    CONFIRMED: {
      label: 'Confirmed',
      badge: 'bg-gold/15 text-gold border border-gold/40',
      border: 'border-l-4 border-l-gold',
    },
    SEATED: {
      label: 'Seated',
      badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse',
      border: 'border-l-4 border-l-emerald-500',
    },
    COMPLETED: {
      label: 'Completed',
      badge: 'bg-zinc-800 text-zinc-400 border border-zinc-700',
      border: 'border-l-4 border-l-zinc-600',
    },
    CANCELLED: {
      label: 'Cancelled',
      badge: 'bg-rose-950/40 text-rose-400 border border-rose-500/30 line-through',
      border: 'border-l-4 border-l-rose-800 opacity-60',
    },
  }

  const currentStatusInfo = statusStyles[r.status] || statusStyles.PENDING
  const isVip = Boolean(r.vip_status)
  const dietaryAlerts = useMemo(() => parseDietaryAlerts(r.special_notes), [r.special_notes])

  return (
    <div
      className={`bg-obsidian/60 border border-gold/15 ${currentStatusInfo.border} rounded-xs p-5 transition-all duration-300 hover:border-gold/30 hover:bg-obsidian/85 flex flex-col lg:flex-row lg:items-center justify-between gap-4`}
    >
      {/* Left: Diner Info & Identity */}
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Reference Code Pill */}
          <button
            type="button"
            onClick={() => onCopy(r.reference_code)}
            title="Click to copy reference"
            className="font-mono text-xs text-gold/90 bg-espresso/50 border border-gold/30 px-2 py-0.5 rounded-xs hover:bg-gold hover:text-obsidian transition-colors inline-flex items-center gap-1.5"
          >
            <span>{r.reference_code}</span>
            <span className="text-[10px] opacity-70">
              {copiedCode === r.reference_code ? '✓' : '⧉'}
            </span>
          </button>

          {/* Status Badge */}
          <span className={`text-[10px] uppercase tracking-wider font-sans px-2.5 py-0.5 rounded-xs ${currentStatusInfo.badge}`}>
            {currentStatusInfo.label}
          </span>

          {/* VIP Badge / Toggle */}
          <button
            type="button"
            onClick={() => onToggleVip(r.guest_id, r.vip_status || 0)}
            title={isVip ? 'VIP guest (Click to revoke)' : 'Standard guest (Click to mark VIP)'}
            className={`text-[10px] uppercase tracking-wider font-sans px-2 py-0.5 rounded-xs transition-colors flex items-center gap-1 ${
              isVip
                ? 'bg-amber-400 text-obsidian font-bold shadow-sm'
                : 'bg-obsidian border border-gold/20 text-ivory/50 hover:text-gold'
            }`}
          >
            <span>👑</span>
            <span>{isVip ? 'VIP' : 'Mark VIP'}</span>
          </button>

          {/* Space / Room Badge */}
          <span className="text-[10px] uppercase tracking-wider text-ivory/70 bg-espresso/30 border border-gold/15 px-2 py-0.5 rounded-xs">
            {SPACE_LABELS[r.space_id] || r.space_id}
          </span>
        </div>

        {/* Diner Name & Party Size */}
        <div className="flex items-baseline gap-3">
          <h3 className="font-serif text-xl sm:text-2xl text-ivory font-light">
            {r.guest_name}
          </h3>
          <span className="font-sans text-xs text-gold font-medium">
            {r.party_size} {r.party_size === 1 ? 'Cover' : 'Covers'}
          </span>
        </div>

        {/* Dietary & Allergen Badges for Kitchen & Captain Attention */}
        {dietaryAlerts.length > 0 && (
          <div className="flex flex-wrap gap-1.5 py-0.5">
            {dietaryAlerts.map((alert, idx) => (
              <span
                key={idx}
                className={`text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-xs font-semibold ${
                  alert.severity === 'CRITICAL'
                    ? 'bg-rose-500/25 text-rose-300 border border-rose-500/50'
                    : alert.severity === 'WARNING'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                }`}
              >
                {alert.label}
              </span>
            ))}
          </div>
        )}

        {/* Contact info & timings */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-sans text-ivory/70">
          <div className="flex items-center gap-1.5 text-gold/90">
            <span>📅 {r.date}</span>
            <span>·</span>
            <span>⏰ {r.time_slot}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a href={`tel:${r.guest_phone}`} className="hover:text-gold transition-colors">
              📞 {r.guest_phone}
            </a>
            <span>·</span>
            <a href={`mailto:${r.guest_email}`} className="hover:text-gold transition-colors">
              ✉️ {r.guest_email}
            </a>
            <span>·</span>
            <a
              href={`https://wa.me/${r.guest_phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                `*MEHRAAB Fine Dining*\nHonored ${r.guest_name}, your table (${r.reference_code}) is confirmed for ${r.date} at ${r.time_slot} (${r.party_size} guests, ${SPACE_LABELS[r.space_id] || r.space_id}).\n\nComplimentary valet parking at Heritage Gate, 14 Calicut Road, Ballard Estate, Mumbai.\nDirect Concierge: +91 (022) 4920 1800`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-medium bg-emerald-950/40 px-2 py-0.5 rounded-xs border border-emerald-500/30"
              title="Open pre-composed WhatsApp concierge confirmation"
            >
              <span>💬 WhatsApp</span>
            </a>
            <span>·</span>
            <a
              href={`sms:${r.guest_phone.replace(/[^\d+]/g, '')}?body=${encodeURIComponent(
                `[MEHRAAB] Honored ${r.guest_name}, your table (${r.reference_code}) is confirmed for ${r.date} at ${r.time_slot} (${r.party_size} guests). Valet: Ballard Estate Heritage Gate. Concierge: +912249201800`
              )}`}
              className="text-gold hover:text-ivory transition-colors flex items-center gap-1 bg-espresso/40 px-2 py-0.5 rounded-xs border border-gold/30"
              title="Open pre-composed native SMS message"
            >
              <span>📲 Native SMS</span>
            </a>
          </div>
        </div>

        {/* Special Notes / Table Requests */}
        {r.special_notes && (
          <div className="pt-1 text-xs font-sans text-ivory/80 italic font-light flex items-start gap-1.5">
            <span className="text-gold not-italic">“</span>
            <span>{r.special_notes}</span>
            <span className="text-gold not-italic">”</span>
          </div>
        )}
      </div>

      {/* Right: Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 border-t lg:border-t-0 border-gold/10 pt-3 lg:pt-0">
        {r.status === 'PENDING' && (
          <button
            type="button"
            onClick={() => onStatusChange(r.id, 'CONFIRMED')}
            className="px-4 py-2 bg-gold text-obsidian font-sans text-xs uppercase tracking-wider font-semibold hover:bg-ivory transition-colors rounded-xs shadow-sm"
          >
            Confirm Table
          </button>
        )}

        {r.status === 'CONFIRMED' && (
          <button
            type="button"
            onClick={() => onStatusChange(r.id, 'SEATED')}
            className="px-4 py-2 bg-emerald-600 text-ivory font-sans text-xs uppercase tracking-wider font-semibold hover:bg-emerald-500 transition-colors rounded-xs shadow-sm flex items-center gap-1.5"
          >
            <span>🍽️</span>
            <span>Seat Diner</span>
          </button>
        )}

        {r.status === 'SEATED' && (
          <button
            type="button"
            onClick={() => onStatusChange(r.id, 'COMPLETED')}
            className="px-4 py-2 bg-zinc-700 text-ivory font-sans text-xs uppercase tracking-wider hover:bg-zinc-600 transition-colors rounded-xs"
          >
            Complete Service
          </button>
        )}

        {r.status !== 'CANCELLED' && r.status !== 'COMPLETED' && (
          <button
            type="button"
            onClick={() => onStatusChange(r.id, 'CANCELLED')}
            className="px-3 py-2 border border-rose-500/30 text-rose-300 hover:bg-rose-950/40 text-xs font-sans uppercase tracking-wider rounded-xs transition-colors"
          >
            Cancel
          </button>
        )}

        {r.status === 'CANCELLED' && (
          <button
            type="button"
            onClick={() => onStatusChange(r.id, 'PENDING')}
            className="px-3 py-2 border border-gold/30 text-gold hover:bg-gold/10 text-xs font-sans uppercase tracking-wider rounded-xs transition-colors"
          >
            Reopen
          </button>
        )}

        {/* Delete Booking Option */}
        <button
          type="button"
          onClick={() => {
            if (confirm(`Remove reservation for ${r.guest_name}?`)) {
              onDeleteReservation(r.id)
            }
          }}
          title="Delete booking record"
          className="p-2 text-ivory/40 hover:text-rose-400 transition-colors rounded-xs"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

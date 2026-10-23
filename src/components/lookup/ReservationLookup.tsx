import { useState, useEffect, useCallback, type FormEvent } from 'react'
import { BrandLogo } from '../BrandLogo'
import { useNavigation } from '../../hooks/useNavigation'
import { DigitalDiningPass } from '../common/DigitalDiningPass'

interface ReservationDetails {
  id: string
  reference_code: string
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
}

const SPACE_DETAILS: Record<string, { title: string; subtitle: string }> = {
  'grand-hall': {
    title: 'The Grand Mehraab Hall',
    subtitle: 'Cathedral Basalt Arches & Candlelit Banquette',
  },
  courtyard: {
    title: 'The Courtyard of Embers',
    subtitle: 'Twilight Garden, Live Sigri Hearth & Reflecting Pools',
  },
  cafe: {
    title: 'The Roastery & Café Verandah',
    subtitle: 'Sun-Dappled Lattice Screens & Single-Origin Roast',
  },
  parda: {
    title: 'The Parda Salon',
    subtitle: 'Exclusive Private Dining Salon & Dedicated Sommelier',
  },
}

export function ReservationLookup() {
  const { navigateTo, lookupReference, setLookupReference } = useNavigation()

  const [inputCode, setInputCode] = useState(() => lookupReference || '')
  const [reservation, setReservation] = useState<ReservationDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const performLookup = useCallback(async (code: string) => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/reservations/lookup/${encodeURIComponent(trimmed)}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'No reservation found matching this reference code.')
      }

      setReservation(data.reservation)
      setLookupReference(trimmed)
    } catch (err: unknown) {
      setReservation(null)
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to locate reference. Please check your reference code or contact our concierge.'
      )
    } finally {
      setIsLoading(false)
    }
  }, [setLookupReference])

  // Auto-search if reference passed in context
  useEffect(() => {
    if (lookupReference) {
      performLookup(lookupReference)
    }
  }, [lookupReference, performLookup])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    performLookup(inputCode)
  }

  const spaceInfo = reservation
    ? SPACE_DETAILS[reservation.space_id] || {
        title: reservation.space_id,
        subtitle: 'Bespoke Pavilion',
      }
    : null

  // Timeline Progress Steps
  const getStepProgress = (status: ReservationDetails['status']) => {
    switch (status) {
      case 'PENDING':
        return 1
      case 'CONFIRMED':
        return 2
      case 'SEATED':
        return 3
      case 'COMPLETED':
        return 4
      case 'CANCELLED':
        return -1
      default:
        return 1
    }
  }

  const stepNumber = reservation ? getStepProgress(reservation.status) : 0

  return (
    <div className="min-h-screen bg-obsidian text-ivory font-sans selection:bg-gold selection:text-obsidian flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-obsidian/95 backdrop-blur-md border-b border-gold/20 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
          <BrandLogo size="sm" />
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="px-4 py-2 border border-gold/40 text-gold hover:bg-gold/10 text-xs uppercase tracking-[0.2em] font-sans rounded-xs transition-colors"
          >
            ← Return to Sanctuary
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 sm:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-gold/50" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold font-sans font-light">
              Guest Concierge Portal
            </span>
            <span className="w-8 h-[1px] bg-gold/50" />
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-light text-ivory tracking-tight mb-4">
            Reservation Verification
          </h1>
          <p className="font-sans font-light text-xs sm:text-sm text-ivory/70 leading-relaxed">
            Enter your unique luxury booking reference (e.g.{' '}
            <span className="font-mono text-gold">MHR-2026-8821</span>) to view real-time table
            allocation, timing, and preparation protocols.
          </p>
        </div>

        {/* Search Bar Form */}
        <div className="bg-espresso/30 border border-gold/25 rounded-xs p-6 sm:p-8 backdrop-blur-md shadow-2xl mb-10">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter Reference (e.g. MHR-2026-8821)"
                className="w-full bg-obsidian/80 border border-gold/30 text-ivory p-4 text-sm font-mono tracking-widest uppercase rounded-xs placeholder:normal-case placeholder:font-sans placeholder:tracking-normal placeholder:text-ivory/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-4 bg-gold text-obsidian font-sans text-xs uppercase tracking-[0.25em] font-semibold hover:bg-ivory transition-colors disabled:opacity-50 shrink-0"
            >
              {isLoading ? 'Verifying...' : 'Track Booking'}
            </button>
          </form>

          {/* Quick Demo Reference Buttons */}
          <div className="mt-4 pt-3 border-t border-gold/10 flex flex-wrap items-center gap-2 text-xs font-sans text-ivory/60">
            <span className="text-[10px] text-gold/80 uppercase tracking-wider">Recent Codes:</span>
            {['MHR-2026-8821', 'MHR-2026-4519', 'MHR-2026-6102'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setInputCode(sample)
                  performLookup(sample)
                }}
                className="font-mono text-[10px] text-gold bg-obsidian/60 border border-gold/25 px-2 py-0.5 rounded-xs hover:border-gold hover:bg-gold/10 transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-5 bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs font-sans rounded-xs mb-8 flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-rose-400 mt-1 shrink-0" />
            <div>
              <strong className="block text-sm font-medium mb-1">Reservation Not Found</strong>
              <p className="text-rose-200/80 font-light">{error}</p>
              <p className="mt-2 text-[11px] text-ivory/60">
                Need immediate assistance? Contact our Concierge Desk at{' '}
                <a href="tel:+912249201800" className="text-gold underline">
                  +91 (022) 4920 1800
                </a>
                .
              </p>
            </div>
          </div>
        )}

        {/* Active Reservation Details Card */}
        {reservation && (
          <div className="bg-espresso/25 border border-gold/30 rounded-xs overflow-hidden shadow-2xl backdrop-blur-md animate-fade-in">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-espresso/80 via-obsidian/90 to-espresso/80 border-b border-gold/20 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-gold block mb-1">
                  REFERENCE · {reservation.reference_code}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ivory">
                  Welcoming {reservation.guest_name}
                </h2>
              </div>

              {/* Status Badge */}
              <div>
                <span
                  className={`inline-block text-xs uppercase tracking-[0.2em] font-sans px-4 py-1.5 rounded-xs font-medium ${
                    reservation.status === 'CONFIRMED'
                      ? 'bg-gold text-obsidian'
                      : reservation.status === 'SEATED'
                      ? 'bg-emerald-500 text-obsidian'
                      : reservation.status === 'CANCELLED'
                      ? 'bg-rose-900 text-rose-200'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {reservation.status === 'CONFIRMED'
                    ? 'Table Confirmed'
                    : reservation.status === 'SEATED'
                    ? 'Currently Seated'
                    : reservation.status === 'CANCELLED'
                    ? 'Reservation Cancelled'
                    : 'Pending Maître D’ Confirmation'}
                </span>
              </div>
            </div>

            {/* Stepper / Timeline */}
            <div className="p-6 sm:p-8 border-b border-gold/15 bg-obsidian/40">
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold/80 font-sans block mb-6">
                Hospitality Journey Status
              </span>

              {reservation.status === 'CANCELLED' ? (
                <div className="p-4 bg-rose-950/30 border border-rose-500/30 text-rose-200 text-xs font-sans rounded-xs">
                  This reservation has been cancelled. If you believe this is in error, please phone our head of hospitality.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
                  {[
                    { step: 1, title: 'Request Received', desc: 'Logged with Concierge' },
                    { step: 2, title: 'Table Assigned', desc: 'Maître D’ Confirmed' },
                    { step: 3, title: 'Guest Seated', desc: 'Dining in Progress' },
                    { step: 4, title: 'Service Complete', desc: 'Culinary Odyssey Concluded' },
                  ].map((s) => {
                    const isDone = stepNumber >= s.step
                    const isCurrent = stepNumber === s.step
                    return (
                      <div
                        key={s.step}
                        className={`p-3.5 border rounded-xs transition-colors ${
                          isCurrent
                            ? 'border-gold bg-gold/10'
                            : isDone
                            ? 'border-gold/40 bg-espresso/30'
                            : 'border-gold/10 opacity-40'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                              isDone ? 'bg-gold text-obsidian font-bold' : 'border border-gold/40 text-gold'
                            }`}
                          >
                            {isDone ? '✓' : s.step}
                          </span>
                          <span className="font-medium text-ivory">{s.title}</span>
                        </div>
                        <p className="text-[11px] text-ivory/60 font-light">{s.desc}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Digital Dining Pass with 1-Click Calendar Sync */}
            {reservation.status !== 'CANCELLED' && (
              <div className="p-6 sm:p-8 border-b border-gold/15 bg-espresso/15">
                <DigitalDiningPass
                  details={{
                    referenceCode: reservation.reference_code,
                    guestName: reservation.guest_name,
                    partySize: reservation.party_size,
                    date: reservation.date,
                    timeSlot: reservation.time_slot,
                    spaceName: spaceInfo?.title || reservation.space_id,
                    specialNotes: reservation.special_notes,
                  }}
                />
              </div>
            )}

            {/* Booking Specifications Grid */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Spatial & Timing */}
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-sans block mb-1">
                    Allocated Space & Atmosphere
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-ivory">{spaceInfo?.title}</h3>
                  <p className="font-sans text-xs text-ivory/70 mt-1 font-light">
                    {spaceInfo?.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 p-4 bg-obsidian/70 border border-gold/15 rounded-xs text-xs font-sans">
                  <div>
                    <span className="text-gold/70 uppercase text-[10px] block">Date</span>
                    <span className="font-medium text-ivory mt-0.5 block">{reservation.date}</span>
                  </div>
                  <div>
                    <span className="text-gold/70 uppercase text-[10px] block">Seating</span>
                    <span className="font-medium text-ivory mt-0.5 block">{reservation.time_slot}</span>
                  </div>
                  <div>
                    <span className="text-gold/70 uppercase text-[10px] block">Party Size</span>
                    <span className="font-medium text-gold mt-0.5 block">
                      {reservation.party_size} Guest{reservation.party_size > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {reservation.special_notes && (
                  <div className="p-4 bg-espresso/35 border border-gold/20 rounded-xs">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-sans block mb-1">
                      Guest Notes & Requests
                    </span>
                    <p className="font-sans text-xs text-ivory/80 italic font-light">
                      “{reservation.special_notes}”
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Protocols & Directions */}
              <div className="space-y-5">
                <div className="border border-gold/20 p-5 rounded-xs space-y-3 bg-obsidian/60 text-xs font-sans">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-sans block">
                    Sanctuary Arrival Protocol
                  </span>

                  <div className="space-y-2 text-ivory/80 font-light text-[11px] leading-relaxed">
                    <p>
                      <strong className="text-ivory font-medium">Valet Attendant:</strong> Private valet
                      attendants await at the Heritage Gate, Ballard Estate.
                    </p>
                    <p>
                      <strong className="text-ivory font-medium">Attire:</strong> Contemporary elegant or
                      festive Indian wear. Athletic attire is courteously restricted.
                    </p>
                    <p>
                      <strong className="text-ivory font-medium">Table Hold:</strong> Tables are held for 20
                      minutes past reserved time slot before release.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-espresso/40 border border-gold/20 rounded-xs flex items-center justify-between text-xs font-sans">
                  <div>
                    <span className="text-ivory/60 block text-[11px]">Need to amend party size?</span>
                    <span className="text-gold font-medium">Concierge Direct Helpline</span>
                  </div>
                  <a
                    href="tel:+912249201800"
                    className="px-3.5 py-2 bg-gold text-obsidian text-[11px] uppercase tracking-wider font-semibold rounded-xs hover:bg-ivory transition-colors"
                  >
                    Call Desk
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

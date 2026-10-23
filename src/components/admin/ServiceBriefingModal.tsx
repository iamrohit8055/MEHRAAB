import { useState, useMemo, useEffect } from 'react'
import type { ReservationRow } from './AdminRunSheet'
import type { AdminUser } from './AdminLogin'
import {
  parseDietaryAlerts,
  extractTableAssignment,
  generatePlaintextBriefing,
} from '../../utils/briefing'

interface ServiceBriefingModalProps {
  isOpen: boolean
  onClose: () => void
  reservations: ReservationRow[]
  initialDate?: string
  token: string
  currentUser?: AdminUser | null
}

const SPACE_NAMES: Record<string, string> = {
  'grand-hall': 'Grand Mehraab Hall',
  courtyard: 'Courtyard of Embers',
  cafe: 'The Roastery Verandah',
  parda: 'The Parda Salon (VIP)',
}

export function ServiceBriefingModal({
  isOpen,
  onClose,
  reservations,
  initialDate = 'ALL',
  token,
  currentUser,
}: ServiceBriefingModalProps) {
  // Available dates dynamically extracted from reservations
  const availableDates = useMemo(() => {
    const dates = Array.from(new Set(reservations.map((r) => r.date))).sort()
    return dates
  }, [reservations])

  const [filterDate, setFilterDate] = useState<string>(() => {
    return initialDate || 'ALL'
  })

  // Mode: 'summary' or 'pdf'
  const [viewMode, setViewMode] = useState<'summary' | 'pdf'>('pdf')
  const [copied, setCopied] = useState(false)

  // Construct PDF URL pointing to our dynamic endpoint (with static fallback)
  const pdfUrl = useMemo(() => {
    if (token) {
      return `/api/admin/briefing/pdf?date=${encodeURIComponent(filterDate)}&token=${encodeURIComponent(token)}`
    }
    return '/mehraab-daily-service-briefing.pdf'
  }, [filterDate, token])

  // Sync initial date if it changes
  useEffect(() => {
    if (initialDate) {
      setFilterDate(initialDate)
    }
  }, [initialDate])

  // Handle escape key
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

  // Filter reservations by selected date
  const briefingItems = useMemo(() => {
    let list = reservations

    if (filterDate !== 'ALL') {
      list = list.filter((r) => r.date === filterDate)
    }

    // Sort chronologically by date and time
    list = [...list].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return a.time_slot.localeCompare(b.time_slot)
    })

    return list.map((r) => {
      const { table, cleanNotes } = extractTableAssignment(r.space_id, r.special_notes)
      const alerts = parseDietaryAlerts(r.special_notes)
      return {
        reservation: r,
        table,
        cleanNotes,
        alerts,
        shift: 'TWILIGHT' as const,
      }
    })
  }, [reservations, filterDate])

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalCovers = briefingItems.reduce((acc, curr) => acc + curr.reservation.party_size, 0)
    const totalTables = briefingItems.length
    const vipCount = briefingItems.filter((i) => Boolean(i.reservation.vip_status)).length
    const allergyItems = briefingItems.filter((i) => i.alerts.length > 0)
    const allergyCount = allergyItems.reduce((acc, curr) => acc + curr.alerts.length, 0)

    const spaceCounts: Record<string, number> = {}
    for (const item of briefingItems) {
      const sp = item.reservation.space_id
      spaceCounts[sp] = (spaceCounts[sp] || 0) + item.reservation.party_size
    }

    return {
      totalCovers,
      totalTables,
      vipCount,
      allergyCount,
      allergyItems,
      spaceCounts,
    }
  }, [briefingItems])

  const handleCopyText = () => {
    const text = generatePlaintextBriefing(
      filterDate === 'ALL' ? 'ALL UPCOMING SERVICES' : filterDate,
      briefingItems,
      {
        totalCovers: metrics.totalCovers,
        totalTables: metrics.totalTables,
        vipCount: metrics.vipCount,
        allergyCount: metrics.allergyCount,
      }
    )
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const handleOpenPdf = () => {
    window.open(pdfUrl, '_blank')
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Kitchen & Captains Daily Service Run Sheet"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-obsidian/95 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl rounded-xs shadow-2xl p-4 sm:p-8 my-6 max-h-[94vh] overflow-y-auto flex flex-col justify-between bg-[#171614] text-ivory border border-gold/40 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="pb-6 mb-6 border-b border-gold/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Document Title Badge */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gold" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-sans font-semibold">
                Daily Service Briefing
              </span>
            </div>

            {/* Quick Date Switcher Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-obsidian/80 border border-gold/20 rounded-xs p-1 text-xs font-sans">
              <button
                type="button"
                onClick={() => setFilterDate('ALL')}
                className={`px-3 py-1 rounded-xs transition-colors text-xs ${
                  filterDate === 'ALL'
                    ? 'bg-gold text-obsidian font-semibold'
                    : 'text-ivory/70 hover:text-gold'
                }`}
              >
                All Dates ({reservations.length})
              </button>
              {availableDates.map((d) => {
                const count = reservations.filter((r) => r.date === d).length
                const isSelected = filterDate === d
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setFilterDate(d)}
                    className={`px-2.5 py-1 rounded-xs transition-colors font-mono text-[11px] ${
                      isSelected
                        ? 'bg-gold text-obsidian font-semibold'
                        : 'text-ivory/70 hover:text-gold'
                    }`}
                  >
                    {d} ({count})
                  </button>
                )
              })}
            </div>

            {/* View Mode Switcher */}
            <div className="inline-flex bg-obsidian/80 border border-gold/20 rounded-xs p-1 text-xs font-sans">
              <button
                type="button"
                onClick={() => setViewMode('pdf')}
                className={`px-3 py-1 rounded-xs transition-colors flex items-center gap-1.5 ${
                  viewMode === 'pdf'
                    ? 'bg-gold text-obsidian font-semibold'
                    : 'text-ivory/70 hover:text-gold'
                }`}
              >
                <span>📄 Standalone Vector PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('summary')}
                className={`px-3 py-1 rounded-xs transition-colors flex items-center gap-1.5 ${
                  viewMode === 'summary'
                    ? 'bg-gold text-obsidian font-semibold'
                    : 'text-ivory/70 hover:text-gold'
                }`}
              >
                <span>📊 Interactive Dossier</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={pdfUrl}
              download={`MEHRAAB-Service-Briefing-${filterDate}.pdf`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-obsidian text-xs font-sans uppercase tracking-[0.18em] font-semibold rounded-xs hover:bg-ivory transition-colors shadow-sm"
            >
              <span>📥 Download Official PDF</span>
            </a>

            <button
              type="button"
              onClick={handleOpenPdf}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-gold/15 hover:bg-gold hover:text-obsidian border border-gold/40 text-gold text-xs font-sans uppercase tracking-wider rounded-xs transition-colors"
            >
              <span>↗ Open Fullscreen PDF</span>
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-gold/30 bg-espresso/40 text-ivory/80 hover:text-gold text-xs font-sans uppercase tracking-wider rounded-xs transition-colors"
            >
              <span>{copied ? '✓ Copied' : '📋 Copy Text'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close run sheet"
              className="w-8 h-8 rounded-full border border-gold/30 text-ivory hover:text-gold flex items-center justify-center transition-colors text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* VIEW 1: Embedded Standalone Vector PDF Reader */}
        {viewMode === 'pdf' && (
          <div className="space-y-4">
            <div className="p-3 bg-gold/10 border border-gold/30 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
              <div>
                <span className="font-semibold text-gold block tracking-wide">
                  ✨ Official Vector Briefing Document (A4 Print Edition)
                </span>
                <span className="text-ivory/70 text-[11px]">
                  Real standalone high-resolution PDF with sharp vector typography, red allergen matrix, and captain checkboxes.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={pdfUrl}
                  download={`MEHRAAB-Service-Briefing-${filterDate}.pdf`}
                  className="px-3 py-1.5 bg-gold text-obsidian text-[11px] font-semibold uppercase tracking-wider rounded-xs hover:bg-ivory transition-colors"
                >
                  Download .PDF ↓
                </a>
                <button
                  type="button"
                  onClick={handleOpenPdf}
                  className="px-3 py-1.5 border border-gold/50 text-gold text-[11px] font-semibold uppercase tracking-wider rounded-xs hover:bg-gold hover:text-obsidian transition-colors"
                >
                  Open in New Tab ↗
                </button>
              </div>
            </div>

            <div className="relative w-full h-[68vh] rounded-xs overflow-hidden border border-gold/30 bg-white shadow-2xl">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                title="Service Briefing Standalone PDF"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}

        {/* VIEW 2: Interactive Sanctuary Screen Dossier */}
        {viewMode === 'summary' && (
          <div className="space-y-6">
            {/* Header Block */}
            <div className="border-b border-gold/25 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-2xl sm:text-3xl tracking-[0.2em] font-light uppercase text-ivory">
                    MEHRAAB
                  </span>
                  <span className="text-[11px] uppercase tracking-widest text-gold/80 font-mono">
                    · BALLARD ESTATE · MUMBAI
                  </span>
                </div>
                <h1 className="font-serif text-xl sm:text-2xl font-normal text-ivory mt-1">
                  KITCHEN EXPEDITION & CAPTAINS SERVICE BRIEFING
                </h1>
                <p className="text-xs uppercase tracking-widest text-ivory/60 font-sans mt-0.5">
                  Service Run Sheet & Guest Care Dossier · Shift Allocation
                </p>
              </div>

              <div className="text-left sm:text-right text-xs font-mono space-y-1 text-ivory/80">
                <div className="font-bold text-sm text-gold uppercase">
                  {filterDate === 'ALL' ? 'ALL DATES REGISTERED' : `SERVICE: ${filterDate}`}
                </div>
                <div>Maître D' on Duty: {currentUser?.name || 'Staff Maître D’'}</div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 border border-gold/25 bg-espresso/30 rounded-xs">
                <span className="text-[10px] uppercase tracking-wider text-gold font-sans block">
                  Total Covers
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-ivory">
                  {metrics.totalCovers}
                </span>
                <span className="text-[10px] text-ivory/50 block">across {metrics.totalTables} parties</span>
              </div>

              <div className="p-3 border border-gold/25 bg-espresso/30 rounded-xs">
                <span className="text-[10px] uppercase tracking-wider text-gold font-sans block">
                  VIP Dignitaries
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">
                  👑 {metrics.vipCount}
                </span>
                <span className="text-[10px] text-ivory/50 block">priority protocol</span>
              </div>

              <div className="p-3 border border-rose-500/40 bg-rose-950/20 rounded-xs">
                <span className="text-[10px] uppercase tracking-wider text-rose-400 font-sans block font-semibold">
                  ⚠️ Dietary Alerts
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-rose-400">
                  {metrics.allergyCount}
                </span>
                <span className="text-[10px] text-rose-300/70 block">strict kitchen notices</span>
              </div>

              <div className="p-3 border border-gold/25 bg-espresso/30 rounded-xs">
                <span className="text-[10px] uppercase tracking-wider text-gold font-sans block">
                  Pavilions Active
                </span>
                <div className="text-[11px] text-ivory/80 space-y-0.5 mt-1 font-mono">
                  {Object.entries(metrics.spaceCounts).map(([space, count]) => (
                    <div key={space} className="flex justify-between">
                      <span className="truncate max-w-[100px]">{SPACE_NAMES[space] || space}:</span>
                      <span className="font-bold text-gold">{count}p</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Kitchen Dietary & Allergen Matrix */}
            <div className="border border-rose-500/50 rounded-xs p-4 bg-rose-950/20">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-rose-500/30">
                <div className="flex items-center gap-2">
                  <span className="text-base">⚠️</span>
                  <h3 className="font-serif text-lg font-bold text-rose-300 uppercase tracking-wide">
                    Executive Kitchen Dietary & Severe Allergen Matrix
                  </h3>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-rose-400 font-mono font-semibold">
                  Expeditor Station Notice
                </span>
              </div>

              {metrics.allergyItems.length === 0 ? (
                <p className="text-xs text-ivory/70 italic py-1">
                  ✓ No critical allergy or severe dietary restrictions flagged for this selection. Standard
                  cross-contamination protocols remain active.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {metrics.allergyItems.map((item) => (
                    <div
                      key={item.reservation.id}
                      className="p-3 bg-obsidian/90 border border-rose-800/60 rounded-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-ivory">
                          {item.table} · {item.reservation.guest_name}
                        </span>
                        <span className="font-mono text-[10px] text-gold">
                          ⏰ {item.reservation.time_slot} ({item.reservation.party_size} Covers)
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {item.alerts.map((alert, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] px-2 py-0.5 rounded-xs font-semibold uppercase tracking-wider ${
                              alert.severity === 'CRITICAL'
                                ? 'bg-rose-600 text-white'
                                : alert.severity === 'WARNING'
                                  ? 'bg-amber-950 text-amber-200 border border-amber-700/60'
                                  : 'bg-blue-950 text-blue-200 border border-blue-700/60'
                            }`}
                          >
                            {alert.label}
                          </span>
                        ))}
                      </div>

                      {item.cleanNotes && (
                        <p className="text-[11px] text-ivory/70 italic pt-0.5">
                          “{item.cleanNotes}”
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chronological Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-ivory uppercase tracking-wide">
                  Chronological Seating Schedule & Captains Roster
                </h3>
                <span className="text-[10px] text-ivory/60 font-mono">
                  {briefingItems.length} Allocations
                </span>
              </div>

              <div className="overflow-x-auto border border-gold/25 rounded-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-espresso/50 text-gold font-mono uppercase text-[10px] tracking-wider border-b border-gold/25">
                      <th className="p-2.5 w-24">{filterDate === 'ALL' ? 'Date & Time' : 'Time'}</th>
                      <th className="p-2.5 w-44">Table / Space</th>
                      <th className="p-2.5">Guest Identity</th>
                      <th className="p-2.5 text-center w-16">Covers</th>
                      <th className="p-2.5 text-center w-24">Status</th>
                      <th className="p-2.5">Directives & Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/15 font-sans">
                    {briefingItems.map((item) => {
                      const isVip = Boolean(item.reservation.vip_status)
                      return (
                        <tr
                          key={item.reservation.id}
                          className="hover:bg-espresso/20 transition-colors"
                        >
                          <td className="p-2.5 font-mono font-bold text-gold whitespace-nowrap">
                            {filterDate === 'ALL' && (
                              <div className="text-[10px] text-ivory/70 font-sans font-normal mb-0.5">
                                📅 {item.reservation.date}
                              </div>
                            )}
                            <div>⏰ {item.reservation.time_slot}</div>
                          </td>

                          <td className="p-2.5">
                            <div className="font-semibold text-ivory">{item.table}</div>
                            <div className="text-[10px] text-ivory/50">
                              {SPACE_NAMES[item.reservation.space_id] || item.reservation.space_id}
                            </div>
                          </td>

                          <td className="p-2.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-serif font-semibold text-sm text-ivory">
                                {item.reservation.guest_name}
                              </span>
                              {isVip && (
                                <span className="text-[9px] font-mono uppercase tracking-wider bg-amber-400 text-obsidian px-1.5 py-0.2 rounded-xs font-bold">
                                  👑 VIP
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-ivory/50">
                              {item.reservation.reference_code} · {item.reservation.guest_phone}
                            </div>
                          </td>

                          <td className="p-2.5 text-center font-mono font-bold text-ivory">
                            {item.reservation.party_size}p
                          </td>

                          <td className="p-2.5 text-center">
                            <span
                              className={`text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-xs ${
                                item.reservation.status === 'CONFIRMED'
                                  ? 'bg-gold/20 text-gold border border-gold/40'
                                  : item.reservation.status === 'SEATED'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                                    : item.reservation.status === 'PENDING'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                      : 'bg-zinc-800 text-zinc-400'
                              }`}
                            >
                              {item.reservation.status}
                            </span>
                          </td>

                          <td className="p-2.5 text-ivory/80">
                            {item.alerts.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-1">
                                {item.alerts.map((alert, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[9px] px-1.5 py-0.2 rounded-xs font-bold uppercase bg-rose-950 text-rose-300 border border-rose-800"
                                  >
                                    {alert.label}
                                  </span>
                                ))}
                              </div>
                            )}
                            {item.cleanNotes ? (
                              <span className="italic text-[11px] leading-relaxed">
                                {item.cleanNotes}
                              </span>
                            ) : (
                              <span className="text-ivory/30 text-[10px]">Standard Carte</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sommelier Box */}
            <div className="p-4 border border-gold/25 bg-espresso/30 rounded-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🍷</span>
                <h3 className="font-serif text-base font-bold text-gold uppercase tracking-wide">
                  Sommelier & Cellar Protocols for this Shift
                </h3>
              </div>
              <ul className="text-xs text-ivory/80 space-y-1 list-disc list-inside">
                <li>
                  <strong>Corner Alcove Banquette:</strong> Ensure <em>2019 Domaine de Chevalier</em> is cellared at 16°C and decanted 30 minutes before arrival.
                </li>
                <li>
                  <strong>Parda Salon VIP Banquets:</strong> Pre-infuse royal saffron kahwa and chilled botanical elixirs for non-alcoholic diners.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Modal Bottom Actions */}
        <div className="mt-8 pt-4 border-t border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-ivory/60 font-mono text-[11px]">
              Ready for service expedition · Standalone Vector PDF engine active
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 border border-gold/30 text-ivory/80 hover:text-ivory font-sans uppercase tracking-wider rounded-xs transition-colors"
            >
              Close Dossier
            </button>
            <a
              href={pdfUrl}
              download={`MEHRAAB-Service-Briefing-${filterDate}.pdf`}
              className="w-full sm:w-auto px-5 py-2.5 bg-gold text-obsidian font-sans font-semibold uppercase tracking-wider rounded-xs hover:bg-ivory transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>📥 Download Standalone Vector PDF</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

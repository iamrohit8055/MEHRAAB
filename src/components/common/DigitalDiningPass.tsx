import { useState } from 'react'
import {
  type CalendarEventDetails,
  generateGoogleCalendarUrl,
  downloadIcsFile,
} from '../../utils/calendar'

interface DigitalDiningPassProps {
  details: CalendarEventDetails
  compact?: boolean
  className?: string
}

export function DigitalDiningPass({ details, compact = false, className = '' }: DigitalDiningPassProps) {
  const [downloaded, setDownloaded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleDownload = () => {
    downloadIcsFile(details)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 3000)
  }

  const handleCopyRef = () => {
    navigator.clipboard.writeText(details.referenceCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const googleUrl = generateGoogleCalendarUrl(details)

  return (
    <div
      className={`relative bg-[#1a1816] border border-gold/40 rounded-xs overflow-hidden shadow-2xl backdrop-blur-md ${className}`}
    >
      {/* Top Metallic Gold Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-gold/40 via-gold to-gold/40" />

      {/* Decorative Subtle Arch Watermark */}
      <div
        className="absolute -right-6 -bottom-6 w-48 h-48 opacity-5 pointer-events-none"
        aria-hidden="true"
      >
        <svg viewBox="0 0 48 56" fill="none" className="w-full h-full stroke-gold">
          <path d="M 6 54 V 28 C 6 15 16 7 24 2 C 32 7 42 15 42 28 V 54" strokeWidth="1" />
          <path d="M 12 54 V 30 C 12 20 18 13 24 9 C 30 13 36 20 36 30 V 54" strokeWidth="0.8" />
        </svg>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Pass Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gold/20">
          <div>
            <span className="text-[9px] uppercase tracking-[0.35em] text-gold font-sans block mb-1">
              Sanctuary Digital Invitation Pass
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-ivory tracking-wide">
              {details.guestName}
            </h3>
          </div>

          {/* Reference Badge with Copy Action */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleCopyRef}
              title="Click to copy reference"
              className="bg-obsidian border border-gold/40 px-3 py-1.5 rounded-xs font-mono text-xs text-gold tracking-widest hover:bg-gold hover:text-obsidian transition-colors flex items-center gap-2"
            >
              <span>{details.referenceCode}</span>
              <span className="text-[10px] opacity-70">{copied ? '✓ Copied' : '⧉'}</span>
            </button>
          </div>
        </div>

        {/* Pass Key Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
          <div className="p-3 bg-obsidian/60 border border-gold/15 rounded-xs">
            <span className="text-gold/70 uppercase text-[10px] block mb-1">Service Date</span>
            <span className="font-medium text-ivory text-sm block">{details.date}</span>
          </div>

          <div className="p-3 bg-obsidian/60 border border-gold/15 rounded-xs">
            <span className="text-gold/70 uppercase text-[10px] block mb-1">Seating Time</span>
            <span className="font-medium text-ivory text-sm block">{details.timeSlot}</span>
          </div>

          <div className="p-3 bg-obsidian/60 border border-gold/15 rounded-xs">
            <span className="text-gold/70 uppercase text-[10px] block mb-1">Party Size</span>
            <span className="font-medium text-gold text-sm block">
              {details.partySize} {details.partySize === 1 ? 'Guest' : 'Guests'}
            </span>
          </div>

          <div className="p-3 bg-obsidian/60 border border-gold/15 rounded-xs">
            <span className="text-gold/70 uppercase text-[10px] block mb-1">Pavilion</span>
            <span className="font-medium text-ivory text-sm block truncate">{details.spaceName}</span>
          </div>
        </div>

        {/* Arrival Protocol Ribbon */}
        {!compact && (
          <div className="p-3.5 bg-espresso/35 border border-gold/20 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans text-ivory/80">
            <div className="flex items-center gap-2">
              <span className="text-gold">📍</span>
              <span className="font-light text-[11px] leading-relaxed">
                Heritage Gate Valet · 14 Calicut Road, Ballard Estate, Fort, Mumbai
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-gold/80 font-mono shrink-0">
              20-Min Table Grace Period
            </span>
          </div>
        )}

        {/* 1-Click Calendar Add Actions */}
        <div className="pt-2 border-t border-gold/15">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold/80 font-sans block">
              Sync Reservation with Your Calendar
            </span>
            <span className="text-[9px] uppercase tracking-wider text-emerald-300 font-mono bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-xs">
              Includes 2-Hour Departure Alarm
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Google Calendar Link */}
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 bg-obsidian/80 hover:bg-gold hover:text-obsidian border border-gold/40 text-ivory font-sans text-xs uppercase tracking-[0.18em] font-medium rounded-xs transition-all duration-300 flex items-center justify-center gap-2.5 group"
            >
              <svg className="w-4 h-4 shrink-0 text-gold group-hover:text-obsidian" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
              </svg>
              <span>Add to Google Calendar</span>
            </a>

            {/* Apple / Outlook .ics Download */}
            <button
              type="button"
              onClick={handleDownload}
              className="py-3 px-4 bg-gold text-obsidian hover:bg-ivory border border-gold font-sans text-xs uppercase tracking-[0.18em] font-semibold rounded-xs transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{downloaded ? '✓ .ICS Saved' : 'Download Apple (.ics)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

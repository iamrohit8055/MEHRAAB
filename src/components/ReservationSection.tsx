import { useState, type FormEvent } from 'react'
import { InteractiveFloorplan } from './floorplan/InteractiveFloorplan'
import { DigitalDiningPass } from './common/DigitalDiningPass'
import type { TableSpot, PavilionFloorplan } from '../data/floorplanData'

interface BookingData {
  guests: number
  date: string
  time: string
  space: string
  name: string
  email: string
  phone: string
  notes: string
}

const TIME_SLOTS = [
  { label: 'Morning Roast · 09:30', value: '09:30' },
  { label: 'Verandah Lunch · 12:30', value: '12:30' },
  { label: 'Afternoon Tea · 15:30', value: '15:30' },
  { label: 'Twilight Seating · 18:30', value: '18:30' },
  { label: 'Prime Dinner · 20:00', value: '20:00' },
  { label: 'Late Ember Digestif · 21:45', value: '21:45' },
]

const SPACES = [
  { id: 'grand-hall', label: 'The Grand Mehraab Hall', desc: 'Main Dining & 24ft Arches' },
  { id: 'courtyard', label: 'Courtyard of Embers', desc: 'Alfresco Reflecting Pools' },
  { id: 'cafe', label: 'The Roastery Verandah', desc: 'Sun-Dappled Lattice Seating' },
  { id: 'parda', label: 'The Parda Salon', desc: 'Private Dining (Up to 16)' },
]

function getTomorrowDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

export function ReservationSection() {
  const [formData, setFormData] = useState<BookingData>(() => ({
    guests: 2,
    date: getTomorrowDate(),
    time: '20:00',
    space: 'grand-hall',
    name: '',
    email: '',
    phone: '',
    notes: '',
  }))

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [confirmedReference, setConfirmedReference] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isFloorplanOpen, setIsFloorplanOpen] = useState(false)
  const [selectedTableInfo, setSelectedTableInfo] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit reservation request.')
      }

      setConfirmedReference(result.referenceCode)
      setIsSubmitted(true)
    } catch (err: unknown) {
      console.error('Reservation booking error:', err)
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to reach the concierge desk. Please try again or contact us directly.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setConfirmedReference('')
    setErrorMessage(null)
    setSelectedTableInfo(null)
    setFormData({
      guests: 2,
      date: getTomorrowDate(),
      time: '20:00',
      space: 'grand-hall',
      name: '',
      email: '',
      phone: '',
      notes: '',
    })
  }

  const handleFloorplanSelect = (table: TableSpot, pavilion: PavilionFloorplan) => {
    setFormData((prev) => ({
      ...prev,
      space: pavilion.id,
      notes: prev.notes
        ? `${prev.notes} [Table: ${table.number} (${table.name})]`
        : `[Table: ${table.number} (${table.name})]`,
    }))
    setSelectedTableInfo(`${pavilion.name} · ${table.number} (${table.name})`)
    setIsFloorplanOpen(false)
  }

  return (
    <section
      id="reservations"
      className="relative py-24 sm:py-32 bg-obsidian text-ivory border-t border-gold/15 overflow-hidden scroll-mt-20"
    >
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-espresso/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-gold/50" />
            <span className="text-[11px] uppercase tracking-[0.35em] text-gold font-sans font-light">
              Table & Salon Reservations
            </span>
            <span className="w-8 h-[1px] bg-gold/50" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-ivory mb-6 leading-tight">
            An Evening at the <br />
            <span className="italic text-gold">Sacred Arch.</span>
          </h2>

          <p className="font-sans font-light text-sm sm:text-base text-ivory/75 leading-relaxed">
            Reservations are released 30 days in advance. For parties exceeding eight guests or bespoke
            private dining in the Parda Salon, our sommelier and concierge team await your inquiry.
          </p>
        </div>

        {/* Main Grid: Form on Left, Concierge Information on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Reservation Card / Form Container */}
          <div className="lg:col-span-8 bg-espresso/25 border border-gold/25 rounded-xs p-6 sm:p-10 lg:p-12 backdrop-blur-sm relative">
            {isSubmitted ? (
              /* Success / Confirmation State */
              <div className="py-12 text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full border border-gold/40 flex items-center justify-center bg-espresso/50">
                  <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.3em] text-gold font-sans font-light">
                    Reservation Request Received
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl text-ivory">
                    We look forward to welcoming you, {formData.name}.
                  </h3>
                  <p className="font-sans text-xs text-gold/90 font-mono tracking-widest">
                    REFERENCE: {confirmedReference || 'MHR-2026-CONFIRMED'}
                  </p>
                </div>

                {/* Digital Dining Pass with 1-Click Calendar Sync */}
                <div className="max-w-xl mx-auto text-left">
                  <DigitalDiningPass
                    details={{
                      referenceCode: confirmedReference || 'MHR-2026-CONFIRMED',
                      guestName: formData.name,
                      partySize: formData.guests,
                      date: formData.date,
                      timeSlot: formData.time,
                      spaceName: SPACES.find((s) => s.id === formData.space)?.label || formData.space,
                      specialNotes: formData.notes,
                    }}
                  />
                </div>

                <p className="font-sans text-xs text-ivory/70 max-w-md mx-auto leading-relaxed font-light">
                  Our Maitre D’ will review your table notes and confirm allocation via SMS & email within two hours.
                </p>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-2.5 border border-gold/40 text-gold hover:bg-gold/10 text-xs uppercase tracking-[0.2em] font-sans transition-colors"
                  >
                    Make Another Request
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Form */
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Party Size Selection */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.25em] text-gold font-sans mb-3">
                    01 · Select Party Size
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[1, 2, 4, 6, 8, 12].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormData({ ...formData, guests: num })}
                        className={`py-3 text-center border rounded-xs font-sans text-xs tracking-wider transition-all duration-200 ${
                          formData.guests === num
                            ? 'border-gold bg-gold text-obsidian font-semibold shadow-md'
                            : 'border-gold/25 bg-obsidian/40 text-ivory hover:border-gold/50'
                        }`}
                      >
                        {num === 12 ? '10+ Salon' : `${num} ${num === 1 ? 'Guest' : 'Guests'}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Date & Preferred Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="res-date"
                      className="block text-xs uppercase tracking-[0.25em] text-gold font-sans mb-2"
                    >
                      02 · Date
                    </label>
                    <input
                      id="res-date"
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={getTodayDate()}
                      className="w-full bg-obsidian/60 border border-gold/25 text-ivory p-3.5 text-xs font-sans rounded-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="res-time"
                      className="block text-xs uppercase tracking-[0.25em] text-gold font-sans mb-2"
                    >
                      03 · Seating Time
                    </label>
                    <select
                      id="res-time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-obsidian/60 border border-gold/25 text-ivory p-3.5 text-xs font-sans rounded-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot.value} value={slot.value} className="bg-obsidian text-ivory">
                          {slot.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Step 3: Space Preference */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs uppercase tracking-[0.25em] text-gold font-sans">
                      04 · Preferred Pavilion or Room
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsFloorplanOpen(true)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-sans text-gold hover:text-ivory uppercase tracking-wider bg-gold/10 hover:bg-gold/20 border border-gold/30 px-2.5 py-1 rounded-xs transition-colors"
                    >
                      <span>🗺️ View Floorplan</span>
                    </button>
                  </div>

                  {selectedTableInfo && (
                    <div className="mb-3 p-2.5 bg-gold/15 border border-gold/40 text-gold text-xs font-sans rounded-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                        <span>Pre-selected Table: <strong>{selectedTableInfo}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedTableInfo(null)}
                        className="text-gold/70 hover:text-gold text-[10px] uppercase tracking-wider"
                      >
                        Reset
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SPACES.map((space) => {
                      const isSelected = formData.space === space.id
                      return (
                        <button
                          key={space.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, space: space.id })}
                          className={`p-3.5 text-left border rounded-xs transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-gold bg-espresso/60 text-ivory'
                              : 'border-gold/20 bg-obsidian/40 text-ivory/70 hover:border-gold/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-serif text-sm font-medium text-ivory">
                              {space.label}
                            </span>
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isSelected ? 'bg-gold' : 'border border-gold/40'
                              }`}
                            />
                          </div>
                          <span className="text-[10px] font-sans text-gold/70 mt-1">{space.desc}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Step 4: Contact Information */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.25em] text-gold font-sans mb-3">
                    05 · Guest Information
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Your Full Name *"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-obsidian/60 border border-gold/25 text-ivory p-3.5 text-xs font-sans rounded-xs placeholder:text-ivory/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email Address *"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-obsidian/60 border border-gold/25 text-ivory p-3.5 text-xs font-sans rounded-xs placeholder:text-ivory/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Mobile Number *"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-obsidian/60 border border-gold/25 text-ivory p-3.5 text-xs font-sans rounded-xs placeholder:text-ivory/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                      />
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Special requests, dietary restrictions, or anniversary celebrations..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-obsidian/60 border border-gold/25 text-ivory p-3.5 text-xs font-sans rounded-xs placeholder:text-ivory/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                  />
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-200 text-xs font-sans rounded-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gold text-obsidian font-sans text-xs uppercase tracking-[0.25em] font-semibold hover:bg-ivory transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting to Concierge...</span>
                      </>
                    ) : (
                      <span>Request Table Reservation</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Concierge Desk & Dining Policies */}
          <div className="lg:col-span-4 space-y-6">
            {/* Direct Concierge Box */}
            <div className="bg-espresso/35 border border-gold/20 p-8 rounded-xs space-y-5">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-sans font-light block">
                Direct Concierge Desk
              </span>
              <h3 className="font-serif text-2xl text-ivory font-light">
                Private Dining & Bespoke Inquiries
              </h3>
              <p className="font-sans text-xs text-ivory/70 leading-relaxed font-light">
                For custom wedding tasting banquets, cellar room buyouts, or international sommelier
                masterclasses, please reach our head of hospitality directly.
              </p>

              <div className="space-y-3 pt-2 text-xs font-sans">
                <div className="flex items-center gap-3 text-ivory/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <a href="tel:+912249201800" className="hover:text-gold transition-colors">
                    +91 (022) 4920 1800
                  </a>
                </div>
                <div className="flex items-center gap-3 text-ivory/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <a href="mailto:concierge@mehraab.in" className="hover:text-gold transition-colors">
                    concierge@mehraab.in
                  </a>
                </div>
              </div>
            </div>

            {/* Dining Etiquette & Policies */}
            <div className="bg-espresso/20 border border-gold/15 p-8 rounded-xs space-y-4 text-xs font-sans text-ivory/70">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold/80 block">
                Dining Protocol
              </span>

              <div className="space-y-3 font-light text-[11px] leading-relaxed">
                <div>
                  <strong className="text-ivory font-medium block text-xs">Attire:</strong>
                  Elegant casual or celebratory attire. Athletic wear and beachwear are courteously restricted.
                </div>
                <div>
                  <strong className="text-ivory font-medium block text-xs">Grace Period:</strong>
                  Tables are reserved for 20 minutes past booking time before release to the waiting salon.
                </div>
                <div>
                  <strong className="text-ivory font-medium block text-xs">Valet Parking:</strong>
                  Complimentary private valet attendants available at the Heritage Gate, Ballard Estate.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Architectural Floorplan Modal */}
      {isFloorplanOpen && (
        <InteractiveFloorplan
          isModal
          initialPavilionId={formData.space}
          onClose={() => setIsFloorplanOpen(false)}
          onSelectTable={handleFloorplanSelect}
        />
      )}
    </section>
  )
}

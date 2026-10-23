import { useState, type FormEvent } from 'react'

interface WalkInModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const TIME_SLOTS = [
  '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30', '20:00', '21:30', '22:15'
]

const SPACES = [
  { id: 'grand-hall', label: 'Grand Mehraab Hall' },
  { id: 'courtyard', label: 'Courtyard of Embers' },
  { id: 'cafe', label: 'The Roastery Verandah' },
  { id: 'parda', label: 'The Parda Salon (VIP)' },
]

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export function WalkInModal({ isOpen, onClose, onSuccess }: WalkInModalProps) {
  const [formData, setFormData] = useState(() => ({
    name: '',
    email: '',
    phone: '',
    guests: 2,
    date: getToday(),
    time: '20:00',
    space: 'grand-hall',
    notes: '',
  }))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to record reservation.')
      }

      onSuccess()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error creating reservation.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-obsidian/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#1c1c1c] border border-gold/40 rounded-xs p-4 sm:p-6 lg:p-8 shadow-2xl shadow-obsidian text-left overflow-y-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gold/20 mb-4 sm:mb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-sans block mb-1">
              Direct Front-of-House Booking
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-ivory">Record Walk-in / Phone Reservation</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-gold/30 text-ivory hover:text-gold flex items-center justify-center transition-colors shrink-0 ml-2"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs font-sans rounded-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gold font-sans mb-1.5">
                Guest Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-obsidian border border-gold/25 text-ivory p-3 text-xs font-sans rounded-xs focus:outline-none focus:border-gold"
                placeholder="e.g. Maharaja Yuvraj"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gold font-sans mb-1.5">
                Contact Phone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-obsidian border border-gold/25 text-ivory p-3 text-xs font-sans rounded-xs focus:outline-none focus:border-gold"
                placeholder="+91 98200 00000"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gold font-sans mb-1.5">
              Guest Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-obsidian border border-gold/25 text-ivory p-3 text-xs font-sans rounded-xs focus:outline-none focus:border-gold"
              placeholder="guest@domain.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gold font-sans mb-1.5">
                Covers (Guests)
              </label>
              <input
                type="number"
                min="1"
                max="24"
                required
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                className="w-full bg-obsidian border border-gold/25 text-ivory p-3 text-xs font-sans rounded-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gold font-sans mb-1.5">
                Service Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-obsidian border border-gold/25 text-ivory p-3 text-xs font-sans rounded-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gold font-sans mb-1.5">
                Seating Time
              </label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-obsidian border border-gold/25 text-ivory p-3 text-xs font-sans rounded-xs focus:outline-none focus:border-gold"
              >
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t} className="bg-obsidian">
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gold font-sans mb-1.5">
              Pavilion / Room Allocation
            </label>
            <select
              value={formData.space}
              onChange={(e) => setFormData({ ...formData, space: e.target.value })}
              className="w-full bg-obsidian border border-gold/25 text-ivory p-3 text-xs font-sans rounded-xs focus:outline-none focus:border-gold"
            >
              {SPACES.map((s) => (
                <option key={s.id} value={s.id} className="bg-obsidian">
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gold font-sans mb-1.5">
              Special Table & Dietary Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. VIP guest, window arch alcove, sparkling water on arrival..."
              className="w-full bg-obsidian border border-gold/25 text-ivory p-3 text-xs font-sans rounded-xs focus:outline-none focus:border-gold"
            />
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gold/30 text-ivory/80 font-sans text-xs uppercase tracking-[0.2em] hover:bg-gold/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-gold text-obsidian font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:bg-ivory transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Recording...' : 'Confirm Table'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

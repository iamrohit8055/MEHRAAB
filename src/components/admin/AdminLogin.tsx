import { useState, type FormEvent } from 'react'

export interface AdminUser {
  id?: string
  name: string
  email: string
  role: string
}

interface AdminLoginProps {
  onLoginSuccess: (token: string, user: AdminUser) => void
  onReturnHome: () => void
}

export function AdminLogin({ onLoginSuccess, onReturnHome }: AdminLoginProps) {
  const [email, setEmail] = useState('admin@mehraab.in')
  const [password, setPassword] = useState('Mehraab2026!')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials.')
      }

      localStorage.setItem('mehraab_admin_token', data.token)
      localStorage.setItem('mehraab_admin_user', JSON.stringify(data.user))
      onLoginSuccess(data.token, data.user)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please verify credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      {/* Background arch watermark */}
      <div className="relative w-full max-w-md bg-espresso/30 border border-gold/30 rounded-xs p-8 sm:p-10 backdrop-blur-md shadow-2xl shadow-obsidian">
        {/* Subtle Arch Ornament */}
        <div className="text-center mb-8">
          <div className="w-12 h-14 mx-auto mb-4 text-gold flex items-center justify-center">
            <svg viewBox="0 0 48 56" fill="none" className="w-full h-full stroke-gold">
              <path d="M 6 54 V 28 C 6 15 16 7 24 2 C 32 7 42 15 42 28 V 54" strokeWidth="1.5" />
              <path d="M 12 54 V 30 C 12 20 18 13 24 9 C 30 13 36 20 36 30 V 54" strokeWidth="0.8" opacity="0.6" />
              <circle cx="24" cy="9" r="1.5" fill="currentColor" />
            </svg>
          </div>

          <span className="text-[10px] uppercase tracking-[0.35em] text-gold font-sans block mb-1">
            Staff Concierge & Front-of-House
          </span>
          <h2 className="font-serif text-3xl font-light text-ivory">Maître D' Portal</h2>
          <p className="font-sans text-xs text-ivory/60 mt-1 font-light">
            Authorized hospitality team access for table allocation & run sheets.
          </p>
        </div>

        {/* Demo Credentials Pill */}
        <div className="mb-6 p-3 bg-obsidian/70 border border-gold/20 rounded-xs text-[11px] font-sans text-ivory/80 space-y-1">
          <div className="flex items-center justify-between text-gold">
            <span className="font-medium uppercase tracking-wider text-[10px]">Staff Key</span>
            <span className="text-[9px] bg-gold/15 px-1.5 py-0.5 rounded-xs border border-gold/30">Auto-filled</span>
          </div>
          <div className="flex justify-between font-mono text-ivory/70 text-[10px]">
            <span>Email: admin@mehraab.in</span>
            <span>Pass: Mehraab2026!</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs font-sans rounded-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] text-gold font-sans mb-1.5">
              Staff Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-obsidian/80 border border-gold/25 text-ivory p-3.5 text-xs font-sans rounded-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              placeholder="admin@mehraab.in"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] text-gold font-sans mb-1.5">
              Security Passcode
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-obsidian/80 border border-gold/25 text-ivory p-3.5 text-xs font-sans rounded-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gold text-obsidian font-sans text-xs uppercase tracking-[0.25em] font-semibold hover:bg-ivory transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Enter Front-of-House</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onReturnHome}
            className="text-xs font-sans text-ivory/60 hover:text-gold transition-colors tracking-wider"
          >
            ← Return to Dining Sanctuary
          </button>
        </div>
      </div>
    </div>
  )
}

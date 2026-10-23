import { useState, type FormEvent } from 'react'

interface LiveSmsConfigFormProps {
  token: string
  onSaved: () => void
}

export function LiveSmsConfigForm({ token, onSaved }: LiveSmsConfigFormProps) {
  const [providerTab, setProviderTab] = useState<'fast2sms' | 'twilio' | 'resend'>('fast2sms')
  
  // Fast2SMS credentials
  const [fast2smsKey, setFast2smsKey] = useState('')
  
  // Twilio credentials
  const [twilioSid, setTwilioSid] = useState('')
  const [twilioToken, setTwilioToken] = useState('')
  const [twilioPhone, setTwilioPhone] = useState('')

  // Resend credentials
  const [resendKey, setResendKey] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFeedback(null)

    try {
      const payload: Record<string, string> = {}
      if (providerTab === 'fast2sms') {
        if (!fast2smsKey.trim()) {
          throw new Error('Please enter your Fast2SMS API key.')
        }
        payload.fast2smsKey = fast2smsKey.trim()
      } else if (providerTab === 'twilio') {
        if (!twilioSid.trim() || !twilioToken.trim() || !twilioPhone.trim()) {
          throw new Error('Please provide Twilio Account SID, Auth Token, and Twilio Phone Number.')
        }
        payload.twilioSid = twilioSid.trim()
        payload.twilioToken = twilioToken.trim()
        payload.twilioPhone = twilioPhone.trim()
      } else if (providerTab === 'resend') {
        if (!resendKey.trim()) {
          throw new Error('Please enter your Resend API key.')
        }
        payload.resendKey = resendKey.trim()
      }

      const res = await fetch('/api/admin/gateway-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save gateway configuration.')
      }

      setFeedback({
        type: 'success',
        message: 'Credentials saved! Outbound gateway is now LIVE.',
      })
      onSaved()
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update credentials.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-3 sm:p-4 bg-obsidian/90 border border-gold/30 rounded-xs space-y-3 font-sans text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold/15 pb-2">
        <span className="text-[10px] uppercase tracking-wider text-gold font-semibold">
          Configure Live Dispatch Gateways
        </span>
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setProviderTab('fast2sms')}
            className={`px-2.5 py-1 rounded-xs uppercase text-[10px] tracking-wider transition-colors ${
              providerTab === 'fast2sms'
                ? 'bg-gold text-obsidian font-semibold'
                : 'text-ivory/60 hover:text-gold bg-espresso/40'
            }`}
          >
            Fast2SMS (India)
          </button>
          <button
            type="button"
            onClick={() => setProviderTab('twilio')}
            className={`px-2.5 py-1 rounded-xs uppercase text-[10px] tracking-wider transition-colors ${
              providerTab === 'twilio'
                ? 'bg-gold text-obsidian font-semibold'
                : 'text-ivory/60 hover:text-gold bg-espresso/40'
            }`}
          >
            Twilio (Global)
          </button>
          <button
            type="button"
            onClick={() => setProviderTab('resend')}
            className={`px-2.5 py-1 rounded-xs uppercase text-[10px] tracking-wider transition-colors ${
              providerTab === 'resend'
                ? 'bg-gold text-obsidian font-semibold'
                : 'text-ivory/60 hover:text-gold bg-espresso/40'
            }`}
          >
            Email (Resend)
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-3">
        {providerTab === 'fast2sms' && (
          <div className="space-y-2">
            <div className="text-[11px] text-ivory/70 leading-relaxed bg-espresso/30 p-2.5 rounded-xs border border-gold/10">
              <strong className="text-gold block mb-1">⚡ Fast2SMS Quick Setup (India Mobile Delivery):</strong>
              <ol className="list-decimal list-inside space-y-0.5 text-ivory/60 text-[10px]">
                <li>Sign up free at <span className="text-gold font-mono">fast2sms.com</span> (includes free signup credits).</li>
                <li>Go to <strong>Dev API</strong> in your Fast2SMS dashboard.</li>
                <li>Copy your <strong>Authorization API Key</strong> and paste it below.</li>
              </ol>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-ivory/60 mb-1">
                Fast2SMS API Key / Authorization Token
              </label>
              <input
                type="password"
                placeholder="Paste Fast2SMS authorization key..."
                value={fast2smsKey}
                onChange={(e) => setFast2smsKey(e.target.value)}
                className="w-full bg-black/60 border border-gold/30 text-ivory px-3 py-1.5 text-xs font-mono rounded-xs focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        )}

        {providerTab === 'twilio' && (
          <div className="space-y-2">
            <div className="text-[11px] text-ivory/70 leading-relaxed bg-espresso/30 p-2.5 rounded-xs border border-gold/10">
              <strong className="text-gold block mb-1">🌍 Twilio Setup (Global Outbound SMS):</strong>
              <p className="text-ivory/60 text-[10px]">
                Grab your Account SID, Auth Token, and Sender Phone Number from your Twilio Console.
              </p>
            </div>
            <div className="space-y-2">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-ivory/60 mb-0.5">
                  Account SID
                </label>
                <input
                  type="text"
                  placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={twilioSid}
                  onChange={(e) => setTwilioSid(e.target.value)}
                  className="w-full bg-black/60 border border-gold/30 text-ivory px-3 py-1.5 text-xs font-mono rounded-xs focus:outline-none focus:border-gold"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-ivory/60 mb-0.5">
                    Auth Token
                  </label>
                  <input
                    type="password"
                    placeholder="Twilio Auth Token..."
                    value={twilioToken}
                    onChange={(e) => setTwilioToken(e.target.value)}
                    className="w-full bg-black/60 border border-gold/30 text-ivory px-3 py-1.5 text-xs font-mono rounded-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-ivory/60 mb-0.5">
                    Twilio Phone Number (E.164)
                  </label>
                  <input
                    type="text"
                    placeholder="+1234567890"
                    value={twilioPhone}
                    onChange={(e) => setTwilioPhone(e.target.value)}
                    className="w-full bg-black/60 border border-gold/30 text-ivory px-3 py-1.5 text-xs font-mono rounded-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {providerTab === 'resend' && (
          <div className="space-y-2">
            <div className="text-[11px] text-ivory/70 leading-relaxed bg-espresso/30 p-2.5 rounded-xs border border-gold/10">
              <strong className="text-gold block mb-1">✉️ Resend Setup (Luxury HTML Email Delivery):</strong>
              <p className="text-ivory/60 text-[10px]">
                Create API key at <span className="text-gold font-mono">resend.com</span>. Sends via official Resend REST API.
              </p>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-ivory/60 mb-1">
                Resend API Key (re_...)
              </label>
              <input
                type="password"
                placeholder="re_xxxxxxxxxxxxxxxxxxxxxx"
                value={resendKey}
                onChange={(e) => setResendKey(e.target.value)}
                className="w-full bg-black/60 border border-gold/30 text-ivory px-3 py-1.5 text-xs font-mono rounded-xs focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        )}

        {feedback && (
          <div
            className={`p-2 rounded-xs text-[11px] ${
              feedback.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-ivory/40">
            Keys are saved directly into <code className="text-gold">server/.env</code> and activated in memory.
          </span>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-1.5 bg-gold text-obsidian font-sans text-xs uppercase tracking-wider font-semibold hover:bg-ivory transition-colors rounded-xs disabled:opacity-50 shadow-sm"
          >
            {isSubmitting ? 'Saving...' : '💾 Save Gateway Key'}
          </button>
        </div>
      </form>
    </div>
  )
}

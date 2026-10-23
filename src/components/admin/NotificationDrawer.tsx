import { useState, useEffect, useCallback, type FormEvent } from 'react'
import { LiveSmsConfigForm } from './LiveSmsConfigForm'

export interface NotificationLog {
  id: string
  reservation_id: string
  channel: 'EMAIL' | 'SMS'
  recipient: string
  subject: string
  content: string
  status: string
  created_at: string
}

interface GatewayInfo {
  email: {
    configured: boolean
    provider: string
    details: string
  }
  sms: {
    configured: boolean
    provider: string
    details: string
  }
}

interface NotificationDrawerProps {
  isOpen: boolean
  onClose: () => void
  token: string
}

export function NotificationDrawer({ isOpen, onClose, token }: NotificationDrawerProps) {
  const [logs, setLogs] = useState<NotificationLog[]>([])
  const [gateway, setGateway] = useState<GatewayInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<NotificationLog | null>(null)

  // Test send state
  const [testEmail, setTestEmail] = useState('')
  const [testPhone, setTestPhone] = useState('+91 ')
  const [channelFilter, setChannelFilter] = useState<'ALL' | 'EMAIL' | 'SMS'>('ALL')
  const [isTesting, setIsTesting] = useState(false)
  const [testFeedback, setTestFeedback] = useState<string | null>(null)
  const [showConfigGuide, setShowConfigGuide] = useState(false)

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setLogs(data.notifications || [])
      }
    } catch (err) {
      console.error('Failed to fetch notification logs:', err)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  const fetchGateway = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/gateway-status', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setGateway(data.gateway)
      }
    } catch (err) {
      console.error('Failed to fetch gateway status:', err)
    }
  }, [token])

  useEffect(() => {
    if (isOpen) {
      fetchLogs()
      fetchGateway()
    }
  }, [isOpen, fetchLogs, fetchGateway])

  const handleTestSend = async (e: FormEvent) => {
    e.preventDefault()
    if (!testEmail && !testPhone) return

    setIsTesting(true)
    setTestFeedback(null)

    try {
      const res = await fetch('/api/admin/test-dispatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: testEmail, phone: testPhone }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to trigger test.')
      }

      const notes: string[] = []
      if (data.smsResult) {
        if (data.smsResult.status === 'DELIVERED_OUTBOUND') {
          notes.push('✓ SMS delivered to mobile')
        } else if (data.smsResult.status === 'FAILED_OUTBOUND') {
          notes.push(`⚠️ SMS: ${data.smsResult.note}`)
        } else {
          notes.push('ℹ SMS simulated locally')
        }
      }

      if (data.emailResult) {
        if (data.emailResult.status === 'DELIVERED_OUTBOUND') {
          notes.push('✓ Email delivered to inbox')
        } else if (data.emailResult.status === 'FAILED_OUTBOUND') {
          notes.push(`⚠️ Email: ${data.emailResult.note}`)
        }
      }

      setTestFeedback(notes.length > 0 ? notes.join(' · ') : 'Test dispatch processed — check audit log below.')
      fetchLogs()
      fetchGateway()
    } catch (err: unknown) {
      setTestFeedback(err instanceof Error ? err.message : 'Test dispatch failed')
    } finally {
      setIsTesting(false)
    }
  }

  const filteredLogs = logs.filter((log) => {
    if (channelFilter === 'ALL') return true
    return log.channel === channelFilter
  })

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-end bg-obsidian/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl h-full bg-[#181818] border-l border-gold/30 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gold/20">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-sans block mb-1">
              Automated Guest Communications
            </span>
            <h3 className="font-serif text-2xl text-ivory">Dispatch Audit Logs</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                fetchLogs()
                fetchGateway()
              }}
              title="Refresh logs"
              className="p-1.5 border border-gold/30 text-gold hover:bg-gold/10 rounded-xs"
            >
              ⟳
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-gold/30 text-ivory hover:text-gold flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Gateway Status Banners: Email & SMS */}
        <div className="pt-4 pb-2 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
            {/* Email Gateway Card */}
            <div className={`p-2.5 rounded-xs border flex items-center justify-between min-w-0 gap-2 ${
              gateway?.email.configured
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
            }`}>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className={`w-2 h-2 rounded-full shrink-0 ${gateway?.email.configured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span className="truncate text-xs">Email: <strong>{gateway?.email.provider || 'Resend'}</strong></span>
              </div>
              <span className="text-[9px] font-mono shrink-0 uppercase tracking-wider px-1.5 py-0.5 rounded-xs bg-black/60 whitespace-nowrap">
                {gateway?.email.configured ? 'LIVE' : 'SIMULATED'}
              </span>
            </div>

            {/* SMS Gateway Card */}
            <div className={`p-2.5 rounded-xs border flex items-center justify-between min-w-0 gap-2 ${
              gateway?.sms.configured
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
            }`}>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className={`w-2 h-2 rounded-full shrink-0 ${gateway?.sms.configured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span className="truncate text-xs">SMS: <strong>{gateway?.sms.configured ? gateway?.sms.provider : 'Simulation'}</strong></span>
              </div>
              <span className="text-[9px] font-mono shrink-0 uppercase tracking-wider px-1.5 py-0.5 rounded-xs bg-black/60 whitespace-nowrap">
                {gateway?.sms.configured ? 'LIVE' : 'SIMULATED'}
              </span>
            </div>
          </div>

          {/* Setup Guide Button */}
          <div className="flex items-center justify-between text-[11px] font-sans">
            <span className="text-ivory/50">
              {gateway?.sms.configured ? '✓ Direct mobile cell delivery active' : 'Simulation mode: Add key to send to real phones'}
            </span>
            <button
              type="button"
              onClick={() => setShowConfigGuide(!showConfigGuide)}
              className="text-gold hover:underline tracking-wider uppercase font-semibold"
            >
              {showConfigGuide ? 'Hide Setup' : '⚙️ Setup Live SMS Key'}
            </button>
          </div>

          {/* Interactive Live SMS Setup Form */}
          {showConfigGuide && (
            <LiveSmsConfigForm
              token={token}
              onSaved={() => {
                fetchGateway()
                fetchLogs()
              }}
            />
          )}
        </div>

        {/* Live Test Send Section (Email + SMS) */}
        <div className="py-2">
          <form onSubmit={handleTestSend} className="p-3 bg-obsidian/70 border border-gold/20 rounded-xs space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-gold font-sans font-semibold">
              Live Test Dispatcher (Email + Mobile SMS)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="email"
                placeholder="Target email (e.g. you@domain.com)..."
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="bg-black/50 border border-gold/25 text-ivory px-3 py-1.5 text-xs font-sans rounded-xs focus:outline-none focus:border-gold"
              />
              <input
                type="tel"
                placeholder="Target mobile (e.g. +91 9889909685)..."
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="bg-black/50 border border-gold/25 text-ivory px-3 py-1.5 text-xs font-sans rounded-xs focus:outline-none focus:border-gold"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-ivory/50 font-sans">
                Attempts live dispatch via active gateways + logs to SQLite.
              </span>
              <button
                type="submit"
                disabled={isTesting}
                className="px-4 py-1.5 bg-gold text-obsidian font-sans text-xs uppercase tracking-wider font-semibold hover:bg-ivory transition-colors rounded-xs disabled:opacity-50 shrink-0 shadow-sm"
              >
                {isTesting ? 'Dispatching...' : '⚡ Test Send Now'}
              </button>
            </div>
          </form>
          {testFeedback && (
            <p className="mt-1.5 text-[11px] font-sans text-gold pl-1">{testFeedback}</p>
          )}
        </div>

        {/* Channel Filter Tabs */}
        <div className="flex items-center gap-1.5 pt-2 pb-1 text-xs font-sans border-b border-gold/15">
          {(['ALL', 'SMS', 'EMAIL'] as const).map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => setChannelFilter(ch)}
              className={`px-3 py-1 rounded-xs transition-colors uppercase text-[10px] tracking-wider font-semibold ${
                channelFilter === ch
                  ? 'bg-gold text-obsidian'
                  : 'text-ivory/60 hover:text-gold bg-espresso/30'
              }`}
            >
              {ch} ({logs.filter((l) => ch === 'ALL' || l.channel === ch).length})
            </button>
          ))}
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {isLoading ? (
            <div className="py-12 text-center text-xs font-sans text-gold">Loading dispatches...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-xs font-sans text-ivory/60">
              No notifications dispatched yet in {channelFilter} channel.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isDelivered = log.status === 'DELIVERED_OUTBOUND'
              const isFailed = log.status === 'FAILED_OUTBOUND'

              return (
                <div
                  key={log.id}
                  className="p-4 bg-obsidian/60 border border-gold/15 rounded-xs space-y-2 hover:border-gold/30 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span
                        className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-xs font-mono shrink-0 ${
                          log.channel === 'EMAIL'
                            ? 'bg-blue-900/40 text-blue-300 border border-blue-500/30'
                            : 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {log.channel}
                      </span>
                      <span className="text-gold font-mono text-[11px] truncate">{log.recipient}</span>
                    </div>

                    {/* Delivery Status Badge */}
                    <span
                      className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-xs font-sans font-medium shrink-0 whitespace-nowrap ${
                        isDelivered
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : isFailed
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {isDelivered
                        ? log.channel === 'SMS' ? '✓ Delivered to Mobile' : '✓ Delivered to Inbox'
                        : isFailed
                        ? '✕ Outbound Failed'
                        : 'ℹ Local Simulation'}
                    </span>
                  </div>

                  <div className="text-xs font-sans text-ivory font-medium">
                    {log.subject}
                  </div>

                  {log.channel === 'SMS' ? (
                    <div className="space-y-1.5">
                      <p className={`text-[11px] font-mono p-2.5 rounded-xs border whitespace-pre-wrap ${
                        isFailed
                          ? 'text-rose-300 bg-rose-950/25 border-rose-500/30'
                          : 'text-ivory/70 bg-espresso/30 border-gold/10'
                      }`}>
                        {log.content}
                      </p>
                      {(() => {
                        const cleanSms = log.content.replace(/^⚠️ Gateway Alert:.*?\n\n/s, '')
                        return (
                          <div className="flex items-center gap-3 pt-0.5">
                            <a
                              href={`https://wa.me/${log.recipient.replace(/\D/g, '')}?text=${encodeURIComponent(cleanSms)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 hover:text-emerald-300 font-sans tracking-wide"
                            >
                              <span>💬 Open in WhatsApp</span>
                              <span>↗</span>
                            </a>
                            <a
                              href={`sms:${log.recipient.replace(/[^\d+]/g, '')}?body=${encodeURIComponent(cleanSms)}`}
                              className="inline-flex items-center gap-1.5 text-[11px] text-gold hover:text-ivory font-sans tracking-wide"
                            >
                              <span>📲 Send via Native SMS</span>
                              <span>↗</span>
                            </a>
                          </div>
                        )
                      })()}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedEmail(log)}
                      className="inline-flex items-center gap-1.5 text-[11px] text-gold hover:underline tracking-wider font-sans uppercase pt-1"
                    >
                      <span>View Rendered Luxury HTML Email</span>
                      <span>→</span>
                    </button>
                  )}

                  <div className="flex justify-between items-center text-[10px] text-ivory/40 pt-1 border-t border-gold/5 font-mono">
                    <span>Audit ID: {log.id.slice(0, 8)}...</span>
                    <span>{new Date(log.created_at).toLocaleTimeString()} · {new Date(log.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="pt-3 border-t border-gold/15 text-[11px] font-sans text-ivory/50 flex justify-between">
          <span>Engine: Node.js Native SQLite & Fetch</span>
          <span>Gateway: {gateway?.email.provider || 'Simulation'}</span>
        </div>
      </div>

      {/* Rendered HTML Email Preview Modal */}
      {selectedEmail && (
        <div
          role="dialog"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setSelectedEmail(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#121212] border border-gold/40 rounded-xs overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 bg-espresso/50 border-b border-gold/20">
              <span className="text-xs font-sans text-gold uppercase tracking-wider">
                Email Preview: {selectedEmail.recipient}
              </span>
              <button
                type="button"
                onClick={() => setSelectedEmail(null)}
                className="text-ivory hover:text-gold text-sm"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-[#141414]">
              <iframe
                title="Email Preview"
                srcDoc={selectedEmail.content}
                className="w-full h-[520px] rounded border border-zinc-800 bg-[#171717]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

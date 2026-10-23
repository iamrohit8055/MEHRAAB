import { useState, useEffect, useCallback } from 'react'
import { AdminLogin, type AdminUser } from './AdminLogin'
import { AdminStats } from './AdminStats'
import { AdminRunSheet, type ReservationRow } from './AdminRunSheet'
import { WalkInModal } from './WalkInModal'
import { NotificationDrawer } from './NotificationDrawer'
import { ServiceBriefingModal } from './ServiceBriefingModal'
import { BrandLogo } from '../BrandLogo'
import { useNavigation } from '../../hooks/useNavigation'

interface StatsData {
  total: number
  pending: number
  confirmed: number
  seatedToday: number
}

export function AdminDashboard() {
  const { navigateTo } = useNavigation()

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('mehraab_admin_token')
  })
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const raw = localStorage.getItem('mehraab_admin_user')
    return raw ? JSON.parse(raw) : null
  })

  const [reservations, setReservations] = useState<ReservationRow[]>([])
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isWalkInOpen, setIsWalkInOpen] = useState(false)
  const [isLogsOpen, setIsLogsOpen] = useState(false)
  const [isBriefingOpen, setIsBriefingOpen] = useState(false)

  const [selectedDate, setSelectedDate] = useState<string>('ALL')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')

  const handleLogout = useCallback(() => {
    localStorage.removeItem('mehraab_admin_token')
    localStorage.removeItem('mehraab_admin_user')
    setToken(null)
    setCurrentUser(null)
  }, [])

  const fetchStats = useCallback(async (authToken: string) => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
      }
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }, [])

  const fetchReservations = useCallback(
    async (authToken: string) => {
      try {
        setIsLoading(true)
        const res = await fetch('/api/admin/reservations', {
          headers: { Authorization: `Bearer ${authToken}` },
        })

        if (res.ok) {
          const data = await res.json()
          setReservations(data.reservations || [])
        } else if (res.status === 401) {
          // Token expired
          handleLogout()
        }
      } catch (err) {
        console.error('Failed to fetch reservations:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [handleLogout]
  )

  // Reload data on initial load or token change
  useEffect(() => {
    if (token) {
      fetchReservations(token)
      fetchStats(token)
    }
  }, [token, fetchReservations, fetchStats])

  const handleLoginSuccess = (newToken: string, user: AdminUser) => {
    setToken(newToken)
    setCurrentUser(user)
  }

  const handleStatusChange = async (id: string, newStatus: ReservationRow['status']) => {
    if (!token) return

    // Optimistic UI update
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    )

    try {
      const res = await fetch(`/api/admin/reservations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        throw new Error('Failed to update status')
      }

      fetchStats(token)
    } catch (err) {
      console.error('Status update failed:', err)
      // Re-fetch on failure to sync
      fetchReservations(token)
    }
  }

  const handleToggleVip = async (guestId: string, currentVip: number) => {
    if (!token) return
    const nextVip = currentVip ? 0 : 1

    // Optimistic UI update
    setReservations((prev) =>
      prev.map((r) => (r.guest_id === guestId ? { ...r, vip_status: nextVip } : r))
    )

    try {
      const res = await fetch(`/api/admin/guests/${guestId}/vip`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vip_status: nextVip }),
      })

      if (!res.ok) {
        throw new Error('Failed to update VIP status')
      }
    } catch (err) {
      console.error('VIP update failed:', err)
      fetchReservations(token)
    }
  }

  const handleDeleteReservation = async (id: string) => {
    if (!token) return

    setReservations((prev) => prev.filter((r) => r.id !== id))

    try {
      await fetch(`/api/admin/reservations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchStats(token)
    } catch (err) {
      console.error('Delete failed:', err)
      fetchReservations(token)
    }
  }

  if (!token) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onReturnHome={() => navigateTo('home')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-obsidian text-ivory font-sans selection:bg-gold selection:text-obsidian flex flex-col">
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-obsidian/95 backdrop-blur-md border-b border-gold/20 py-2.5 sm:py-4 shadow-xl shadow-obsidian">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <BrandLogo size="sm" showDescriptor={false} />
            <div className="h-5 sm:h-6 w-[1px] bg-gold/30 hidden md:block" />
            <span className="hidden md:inline font-sans text-xs uppercase tracking-[0.25em] text-gold/90 font-medium truncate">
              Maître D' Run Sheet & Console
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap justify-end">
            {/* Staff Profile Badge */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-sans text-ivory/80 bg-espresso/40 border border-gold/20 px-2.5 py-1.5 rounded-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{currentUser?.name || 'Staff Maître D’'}</span>
              <span className="text-[10px] text-gold uppercase tracking-wider font-mono">
                ({currentUser?.role || 'ADMIN'})
              </span>
            </div>

            {/* Daily Service Briefing Sheet */}
            <button
              type="button"
              onClick={() => setIsBriefingOpen(true)}
              className="px-2 sm:px-3 py-1.5 bg-gold/15 border border-gold/40 text-gold hover:bg-gold hover:text-obsidian text-[11px] sm:text-xs uppercase tracking-wider font-sans rounded-xs transition-colors flex items-center gap-1 font-medium shadow-xs"
              title="Open printable Kitchen & Captains Daily Service Briefing Sheet"
            >
              <span>📋</span>
              <span className="hidden sm:inline">Briefing</span>
            </button>

            {/* Dispatches Drawer */}
            <button
              type="button"
              onClick={() => setIsLogsOpen(true)}
              className="px-2 sm:px-3 py-1.5 border border-gold/40 text-gold hover:bg-gold/10 text-[11px] sm:text-xs uppercase tracking-wider font-sans rounded-xs transition-colors flex items-center gap-1"
              title="Automated guest dispatches & live SMS audit"
            >
              <span>✉️</span>
              <span className="hidden sm:inline">Dispatches</span>
              <span className="sm:hidden">Logs</span>
            </button>

            {/* View Sanctuary (Public Site) */}
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="px-2 sm:px-3 py-1.5 border border-gold/40 text-gold hover:bg-gold/10 text-[11px] sm:text-xs uppercase tracking-wider font-sans rounded-xs transition-colors"
              title="Return to guest-facing sanctuary"
            >
              <span className="hidden sm:inline">← Guest Site</span>
              <span className="sm:hidden">← Site</span>
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="px-2 sm:px-3 py-1.5 bg-espresso/50 border border-rose-500/30 text-rose-300 hover:bg-rose-950/40 text-[11px] sm:text-xs uppercase tracking-wider font-sans rounded-xs transition-colors"
              title="Sign out of Maître D' console"
            >
              <span className="hidden sm:inline">Sign Out</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Metric Cards */}
        <AdminStats stats={stats} isLoading={isLoading} />

        {/* Live Run Sheet Table */}
        <AdminRunSheet
          reservations={reservations}
          isLoading={isLoading}
          token={token}
          stats={stats}
          onStatusChange={handleStatusChange}
          onToggleVip={handleToggleVip}
          onDeleteReservation={handleDeleteReservation}
          onOpenWalkIn={() => setIsWalkInOpen(true)}
          onOpenBriefing={() => setIsBriefingOpen(true)}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          onRefresh={() => {
            fetchReservations(token)
            fetchStats(token)
          }}
        />
      </main>

      {/* Direct Walk-In Creation Modal */}
      <WalkInModal
        isOpen={isWalkInOpen}
        onClose={() => setIsWalkInOpen(false)}
        onSuccess={() => {
          fetchReservations(token)
          fetchStats(token)
        }}
      />

      {/* Automated Notification Dispatch Audit Drawer */}
      <NotificationDrawer
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
        token={token}
      />

      {/* Kitchen & Captains Daily Service Run Sheet Briefing Modal */}
      <ServiceBriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
        reservations={reservations}
        initialDate={selectedDate}
        token={token}
        currentUser={currentUser}
      />
    </div>
  )
}

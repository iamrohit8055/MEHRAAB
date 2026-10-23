import express, { type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { db, initDb } from './db'
import { seedAdmin } from './seed'
import {
  dispatchReservationNotifications,
  getGatewayConfig,
  sendLiveSms,
  generateSmsContent,
  generateWhatsAppUrl,
  type NotificationPayload,
} from './notifications'
import { compileBriefingPdf, type BriefingReservation } from './briefing-pdf'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load server/.env automatically
try {
  const envPath = path.resolve(__dirname, '..', '.env')
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=')
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim()
          let val = trimmed.slice(eqIdx + 1).trim()
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1)
          }
          if (!process.env[key]) {
            process.env[key] = val
          }
        }
      }
    }
  }
} catch {
  // Ignore
}

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'mehraab_luxury_jwt_secret_key_2026_imperial'

app.use(cors())
app.use(express.json())

// --- Authentication Middleware ---
interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string; name: string }
}

function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  let token = ''
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]
  } else if (req.query.token && typeof req.query.token === 'string') {
    token = req.query.token
  }

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Missing bearer token.' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthRequest['user']
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' })
  }
}

// --- Health Check ---
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    sanctuary: 'MEHRAAB Fine Dining API',
    engine: 'Node.js Native SQLite (node:sqlite)',
    timestamp: new Date().toISOString(),
  })
})

// --- Public: Create Reservation (Frictionless Diner Booking) ---
app.post('/api/reservations', (req, res) => {
  try {
    const { name, email, phone, guests, date, time, space, notes } = req.body

    if (!name || !email || !phone || !guests || !date || !time) {
      return res.status(400).json({ error: 'Missing required reservation parameters.' })
    }

    const normEmail = String(email).toLowerCase().trim()
    const trimmedName = String(name).trim()
    const trimmedPhone = String(phone).trim()

    // 1. Guest Identity Stitching: Find or create Guest profile
    const getGuest = db.prepare('SELECT * FROM guests WHERE email = ?')
    let guest = getGuest.get(normEmail) as { id: string; name: string; email: string; phone: string } | undefined

    if (!guest) {
      const guestId = crypto.randomUUID()
      db.prepare('INSERT INTO guests (id, name, email, phone) VALUES (?, ?, ?, ?)').run(
        guestId,
        trimmedName,
        normEmail,
        trimmedPhone
      )
      guest = { id: guestId, name: trimmedName, email: normEmail, phone: trimmedPhone }
    } else {
      db.prepare('UPDATE guests SET name = ?, phone = ? WHERE id = ?').run(
        trimmedName,
        trimmedPhone,
        guest.id
      )
      guest.name = trimmedName
      guest.phone = trimmedPhone
    }

    // 2. Generate Unique Luxury Reference Code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const referenceCode = `MHR-2026-${randomSuffix}`
    const reservationId = crypto.randomUUID()

    // 3. Create Reservation Record
    db.prepare(`
      INSERT INTO reservations (id, reference_code, guest_id, party_size, date, time_slot, space_id, special_notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
    `).run(
      reservationId,
      referenceCode,
      guest.id,
      Number(guests) || 2,
      String(date),
      String(time),
      space ? String(space) : 'grand-hall',
      notes ? String(notes) : ''
    )

    const reservation = db.prepare(`
      SELECT r.*, g.name as guest_name, g.email as guest_email, g.phone as guest_phone
      FROM reservations r
      JOIN guests g ON r.guest_id = g.id
      WHERE r.id = ?
    `).get(reservationId) as Record<string, unknown>

    if (reservation) {
      dispatchReservationNotifications({
        reservationId: String(reservation.id),
        referenceCode: String(reservation.reference_code),
        guestName: String(reservation.guest_name),
        guestEmail: String(reservation.guest_email),
        guestPhone: String(reservation.guest_phone),
        partySize: Number(reservation.party_size),
        date: String(reservation.date),
        timeSlot: String(reservation.time_slot),
        spaceName: String(reservation.space_id),
        status: String(reservation.status),
      })
    }

    return res.status(201).json({
      success: true,
      message: 'Reservation request successfully received by Maître D’ desk.',
      referenceCode,
      reservation,
    })
  } catch (error) {
    console.error('Error creating reservation:', error)
    return res.status(500).json({ error: 'Failed to process reservation request.' })
  }
})

// --- Public: Lookup Reservation by Reference Code ---
app.get('/api/reservations/lookup/:reference', (req, res) => {
  try {
    const { reference } = req.params
    const reservation = db.prepare(`
      SELECT r.*, g.name as guest_name, g.email as guest_email, g.phone as guest_phone
      FROM reservations r
      JOIN guests g ON r.guest_id = g.id
      WHERE r.reference_code = ?
    `).get(reference.toUpperCase())

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation reference not found.' })
    }

    return res.json({ success: true, reservation })
  } catch (error) {
    console.error('Error fetching reservation:', error)
    return res.status(500).json({ error: 'Failed to lookup reservation.' })
  }
})

// --- Admin: Login ---
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }

    interface UserRow {
      id: string
      email: string
      name: string
      password_hash: string
      role: string
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim()) as UserRow | undefined

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' })
    }

    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials.' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ error: 'Internal authentication error.' })
  }
})

// --- Admin: Generate Standalone Briefing PDF ---
app.get('/api/admin/briefing/pdf', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.query
    const selectedDate = (date && typeof date === 'string') ? date : 'ALL'

    let query = `
      SELECT r.*, g.name as guest_name, g.phone as guest_phone, g.vip_status
      FROM reservations r
      JOIN guests g ON r.guest_id = g.id
      WHERE 1=1
    `
    const params: unknown[] = []
    if (selectedDate !== 'ALL') {
      query += ' AND r.date = ?'
      params.push(selectedDate)
    }
    query += ' ORDER BY r.date ASC, r.time_slot ASC'

    const reservations = db.prepare(query).all(...params) as BriefingReservation[]
    const staffName = req.user?.name || 'Staff Maître D’'

    const pdfBuffer = await compileBriefingPdf(reservations, selectedDate, staffName)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename="Mehraab-Service-Briefing-${selectedDate}.pdf"`)
    res.setHeader('Content-Length', pdfBuffer.length)
    return res.end(pdfBuffer)
  } catch (error) {
    console.error('Failed to generate briefing PDF:', error)
    return res.status(500).json({ error: 'Failed to compile briefing PDF.' })
  }
})

// --- Admin: List Reservations (Run Sheet) ---
app.get('/api/admin/reservations', requireAuth, (req, res) => {
  try {
    const { status, date } = req.query

    let query = `
      SELECT r.*, g.name as guest_name, g.email as guest_email, g.phone as guest_phone, g.vip_status
      FROM reservations r
      JOIN guests g ON r.guest_id = g.id
      WHERE 1=1
    `
    const params: unknown[] = []

    if (status && status !== 'ALL') {
      query += ' AND r.status = ?'
      params.push(String(status))
    }
    if (date && date !== 'ALL') {
      query += ' AND r.date = ?'
      params.push(String(date))
    }

    query += ' ORDER BY r.created_at DESC'

    const reservations = db.prepare(query).all(...params)

    return res.json({ success: true, count: reservations.length, reservations })
  } catch (error) {
    console.error('Failed to fetch reservations:', error)
    return res.status(500).json({ error: 'Failed to fetch run sheet.' })
  }
})

// --- Admin: Update Status (CONFIRMED / SEATED / CANCELLED) ---
app.patch('/api/admin/reservations/:id/status', requireAuth, (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ['PENDING', 'CONFIRMED', 'SEATED', 'CANCELLED', 'COMPLETED']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid reservation status.' })
    }

    db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run(status, id)

    const updated = db.prepare(`
      SELECT r.*, g.name as guest_name, g.email as guest_email, g.phone as guest_phone
      FROM reservations r
      JOIN guests g ON r.guest_id = g.id
      WHERE r.id = ?
    `).get(id) as Record<string, unknown>

    if (updated) {
      dispatchReservationNotifications({
        reservationId: String(updated.id),
        referenceCode: String(updated.reference_code),
        guestName: String(updated.guest_name),
        guestEmail: String(updated.guest_email),
        guestPhone: String(updated.guest_phone),
        partySize: Number(updated.party_size),
        date: String(updated.date),
        timeSlot: String(updated.time_slot),
        spaceName: String(updated.space_id),
        status: String(updated.status),
      })
    }

    return res.json({ success: true, reservation: updated })
  } catch (error) {
    console.error('Failed to update status:', error)
    return res.status(500).json({ error: 'Failed to update reservation status.' })
  }
})

// --- Admin: List Dispatched Notifications ---
app.get('/api/admin/notifications', requireAuth, (req, res) => {
  try {
    const { reservation_id } = req.query
    let query = 'SELECT * FROM notifications'
    const params: unknown[] = []

    if (reservation_id) {
      query += ' WHERE reservation_id = ?'
      params.push(String(reservation_id))
    }
    query += ' ORDER BY created_at DESC LIMIT 50'

    const logs = db.prepare(query).all(...params)
    return res.json({ success: true, count: logs.length, notifications: logs })
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    return res.status(500).json({ error: 'Failed to fetch notification logs.' })
  }
})

// --- Admin: Gateway Configuration Status ---
app.get('/api/admin/gateway-status', requireAuth, (_req, res) => {
  return res.json({ success: true, gateway: getGatewayConfig() })
})

// --- Admin: Update Gateway Configuration (Live SMS & Email Keys) ---
app.post('/api/admin/gateway-config', requireAuth, (req, res) => {
  try {
    const { fast2smsKey, twilioSid, twilioToken, twilioPhone, resendKey } = req.body

    const envPath = path.resolve(__dirname, '..', '.env')
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : ''

    const updateEnvVar = (key: string, val: string) => {
      process.env[key] = val
      const regex = new RegExp(`^#?\\s*${key}=.*$`, 'm')
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}="${val}"`)
      } else {
        envContent += `\n${key}="${val}"`
      }
    }

    if (fast2smsKey) {
      updateEnvVar('FAST2SMS_API_KEY', String(fast2smsKey).trim())
    }
    if (twilioSid) {
      updateEnvVar('TWILIO_ACCOUNT_SID', String(twilioSid).trim())
    }
    if (twilioToken) {
      updateEnvVar('TWILIO_AUTH_TOKEN', String(twilioToken).trim())
    }
    if (twilioPhone) {
      updateEnvVar('TWILIO_PHONE_NUMBER', String(twilioPhone).trim())
    }
    if (resendKey) {
      updateEnvVar('RESEND_API_KEY', String(resendKey).trim())
    }

    fs.writeFileSync(envPath, envContent, 'utf8')

    console.log('📡 Gateway configuration updated & saved to server/.env')

    return res.json({
      success: true,
      message: 'Gateway credentials saved and live outbound dispatch activated.',
      gateway: getGatewayConfig(),
    })
  } catch (error) {
    console.error('Failed to update gateway config:', error)
    return res.status(500).json({ error: 'Failed to save gateway configuration.' })
  }
})

// --- Admin: Send Test Dispatch to Verify Gateway (Email & SMS) ---
app.post('/api/admin/test-dispatch', requireAuth, async (req, res) => {
  try {
    const { email, phone } = req.body
    if (!email && !phone) {
      return res.status(400).json({ error: 'Target email or phone is required for test dispatch.' })
    }

    const testEmail = email ? String(email).trim() : 'concierge@mehraab.in'
    const testPhone = phone ? String(phone).trim() : '+91 99999 99999'

    const results = await dispatchReservationNotifications({
      reservationId: crypto.randomUUID(),
      referenceCode: 'MHR-LIVE-TEST',
      guestName: 'Sanctuary Connoisseur',
      guestEmail: testEmail,
      guestPhone: testPhone,
      partySize: 2,
      date: new Date().toISOString().split('T')[0],
      timeSlot: '20:00',
      spaceName: 'The Grand Mehraab Hall',
      status: 'CONFIRMED',
    })

    return res.json({
      success: true,
      message: 'Test dispatch triggered for Email & SMS. Inspect dispatch logs below.',
      emailResult: results?.emailResult,
      smsResult: results?.smsResult,
      gateway: getGatewayConfig(),
    })
  } catch (error) {
    console.error('Failed to send test dispatch:', error)
    return res.status(500).json({ error: 'Failed to trigger test dispatch.' })
  }
})

// --- Admin: Send Instant SMS / WhatsApp to Guest ---
app.post('/api/admin/reservations/:id/dispatch-sms', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const reservation = db.prepare(`
      SELECT r.*, g.name as guest_name, g.email as guest_email, g.phone as guest_phone
      FROM reservations r
      JOIN guests g ON r.guest_id = g.id
      WHERE r.id = ?
    `).get(id) as Record<string, unknown>

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found.' })
    }

    const payload: NotificationPayload = {
      reservationId: String(reservation.id),
      referenceCode: String(reservation.reference_code),
      guestName: String(reservation.guest_name),
      guestEmail: String(reservation.guest_email),
      guestPhone: String(reservation.guest_phone),
      partySize: Number(reservation.party_size),
      date: String(reservation.date),
      timeSlot: String(reservation.time_slot),
      spaceName: String(reservation.space_id),
      status: String(reservation.status),
    }

    const smsContent = generateSmsContent(payload)
    const smsResult = await sendLiveSms(payload.guestPhone, smsContent)

    db.prepare(`
      INSERT INTO notifications (id, reservation_id, channel, recipient, subject, content, status)
      VALUES (?, ?, 'SMS', ?, 'Concierge SMS Alert (Manual Trigger)', ?, ?)
    `).run(
      crypto.randomUUID(),
      payload.reservationId,
      payload.guestPhone,
      smsContent,
      smsResult.status
    )

    return res.json({
      success: true,
      result: smsResult,
      smsContent,
      whatsappUrl: generateWhatsAppUrl(payload.guestPhone, smsContent),
    })
  } catch (error) {
    console.error('Failed to dispatch SMS:', error)
    return res.status(500).json({ error: 'Failed to dispatch SMS.' })
  }
})

// --- Admin: Resend / Dispatch Notification ---
app.post('/api/admin/reservations/:id/resend-notification', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const reservation = db.prepare(`
      SELECT r.*, g.name as guest_name, g.email as guest_email, g.phone as guest_phone
      FROM reservations r
      JOIN guests g ON r.guest_id = g.id
      WHERE r.id = ?
    `).get(id) as Record<string, unknown>

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found.' })
    }

    await dispatchReservationNotifications({
      reservationId: String(reservation.id),
      referenceCode: String(reservation.reference_code),
      guestName: String(reservation.guest_name),
      guestEmail: String(reservation.guest_email),
      guestPhone: String(reservation.guest_phone),
      partySize: Number(reservation.party_size),
      date: String(reservation.date),
      timeSlot: String(reservation.time_slot),
      spaceName: String(reservation.space_id),
      status: String(reservation.status),
    })

    return res.json({ success: true, message: 'Notification dispatched to diner.' })
  } catch (error) {
    console.error('Failed to resend notification:', error)
    return res.status(500).json({ error: 'Failed to resend notification.' })
  }
})

// --- Admin: Toggle VIP Guest Status ---
app.patch('/api/admin/guests/:id/vip', requireAuth, (req, res) => {
  try {
    const { id } = req.params
    const { vip_status } = req.body

    db.prepare('UPDATE guests SET vip_status = ? WHERE id = ?').run(vip_status ? 1 : 0, id)
    return res.json({ success: true, vip_status: Boolean(vip_status) })
  } catch (error) {
    console.error('Failed to update VIP status:', error)
    return res.status(500).json({ error: 'Failed to update VIP status.' })
  }
})

// --- Admin: Delete Reservation ---
app.delete('/api/admin/reservations/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params
    db.prepare('DELETE FROM reservations WHERE id = ?').run(id)
    return res.json({ success: true, message: 'Reservation removed.' })
  } catch (error) {
    console.error('Failed to delete reservation:', error)
    return res.status(500).json({ error: 'Failed to delete reservation.' })
  }
})

// --- Admin: Metrics & Overview Stats ---
app.get('/api/admin/stats', requireAuth, (_req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]

    const totalRow = db.prepare('SELECT count(*) as count FROM reservations').get() as { count: number }
    const pendingRow = db.prepare("SELECT count(*) as count FROM reservations WHERE status = 'PENDING'").get() as { count: number }
    const confirmedRow = db.prepare("SELECT count(*) as count FROM reservations WHERE status = 'CONFIRMED'").get() as { count: number }
    const seatedRow = db.prepare("SELECT count(*) as count FROM reservations WHERE status = 'SEATED'").get() as { count: number }
    const seatedTodayRow = db.prepare("SELECT count(*) as count FROM reservations WHERE status = 'SEATED' AND date = ?").get(today) as { count: number }
    const cancelledRow = db.prepare("SELECT count(*) as count FROM reservations WHERE status = 'CANCELLED'").get() as { count: number }
    const completedRow = db.prepare("SELECT count(*) as count FROM reservations WHERE status = 'COMPLETED'").get() as { count: number }

    return res.json({
      success: true,
      stats: {
        total: totalRow.count,
        pending: pendingRow.count,
        confirmed: confirmedRow.count,
        seated: seatedRow.count,
        seatedToday: seatedTodayRow.count,
        cancelled: cancelledRow.count,
        completed: completedRow.count,
      },
    })
  } catch (error) {
    console.error('Failed to get stats:', error)
    return res.status(500).json({ error: 'Failed to load stats.' })
  }
})

// --- Production Static Asset Serving (Unified Full-Stack Deployment) ---
const distPath = path.resolve(__dirname, '..', '..', 'dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'))
    }
    next()
  })
}

// --- Boot Server & Seed ---
async function start() {
  try {
    initDb()
    await seedAdmin()
    app.listen(PORT, () => {
      console.log(`\n⚜️ MEHRAAB Imperial Backend active on http://localhost:${PORT}`)
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
  }
}

start()

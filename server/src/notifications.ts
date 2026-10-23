import crypto from 'node:crypto'
import tls from 'node:tls'
import { db } from './db'

export interface NotificationPayload {
  reservationId: string
  referenceCode: string
  guestName: string
  guestEmail: string
  guestPhone: string
  partySize: number
  date: string
  timeSlot: string
  spaceName: string
  status: string
}

export function generateLuxuryEmailHtml(data: NotificationPayload): string {
  const isConfirmed = data.status === 'CONFIRMED'
  const isSeated = data.status === 'SEATED'

  let headline = 'Reservation Request Received'
  let subheadline = 'Our Maître D’ desk has registered your evening.'

  if (isConfirmed) {
    headline = 'Table Confirmed at the Sacred Arch'
    subheadline = 'We eagerly anticipate welcoming you and your honored guests.'
  } else if (isSeated) {
    headline = 'Welcome to MEHRAAB'
    subheadline = 'May your twilight culinary journey be extraordinary.'
  }

  // Generate 1-click Google Calendar URL
  let googleCalUrl = '#'
  try {
    const [year, month, day] = data.date.split('-').map(Number)
    const [hours, minutes] = data.timeSlot.split(':').map(Number)
    const startDate = new Date(year, (month || 1) - 1, day || 1, hours || 19, minutes || 0, 0)
    const endDate = new Date(startDate.getTime() + 150 * 60 * 1000)
    const pad = (n: number) => String(n).padStart(2, '0')
    const toCompact = (d: Date) =>
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`

    const calParams = new URLSearchParams({
      action: 'TEMPLATE',
      text: `Dinner at MEHRAAB (${data.referenceCode})`,
      dates: `${toCompact(startDate)}/${toCompact(endDate)}`,
      details: `Reservation: ${data.referenceCode}\\nGuest: ${data.guestName}\\nParty: ${data.partySize}\\nPavilion: ${data.spaceName}\\nValet parking at Heritage Gate, Ballard Estate.`,
      location: 'MEHRAAB House, 14 Calicut Road, Ballard Estate, Fort, Mumbai 400001',
    })
    googleCalUrl = `https://calendar.google.com/calendar/render?${calParams.toString()}`
  } catch {
    // fallback
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 0; background-color: #121212; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F0E8DC; }
    .wrapper { max-width: 600px; margin: 30px auto; background-color: #171717; border: 1px solid #B99A68; border-radius: 4px; overflow: hidden; }
    .header { text-align: center; padding: 40px 20px; border-bottom: 1px solid rgba(185, 154, 104, 0.2); background-color: #141414; }
    .brand { font-size: 24px; letter-spacing: 0.25em; text-transform: uppercase; color: #F0E8DC; font-weight: 500; }
    .subtitle { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #B99A68; margin-top: 6px; }
    .content { padding: 40px 30px; }
    .headline { font-size: 22px; color: #F0E8DC; margin-bottom: 10px; font-weight: 300; }
    .subtext { font-size: 13px; color: rgba(240, 232, 220, 0.75); line-height: 1.6; margin-bottom: 30px; }
    .card { background-color: #201a18; border: 1px solid rgba(185, 154, 104, 0.3); border-radius: 4px; padding: 24px; margin-bottom: 30px; }
    .field { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(185, 154, 104, 0.15); font-size: 13px; }
    .label { color: rgba(240, 232, 220, 0.6); text-transform: uppercase; font-size: 11px; letter-spacing: 0.15em; }
    .val { color: #B99A68; font-weight: 500; }
    .ref-badge { display: inline-block; background-color: #121212; border: 1px solid #B99A68; color: #B99A68; padding: 6px 14px; font-family: monospace; letter-spacing: 0.2em; font-size: 14px; margin-top: 8px; }
    .footer { text-align: center; padding: 24px; font-size: 11px; color: rgba(240, 232, 220, 0.5); border-top: 1px solid rgba(185, 154, 104, 0.15); background-color: #121212; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="brand">MEHRAAB</div>
      <div class="subtitle">Contemporary Indian Café & Fine Dining · Mumbai</div>
    </div>
    <div class="content">
      <div class="headline">${headline}</div>
      <div class="subtext">Honored ${data.guestName},<br>${subheadline}</div>

      <div class="card">
        <div style="text-align: center; margin-bottom: 20px;">
          <div class="label">Luxury Booking Reference</div>
          <div class="ref-badge">${data.referenceCode}</div>
        </div>

        <div class="field">
          <span class="label">Service Date</span>
          <span class="val">${data.date}</span>
        </div>
        <div class="field">
          <span class="label">Seating Time</span>
          <span class="val">${data.timeSlot}</span>
        </div>
        <div class="field">
          <span class="label">Party Allocation</span>
          <span class="val">${data.partySize} Honored Guest(s)</span>
        </div>
        <div class="field" style="border-bottom: none;">
          <span class="label">Pavilion</span>
          <span class="val">${data.spaceName}</span>
        </div>
      </div>

      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${googleCalUrl}" target="_blank" style="display: inline-block; background-color: #B99A68; color: #171717; text-decoration: none; padding: 12px 28px; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600; border-radius: 2px;">
          📅 Add to Google Calendar
        </a>
      </div>

      <div style="font-size: 12px; color: rgba(240, 232, 220, 0.7); line-height: 1.6;">
        <strong style="color: #F0E8DC;">Arrival Protocol:</strong> Complimentary private valet attendants await you at Heritage Gate, 14 Calicut Road, Ballard Estate. We respectfully hold your table for 20 minutes past your scheduled reservation time.
      </div>
    </div>
    <div class="footer">
      MEHRAAB Fine Dining Sanctuary · Ballard Estate, Fort, Mumbai 400001<br>
      Direct Concierge: +91 (022) 4920 1800 · concierge@mehraab.in
    </div>
  </div>
</body>
</html>
  `.trim()
}

export function generateSmsContent(data: NotificationPayload): string {
  return `[MEHRAAB] Honored ${data.guestName}, your reservation (${data.referenceCode}) for ${data.partySize} guests on ${data.date} at ${data.timeSlot} (${data.spaceName}) is now ${data.status}. Valet parking at Ballard Estate Heritage Gate. Concierge: +912249201800.`
}

export function generateWhatsAppUrl(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, '')
  // If 10 digits (India domestic), prefix 91
  const cleanPhone = digits.length === 10 ? `91${digits}` : digits
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
}

export function generateNativeSmsUrl(phone: string, text: string): string {
  return `sms:${phone.replace(/[^\d+]/g, '')}?body=${encodeURIComponent(text)}`
}

/** Check which external delivery providers are configured in environment variables */
export function getGatewayConfig() {
  const hasResend = Boolean(process.env.RESEND_API_KEY)
  const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  const hasTwilio = Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER)
  const hasFast2Sms = Boolean(process.env.FAST2SMS_API_KEY)
  const hasCustomWebhook = Boolean(process.env.SMS_WEBHOOK_URL)

  let emailProvider = 'NONE'
  if (hasResend) emailProvider = 'RESEND'
  else if (hasSmtp) emailProvider = `SMTP (${process.env.SMTP_HOST})`

  let smsProvider = 'SIMULATED / WHATSAPP READY'
  if (hasFast2Sms) smsProvider = 'FAST2SMS (India Direct)'
  else if (hasTwilio) smsProvider = 'TWILIO (Global SMS)'
  else if (hasCustomWebhook) smsProvider = 'CUSTOM WEBHOOK'

  return {
    email: {
      configured: hasResend || hasSmtp,
      provider: emailProvider,
      details: hasResend
        ? 'Resend API active (RESEND_API_KEY)'
        : hasSmtp
        ? `Direct SSL SMTP active via ${process.env.SMTP_HOST}`
        : 'Simulation Mode: Add RESEND_API_KEY or SMTP_HOST/USER/PASS to server/.env for live inbox delivery',
    },
    sms: {
      configured: hasTwilio || hasFast2Sms || hasCustomWebhook,
      provider: smsProvider,
      details: hasFast2Sms
        ? 'Fast2SMS Gateway active (FAST2SMS_API_KEY)'
        : hasTwilio
        ? 'Twilio SMS active (TWILIO_ACCOUNT_SID)'
        : hasCustomWebhook
        ? 'Custom SMS Webhook active (SMS_WEBHOOK_URL)'
        : 'Simulation & 1-Click WhatsApp active: Add FAST2SMS_API_KEY or TWILIO credentials to server/.env for direct outbound phone delivery.',
    },
  }
}

/** Native SSL SMTP client (Zero external packages needed, works with Gmail, Brevo, Outlook, etc.) */
function sendNativeSmtp({
  host,
  port = 465,
  user,
  pass,
  from,
  to,
  subject,
  html,
}: {
  host: string
  port?: number
  user: string
  pass: string
  from: string
  to: string
  subject: string
  html: string
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return new Promise((resolve) => {
    let resolved = false
    const safeResolve = (val: { success: boolean; messageId?: string; error?: string }) => {
      if (!resolved) {
        resolved = true
        socket.destroy()
        resolve(val)
      }
    }

    const socket = tls.connect(port, host, { rejectUnauthorized: false }, () => {
      // SSL Handshake complete
    })

    let step = 0
    socket.setEncoding('utf8')

    socket.on('data', (chunk: string) => {
      const code = parseInt(chunk.substring(0, 3), 10)
      if (code >= 400) {
        return safeResolve({ success: false, error: `SMTP response error: ${chunk.trim()}` })
      }

      if (step === 0 && code === 220) {
        step++
        socket.write(`EHLO localhost\r\n`)
      } else if (step === 1 && code === 250) {
        step++
        socket.write(`AUTH LOGIN\r\n`)
      } else if (step === 2 && code === 334) {
        step++
        socket.write(`${Buffer.from(user).toString('base64')}\r\n`)
      } else if (step === 3 && code === 334) {
        step++
        socket.write(`${Buffer.from(pass).toString('base64')}\r\n`)
      } else if (step === 4 && code === 235) {
        step++
        socket.write(`MAIL FROM:<${from}>\r\n`)
      } else if (step === 5 && code === 250) {
        step++
        socket.write(`RCPT TO:<${to}>\r\n`)
      } else if (step === 6 && code === 250) {
        step++
        socket.write(`DATA\r\n`)
      } else if (step === 7 && code === 354) {
        step++
        const emailData = [
          `From: "MEHRAAB Fine Dining" <${from}>`,
          `To: ${to}`,
          `Subject: ${subject}`,
          `MIME-Version: 1.0`,
          `Content-Type: text/html; charset=UTF-8`,
          ``,
          html,
          `.`,
          ``,
        ].join('\r\n')
        socket.write(emailData)
      } else if (step === 8 && code === 250) {
        step++
        socket.write(`QUIT\r\n`)
        safeResolve({ success: true, messageId: chunk.trim() })
      }
    })

    socket.on('error', (err) => {
      safeResolve({ success: false, error: err.message })
    })

    socket.setTimeout(12000, () => {
      safeResolve({ success: false, error: 'SMTP connection timed out after 12s' })
    })
  })
}

/** Outbound live email delivery attempt */
async function sendLiveEmail(to: string, subject: string, html: string): Promise<{ success: boolean; status: string; note: string }> {
  // Option 1: Resend REST API
  if (process.env.RESEND_API_KEY) {
    try {
      const fromAddr = process.env.RESEND_FROM || 'MEHRAAB <onboarding@resend.dev>'
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddr,
          to: [to],
          subject,
          html,
        }),
      })

      const json = await res.json() as { id?: string; message?: string }
      if (res.ok) {
        return { success: true, status: 'DELIVERED_OUTBOUND', note: `Sent via Resend (ID: ${json.id})` }
      }
      return { success: false, status: 'FAILED_OUTBOUND', note: `Resend error: ${json.message || 'Unknown'}` }
    } catch (err: unknown) {
      return { success: false, status: 'FAILED_OUTBOUND', note: err instanceof Error ? err.message : 'Resend request failed' }
    }
  }

  // Option 2: Native SSL SMTP
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const result = await sendNativeSmtp({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        html,
      })

      if (result.success) {
        return { success: true, status: 'DELIVERED_OUTBOUND', note: `Sent via SMTP ${process.env.SMTP_HOST}` }
      }
      return { success: false, status: 'FAILED_OUTBOUND', note: result.error || 'SMTP failed' }
    } catch (err: unknown) {
      return { success: false, status: 'FAILED_OUTBOUND', note: err instanceof Error ? err.message : 'SMTP failed' }
    }
  }

  // Option 3: Simulation Mode (No external gateway configured)
  return {
    success: false,
    status: 'SIMULATED_LOCAL',
    note: 'Simulated locally. Configure RESEND_API_KEY or SMTP credentials in server/.env for live delivery.',
  }
}

/** Outbound live SMS delivery attempt (Multi-Gateway Engine) */
export async function sendLiveSms(to: string, message: string): Promise<{ success: boolean; status: string; note: string }> {
  // Option 1: Fast2SMS (Direct Indian Gateway)
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const digits = to.replace(/\D/g, '')
      const phone = digits.length > 10 ? digits.slice(-10) : digits
      const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'q',
          message,
          language: 'english',
          flash: 0,
          numbers: phone,
        }),
      })

      const json = await res.json() as { return?: boolean; message?: string[] | string }
      if (res.ok && json.return) {
        return { success: true, status: 'DELIVERED_OUTBOUND', note: 'Sent via Fast2SMS Gateway' }
      }
      const errMsg = Array.isArray(json.message) ? json.message.join(', ') : json.message || 'Fast2SMS dispatch failed'
      return { success: false, status: 'FAILED_OUTBOUND', note: `Fast2SMS error: ${errMsg}` }
    } catch (err: unknown) {
      return { success: false, status: 'FAILED_OUTBOUND', note: err instanceof Error ? err.message : 'Fast2SMS failed' }
    }
  }

  // Option 2: Twilio Global SMS Gateway
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')
      const params = new URLSearchParams({
        From: process.env.TWILIO_PHONE_NUMBER,
        To: to,
        Body: message,
      })

      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        }
      )

      const json = await res.json() as { sid?: string; message?: string }
      if (res.ok) {
        return { success: true, status: 'DELIVERED_OUTBOUND', note: `Sent via Twilio (SID: ${json.sid})` }
      }
      return { success: false, status: 'FAILED_OUTBOUND', note: `Twilio error: ${json.message || 'Unknown'}` }
    } catch (err: unknown) {
      return { success: false, status: 'FAILED_OUTBOUND', note: err instanceof Error ? err.message : 'Twilio failed' }
    }
  }

  // Option 3: Custom SMS Webhook
  if (process.env.SMS_WEBHOOK_URL) {
    try {
      const res = await fetch(process.env.SMS_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.SMS_WEBHOOK_KEY ? { Authorization: `Bearer ${process.env.SMS_WEBHOOK_KEY}` } : {}),
        },
        body: JSON.stringify({ to, message, sender: 'MEHRAAB' }),
      })
      if (res.ok) {
        return { success: true, status: 'DELIVERED_OUTBOUND', note: 'Sent via Custom SMS Webhook' }
      }
      return { success: false, status: 'FAILED_OUTBOUND', note: `Webhook status ${res.status}` }
    } catch (err: unknown) {
      return { success: false, status: 'FAILED_OUTBOUND', note: err instanceof Error ? err.message : 'Webhook failed' }
    }
  }

  return {
    success: false,
    status: 'SIMULATED_LOCAL',
    note: 'Simulated locally. Configure FAST2SMS_API_KEY or TWILIO credentials in server/.env for live mobile delivery.',
  }
}

/** Dispatches both Email & SMS notifications (either live outbound or transparent simulation) */
export async function dispatchReservationNotifications(data: NotificationPayload) {
  try {
    const emailSubject = `MEHRAAB · Reservation ${data.status}: ${data.referenceCode}`
    const emailHtml = generateLuxuryEmailHtml(data)
    const smsContent = generateSmsContent(data)

    // Attempt live deliveries
    const emailResult = await sendLiveEmail(data.guestEmail, emailSubject, emailHtml)
    const smsResult = await sendLiveSms(data.guestPhone, smsContent)

    // 1. Log Email Dispatch with accurate delivery status
    const loggedEmailContent = emailResult.status === 'FAILED_OUTBOUND'
      ? `<!-- Error: ${emailResult.note} -->\n${emailHtml}`
      : emailHtml

    db.prepare(`
      INSERT INTO notifications (id, reservation_id, channel, recipient, subject, content, status)
      VALUES (?, ?, 'EMAIL', ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      data.reservationId,
      data.guestEmail,
      emailResult.status === 'FAILED_OUTBOUND' ? `${emailSubject} (${emailResult.note})` : emailSubject,
      loggedEmailContent,
      emailResult.status
    )

    // 2. Log SMS Dispatch with accurate delivery status
    const loggedSmsContent = smsResult.status === 'FAILED_OUTBOUND'
      ? `⚠️ Gateway Alert: ${smsResult.note}\n\n${smsContent}`
      : smsContent

    db.prepare(`
      INSERT INTO notifications (id, reservation_id, channel, recipient, subject, content, status)
      VALUES (?, ?, 'SMS', ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      data.reservationId,
      data.guestPhone,
      smsResult.status === 'FAILED_OUTBOUND' ? `Concierge SMS Alert (Failed: ${smsResult.note})` : 'Concierge SMS Alert',
      loggedSmsContent,
      smsResult.status
    )

    console.log(
      `✉️ Notifications logged for ${data.referenceCode} [Email: ${emailResult.status} - ${emailResult.note}] [SMS: ${smsResult.status} - ${smsResult.note}]`
    )

    return { emailResult, smsResult }
  } catch (error) {
    console.error('Failed to dispatch notifications:', error)
    return {
      emailResult: { success: false, status: 'FAILED_OUTBOUND', note: String(error) },
      smsResult: { success: false, status: 'FAILED_OUTBOUND', note: String(error) },
    }
  }
}

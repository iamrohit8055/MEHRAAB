export interface CalendarEventDetails {
  referenceCode: string
  guestName: string
  partySize: number
  date: string // YYYY-MM-DD
  timeSlot: string // HH:mm (e.g. "20:00" or "12:30")
  spaceName: string
  specialNotes?: string | null
}

const RESTAURANT_LOCATION =
  'MEHRAAB House, 14 Calicut Road, Ballard Estate, Fort, Mumbai 400001 (18.9388° N, 72.8354° E)'

/** Format YYYY-MM-DD and HH:mm into compact iCal / Google date strings */
function formatDateTime(dateStr: string, timeStr: string, durationMinutes = 150): { start: string; end: string } {
  const [year, month, day] = dateStr.split('-').map(Number)
  const [hours, minutes] = timeStr.split(':').map(Number)

  const startDate = new Date(year, (month || 1) - 1, day || 1, hours || 19, minutes || 0, 0)
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000)

  const pad = (n: number) => String(n).padStart(2, '0')

  const toCompactString = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`

  return {
    start: toCompactString(startDate),
    end: toCompactString(endDate),
  }
}

/** Builds rich description for calendar entry */
function buildDescription(details: CalendarEventDetails): string {
  return [
    `MEHRAAB — Contemporary Indian Café & Fine Dining`,
    `Reference: ${details.referenceCode}`,
    `Honored Guest: ${details.guestName}`,
    `Party Size: ${details.partySize} Guest(s)`,
    `Pavilion: ${details.spaceName}`,
    details.specialNotes ? `Special Requests: ${details.specialNotes}` : '',
    ``,
    `--- ARRIVAL PROTOCOL ---`,
    `• Valet: Complimentary private valet attendants await you at Heritage Gate, 14 Calicut Road, Ballard Estate.`,
    `• Attire: Contemporary elegant or celebratory attire. Athletic wear restricted.`,
    `• Table Hold: Tables held for 20 minutes past reservation time.`,
    `• Concierge Direct: +91 (022) 4920 1800 | concierge@mehraab.in`,
  ]
    .filter(Boolean)
    .join('\n')
}

/** Generates 1-click Google Calendar Web URL */
export function generateGoogleCalendarUrl(details: CalendarEventDetails): string {
  const { start, end } = formatDateTime(details.date, details.timeSlot)
  const title = `Dinner at MEHRAAB (${details.referenceCode})`
  const description = buildDescription(details)

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${start}/${end}`,
    details: description,
    location: RESTAURANT_LOCATION,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/** Generates RFC 5545 compliant .ics file content with 2-hour departure reminder alarm */
export function generateIcsContent(details: CalendarEventDetails): string {
  const { start, end } = formatDateTime(details.date, details.timeSlot)
  const title = `Dinner at MEHRAAB (${details.referenceCode})`
  const description = buildDescription(details)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')

  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const dtstamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`
  const uid = `${details.referenceCode}-${Date.now()}@mehraab.in`

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MEHRAAB Hospitality Group//Dining Pass//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${RESTAURANT_LOCATION.replace(/,/g, '\\,')}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    // 2-Hour Pre-Departure Reminder Alarm
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: Your table at MEHRAAB (${details.referenceCode}) awaits in 2 hours at Ballard Estate. Valet at Heritage Gate.`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

/** Downloads an Apple / Outlook .ics calendar invitation directly to diner's device */
export function downloadIcsFile(details: CalendarEventDetails) {
  const content = generateIcsContent(details)
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `MEHRAAB-Reservation-${details.referenceCode}.ics`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

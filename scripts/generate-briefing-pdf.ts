import { db } from '../server/src/db'
import { compileBriefingPdf, type BriefingReservation } from '../server/src/briefing-pdf'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '..', 'public')

async function run() {
  console.log('Querying reservations from database...')
  const reservations = db.prepare(`
    SELECT r.*, g.name as guest_name, g.phone as guest_phone, g.vip_status
    FROM reservations r
    JOIN guests g ON r.guest_id = g.id
    ORDER BY r.date ASC, r.time_slot ASC
  `).all() as BriefingReservation[]

  console.log(`Found ${reservations.length} reservations. Generating standalone briefing PDF...`)

  const buffer = await compileBriefingPdf(reservations, 'ALL', 'Staff Maître D’')
  const destPdf = path.join(publicDir, 'mehraab-daily-service-briefing.pdf')
  fs.writeFileSync(destPdf, buffer)

  console.log(`✅ Success! Generated ${destPdf} (${buffer.length} bytes)`)
}

run().catch((err) => {
  console.error('Failed to generate briefing PDF:', err)
  process.exit(1)
})

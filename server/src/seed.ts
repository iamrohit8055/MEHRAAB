import { db } from './db'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'

export async function seedAdmin() {
  const select = db.prepare('SELECT * FROM users WHERE email = ?')
  const existing = select.get('admin@mehraab.in')

  if (!existing) {
    const passwordHash = await bcrypt.hash('Mehraab2026!', 10)
    const insert = db.prepare(`
      INSERT INTO users (id, email, name, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `)
    insert.run(
      crypto.randomUUID(),
      'admin@mehraab.in',
      'Maitre D’ Samarpan',
      passwordHash,
      'ADMIN'
    )
    console.log('✅ Admin account seeded: admin@mehraab.in / Mehraab2026!')
  } else {
    console.log('ℹ️ Admin account already exists: admin@mehraab.in')
  }

  // Seed sample reservations if database has very few records
  const resCount = db.prepare('SELECT count(*) as count FROM reservations').get() as { count: number }
  if (resCount.count < 3) {
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

    const seedReservations = [
      {
        name: 'Vikramaditya Singhania',
        email: 'vikram.singhania@heritage.in',
        phone: '+91 98201 44512',
        vip: 1,
        party: 4,
        date: today,
        time: '20:00',
        space: 'grand-hall',
        status: 'CONFIRMED',
        code: 'MHR-2026-8821',
        notes: '20th Wedding Anniversary. Prefers corner alcove banquette and 2019 Domaine de Chevalier.',
      },
      {
        name: 'Dr. Ananya Sen',
        email: 'dr.ananya.sen@bombayhospital.org',
        phone: '+91 99302 78104',
        vip: 1,
        party: 2,
        date: today,
        time: '18:30',
        space: 'parda',
        status: 'SEATED',
        code: 'MHR-2026-4519',
        notes: 'Strict vegetarian. Reserved Parda Salon tasting sequence with non-alcoholic botanical pairings.',
      },
      {
        name: 'Aarav & Maya Kapoor',
        email: 'aarav.kapoor@studioarch.com',
        phone: '+91 98190 22391',
        vip: 0,
        party: 6,
        date: tomorrow,
        time: '20:00',
        space: 'courtyard',
        status: 'PENDING',
        code: 'MHR-2026-6102',
        notes: 'Requested reflection pool table. Celebration for architecture monograph launch.',
      },
      {
        name: 'Rhea Pillai',
        email: 'rhea.pillai@vogue.in',
        phone: '+91 97690 11983',
        vip: 0,
        party: 2,
        date: tomorrow,
        time: '12:30',
        space: 'cafe',
        status: 'CONFIRMED',
        code: 'MHR-2026-3390',
        notes: 'Verandah lunch. Editorial review for Vogue Living Autumn issue.',
      },
    ]

    for (const item of seedReservations) {
      const guestId = crypto.randomUUID()
      db.prepare(`
        INSERT INTO guests (id, name, email, phone, vip_status)
        VALUES (?, ?, ?, ?, ?)
      `).run(guestId, item.name, item.email, item.phone, item.vip)

      db.prepare(`
        INSERT INTO reservations (id, reference_code, guest_id, party_size, date, time_slot, space_id, special_notes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        crypto.randomUUID(),
        item.code,
        guestId,
        item.party,
        item.date,
        item.time,
        item.space,
        item.notes,
        item.status
      )
    }

    console.log(`✅ Seeded ${seedReservations.length} initial luxury reservations for run sheet display.`)
  }
}

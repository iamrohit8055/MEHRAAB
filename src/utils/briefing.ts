import type { ReservationRow } from '../components/admin/AdminRunSheet'

export interface DietaryAlert {
  type: 'ALLERGY' | 'DIETARY' | 'CELEBRATION' | 'VIP_REQUEST'
  label: string
  severity: 'CRITICAL' | 'WARNING' | 'INFO'
}

export interface ServiceBriefingItem {
  reservation: ReservationRow
  table: string
  cleanNotes: string
  alerts: DietaryAlert[]
  shift: 'LUNCH' | 'TWILIGHT' | 'MIDNIGHT'
}

export function parseDietaryAlerts(notes: string | null): DietaryAlert[] {
  if (!notes) return []
  const alerts: DietaryAlert[] = []
  const lower = notes.toLowerCase()

  // Severe / Life-Threatening Allergies
  if (
    lower.includes('shellfish') ||
    lower.includes('crustacean') ||
    lower.includes('prawn') ||
    lower.includes('lobster') ||
    lower.includes('crab')
  ) {
    alerts.push({
      type: 'ALLERGY',
      label: '⚠️ SHELLFISH / CRUSTACEAN ALLERGY',
      severity: 'CRITICAL',
    })
  }

  if (
    lower.includes('peanut') ||
    lower.includes('nut') ||
    lower.includes('tree nut') ||
    lower.includes('almond') ||
    lower.includes('cashew') ||
    lower.includes('walnut')
  ) {
    alerts.push({
      type: 'ALLERGY',
      label: '⚠️ NUT ALLERGY',
      severity: 'CRITICAL',
    })
  }

  if (lower.includes('celiac') || lower.includes('coeliac')) {
    alerts.push({
      type: 'ALLERGY',
      label: '⚠️ CELIAC DISEASE (Zero Gluten Cross-Contact)',
      severity: 'CRITICAL',
    })
  } else if (lower.includes('gluten') || lower.includes('wheat-free') || lower.includes('no wheat')) {
    alerts.push({
      type: 'ALLERGY',
      label: 'GLUTEN INTOLERANCE',
      severity: 'WARNING',
    })
  }

  if (lower.includes('dairy') || lower.includes('lactose') || lower.includes('milk')) {
    alerts.push({
      type: 'ALLERGY',
      label: 'DAIRY / LACTOSE FREE',
      severity: 'WARNING',
    })
  }

  if (lower.includes('egg')) {
    alerts.push({
      type: 'ALLERGY',
      label: 'EGG ALLERGY',
      severity: 'WARNING',
    })
  }

  // Dietary Protocols
  if (lower.includes('jain')) {
    alerts.push({
      type: 'DIETARY',
      label: 'STRICT JAIN (No Root Veg / Onion / Garlic)',
      severity: 'WARNING',
    })
  }

  if (lower.includes('vegan')) {
    alerts.push({
      type: 'DIETARY',
      label: 'VEGAN (100% Plant-Based)',
      severity: 'WARNING',
    })
  } else if (lower.includes('vegetarian') || lower.includes('veg only')) {
    alerts.push({
      type: 'DIETARY',
      label: 'STRICT VEGETARIAN',
      severity: 'INFO',
    })
  }

  if (lower.includes('halal')) {
    alerts.push({
      type: 'DIETARY',
      label: 'HALAL CERTIFIED MEAT ONLY',
      severity: 'INFO',
    })
  }

  if (
    lower.includes('non-alcoholic') ||
    lower.includes('no alcohol') ||
    lower.includes('juice') ||
    lower.includes('botanical pairing')
  ) {
    alerts.push({
      type: 'DIETARY',
      label: 'ZERO ALCOHOL / BOTANICAL INFUSIONS ONLY',
      severity: 'INFO',
    })
  }

  // Celebrations & Wine Requests
  if (lower.includes('anniversary')) {
    alerts.push({
      type: 'CELEBRATION',
      label: 'WEDDING ANNIVERSARY CELEBRATION',
      severity: 'INFO',
    })
  }

  if (lower.includes('birthday')) {
    alerts.push({
      type: 'CELEBRATION',
      label: 'BIRTHDAY COMMEMORATION',
      severity: 'INFO',
    })
  }

  if (lower.includes('proposal') || lower.includes('engagement')) {
    alerts.push({
      type: 'CELEBRATION',
      label: 'ENGAGEMENT / PROPOSAL (Stealth Protocol)',
      severity: 'INFO',
    })
  }

  if (
    lower.includes('sommelier') ||
    lower.includes('wine') ||
    lower.includes('vintage') ||
    lower.includes('chevalier') ||
    lower.includes('domaine') ||
    lower.includes('cellar')
  ) {
    alerts.push({
      type: 'VIP_REQUEST',
      label: 'SOMMELIER CELLAR DIRECTIVE',
      severity: 'INFO',
    })
  }

  return alerts
}

export function extractTableAssignment(
  spaceId: string,
  notes: string | null
): { table: string; cleanNotes: string } {
  const defaultTable = getDefaultTable(spaceId)
  if (!notes) {
    return { table: defaultTable, cleanNotes: '' }
  }

  const match = notes.match(/\[Table:\s*([^\]]+)\]/i)
  if (match) {
    const rawTable = match[1].trim()
    const cleanNotes = notes.replace(match[0], '').trim()
    return { table: rawTable, cleanNotes }
  }

  return { table: defaultTable, cleanNotes: notes }
}

function getDefaultTable(spaceId: string): string {
  switch (spaceId) {
    case 'parda':
      return 'Salon Arch (VIP)'
    case 'grand-hall':
      return 'Grand Hall'
    case 'courtyard':
      return 'Courtyard of Embers'
    case 'cafe':
      return 'Verandah Colonnade'
    default:
      return 'Sanctuary Table'
  }
}

export function getServiceShift(timeSlot: string): 'LUNCH' | 'TWILIGHT' | 'MIDNIGHT' {
  const parts = timeSlot.split(':')
  const hour = parseInt(parts[0], 10)
  if (isNaN(hour)) return 'TWILIGHT'

  if (hour < 16) return 'LUNCH'
  if (hour < 21) return 'TWILIGHT'
  return 'MIDNIGHT'
}

export function generatePlaintextBriefing(
  dateLabel: string,
  items: ServiceBriefingItem[],
  stats: { totalCovers: number; totalTables: number; vipCount: number; allergyCount: number }
): string {
  const lines: string[] = []

  lines.push(`================================================================`)
  lines.push(`MEHRAAB · LUXURY DINING SANCTUARY · BALLARD ESTATE`)
  lines.push(`DAILY SERVICE RUN SHEET & KITCHEN BRIEFING`)
  lines.push(`SERVICE DATE: ${dateLabel}`)
  lines.push(`GENERATED FOR: Kitchen Brigade, Front of House Captains & Maître D'`)
  lines.push(`================================================================\n`)

  lines.push(`EXECUTIVE SHIFT OVERVIEW:`)
  lines.push(`• Total Covers: ${stats.totalCovers} guests across ${stats.totalTables} parties`)
  lines.push(`• VIP Diners: ${stats.vipCount}`)
  lines.push(`• Active Allergy / Dietary Flags: ${stats.allergyCount}\n`)

  const allergyItems = items.filter((i) => i.alerts.length > 0)
  if (allergyItems.length > 0) {
    lines.push(`⚠️ KITCHEN ALLERGY & DIETARY ALERT MATRIX:`)
    for (const item of allergyItems) {
      const alertLabels = item.alerts.map((a) => a.label).join(' | ')
      lines.push(
        `  [Table: ${item.table}] ${item.reservation.guest_name} (${item.reservation.party_size}p) - ${alertLabels}`
      )
    }
    lines.push(``)
  }

  lines.push(`CHRONOLOGICAL SEATING SCHEDULE:`)
  lines.push(
    `TIME   | TABLE / SPACE             | GUEST (COVERS)         | VIP | STATUS    | NOTES`
  )
  lines.push(
    `-------|---------------------------|------------------------|-----|-----------|----------------------------------`
  )

  for (const item of items) {
    const time = item.reservation.time_slot.padEnd(6)
    const table = item.table.slice(0, 25).padEnd(25)
    const guest = `${item.reservation.guest_name} (${item.reservation.party_size})`.slice(0, 22).padEnd(22)
    const vip = item.reservation.vip_status ? '👑YES' : ' -- '
    const status = item.reservation.status.padEnd(9)
    const notes = item.cleanNotes ? item.cleanNotes.replace(/\n/g, ' ') : '--'

    lines.push(`${time} | ${table} | ${guest} | ${vip} | ${status} | ${notes}`)
  }

  lines.push(`\nSERVICE PROTOCOL:`)
  lines.push(`1. Parda Salon VIPs to receive iced jasmine mist towels prior to Solstice Course I.`)
  lines.push(`2. Allergen tables must be tagged with red service cloches from the hot pass.`)
  lines.push(`3. Verify all vintage bottle decanting 20 minutes prior to guest seating.\n`)
  lines.push(`SIGN-OFF:`)
  lines.push(`Maître D': __________________  Executive Chef: __________________`)

  return lines.join('\n')
}

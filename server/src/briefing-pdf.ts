import cp from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'
import { parseDietaryAlerts, extractTableAssignment, type DietaryAlert } from '../../src/utils/briefing'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const SPACE_LABELS: Record<string, string> = {
  'grand-hall': 'Grand Mehraab Hall',
  courtyard: 'Courtyard of Embers',
  cafe: 'The Roastery Verandah',
  parda: 'The Parda Salon (VIP)',
}

export interface BriefingReservation {
  id: string
  reference_code: string
  guest_name: string
  guest_phone: string
  party_size: number
  date: string
  time_slot: string
  space_id: string
  status: string
  special_notes: string | null
  vip_status?: number
}

export function generateBriefingHtml(
  reservations: BriefingReservation[],
  selectedDate: string,
  staffName: string = 'Staff Maître D’'
): string {
  // Sort chronologically
  const sorted = [...reservations].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    return a.time_slot.localeCompare(b.time_slot)
  })

  const totalCovers = sorted.reduce((sum, r) => sum + r.party_size, 0)
  const totalTables = sorted.length
  const vipCount = sorted.filter((r) => Boolean(r.vip_status)).length

  // Parse dietary items
  const allergyItems: {
    res: BriefingReservation
    table: string
    cleanNotes: string
    alerts: DietaryAlert[]
  }[] = []

  for (const r of sorted) {
    const alerts = parseDietaryAlerts(r.special_notes)
    const { table, cleanNotes } = extractTableAssignment(r.space_id, r.special_notes)
    if (alerts.length > 0) {
      allergyItems.push({ res: r, table, cleanNotes, alerts })
    }
  }

  const allergyCount = allergyItems.reduce((sum, item) => sum + item.alerts.length, 0)

  // Pavilion breakdown
  const pavilions: Record<string, number> = {}
  for (const r of sorted) {
    const sp = r.space_id
    pavilions[sp] = (pavilions[sp] || 0) + r.party_size
  }

  const nowString = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MEHRAAB — Service Briefing Dossier · ${selectedDate}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Manrope', -apple-system, sans-serif;
      color: #111827;
      background-color: #ffffff;
      font-size: 10px;
      line-height: 1.35;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header {
      border-bottom: 2px solid #111827;
      padding-bottom: 10px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 24px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      font-weight: 700;
      color: #111827;
      line-height: 1;
    }
    .brand-sub {
      font-size: 8px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: #6b7280;
      font-family: 'Manrope', sans-serif;
      margin-top: 3px;
    }
    .doc-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 17px;
      font-weight: 700;
      margin-top: 4px;
      color: #111827;
      letter-spacing: 0.05em;
    }
    .meta-box {
      text-align: right;
      font-family: monospace;
      font-size: 9px;
      color: #374151;
      line-height: 1.4;
    }
    .meta-date {
      font-size: 11px;
      font-weight: 700;
      color: #111827;
      text-transform: uppercase;
    }

    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 12px;
    }
    .kpi-card {
      border: 1px solid #d1d5db;
      background-color: #f9fafb;
      padding: 6px 10px;
      border-radius: 2px;
    }
    .kpi-card.alert {
      border-color: #fca5a5;
      background-color: #fef2f2;
    }
    .kpi-label {
      font-size: 7.5px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #6b7280;
      font-weight: 700;
      display: block;
    }
    .kpi-card.alert .kpi-label {
      color: #b91c1c;
    }
    .kpi-val {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      line-height: 1.1;
      margin-top: 1px;
    }
    .kpi-card.alert .kpi-val {
      color: #dc2626;
    }
    .kpi-sub {
      font-size: 7.5px;
      color: #6b7280;
    }

    /* Dietary Matrix */
    .dietary-section {
      border: 1.5px solid #dc2626;
      background-color: #fef2f2;
      border-radius: 2px;
      padding: 8px 10px;
      margin-bottom: 12px;
      break-inside: avoid;
    }
    .dietary-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #fecaca;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    .dietary-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 12px;
      font-weight: 700;
      color: #991b1b;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .dietary-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
    }
    .dietary-item {
      background-color: #ffffff;
      border: 1px solid #fca5a5;
      border-radius: 2px;
      padding: 5px 8px;
    }
    .badge {
      display: inline-block;
      font-size: 7px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 1.5px 5px;
      border-radius: 2px;
      margin-right: 3px;
      margin-bottom: 2px;
    }
    .badge-critical {
      background-color: #dc2626;
      color: #ffffff;
    }
    .badge-warning {
      background-color: #fef3c7;
      color: #92400e;
      border: 1px solid #fcd34d;
    }
    .badge-info {
      background-color: #e0f2fe;
      color: #0369a1;
      border: 1px solid #bae6fd;
    }

    /* Table */
    .section-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 6px;
      color: #111827;
      display: flex;
      justify-content: space-between;
    }
    table.roster {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 9px;
    }
    table.roster th {
      background-color: #f3f4f6;
      color: #111827;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 7.5px;
      letter-spacing: 0.08em;
      padding: 5px 6px;
      border: 1px solid #d1d5db;
      text-align: left;
    }
    table.roster td {
      padding: 5px 6px;
      border: 1px solid #e5e7eb;
      vertical-align: top;
    }
    table.roster tr:nth-child(even) td {
      background-color: #fafafa;
    }
    table.roster tr {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .chk-box {
      width: 12px;
      height: 12px;
      border: 1.5px solid #374151;
      border-radius: 1px;
      background: #ffffff;
      margin: 0 auto;
    }

    /* Sommelier Section */
    .sommelier-box {
      border: 1px solid #d1d5db;
      background-color: #f9fafb;
      padding: 6px 10px;
      margin-bottom: 12px;
      border-radius: 2px;
      break-inside: avoid;
    }
    .sommelier-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 3px;
      color: #111827;
    }
    .sommelier-box ul {
      padding-left: 14px;
      font-size: 8px;
      color: #374151;
    }

    /* Footer & Signoffs */
    .footer-section {
      border-top: 1.5px solid #111827;
      padding-top: 6px;
      margin-top: 8px;
      break-inside: avoid;
    }
    .directives {
      font-size: 7.5px;
      color: #4b5563;
      margin-bottom: 8px;
    }
    .signatures {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      font-family: monospace;
      font-size: 8px;
    }
    .sig-line {
      border-top: 1px solid #4b5563;
      padding-top: 3px;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <div>
      <div class="brand-title">MEHRAAB</div>
      <div class="brand-sub">LUXURY DINING SANCTUARY · BALLARD ESTATE · MUMBAI</div>
      <div class="doc-title">DAILY SERVICE BRIEFING & KITCHEN RUN SHEET</div>
    </div>
    <div class="meta-box">
      <div class="meta-date">${selectedDate === 'ALL' ? 'ALL DATES REGISTERED (FULL SANCTUARY REGISTER)' : `SERVICE DATE: ${selectedDate}`}</div>
      <div>Briefing Maître D': ${staffName}</div>
      <div>Generated: ${nowString} IST</div>
    </div>
  </div>

  <!-- KPI Grid -->
  <div class="kpi-grid">
    <div class="kpi-card">
      <span class="kpi-label">Total Covers</span>
      <div class="kpi-val">${totalCovers}</div>
      <span class="kpi-sub">Across ${totalTables} reservations</span>
    </div>

    <div class="kpi-card">
      <span class="kpi-label">VIP Dignitaries</span>
      <div class="kpi-val" style="color: #b45309;">👑 ${vipCount}</div>
      <span class="kpi-sub">Priority host protocol</span>
    </div>

    <div class="kpi-card alert">
      <span class="kpi-label">⚠️ Dietary Alerts</span>
      <div class="kpi-val">${allergyCount}</div>
      <span class="kpi-sub">Critical kitchen alerts</span>
    </div>

    <div class="kpi-card">
      <span class="kpi-label">Pavilion Allocation</span>
      <div style="font-family: monospace; font-size: 8.5px; margin-top: 3px; font-weight: 600;">
        ${Object.entries(pavilions)
          .map(([sp, cnt]) => `<span>${SPACE_LABELS[sp] ? SPACE_LABELS[sp].split(' ')[0] : sp}: ${cnt}p</span>`)
          .join(' · ')}
      </div>
      <span class="kpi-sub">${Object.keys(pavilions).length} active dining pavilions</span>
    </div>
  </div>

  <!-- Section 1: Kitchen Dietary Matrix -->
  <div class="dietary-section">
    <div class="dietary-header">
      <div class="dietary-title">⚠️ Executive Kitchen Dietary & Severe Allergen Matrix</div>
      <span style="font-family: monospace; font-size: 7.5px; font-weight: 700; color: #b91c1c;">EXPEDITOR STATION NOTICE</span>
    </div>

    ${
      allergyItems.length === 0
        ? `<div style="font-size: 8.5px; color: #4b5563; font-style: italic;">
             ✓ No critical allergies or severe dietary restrictions flagged for this shift. Standard cross-contamination protocols remain active.
           </div>`
        : `<div class="dietary-grid">
            ${allergyItems
              .map(
                (item) => `
              <div class="dietary-item">
                <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 9px; margin-bottom: 3px;">
                  <span>${item.table} · ${item.res.guest_name}</span>
                  <span style="font-family: monospace; color: #6b7280; font-size: 8px;">⏰ ${item.res.time_slot} (${item.res.party_size}p)</span>
                </div>
                <div>
                  ${item.alerts
                    .map(
                      (a) => `
                    <span class="badge ${
                      a.severity === 'CRITICAL'
                        ? 'badge-critical'
                        : a.severity === 'WARNING'
                          ? 'badge-warning'
                          : 'badge-info'
                    }">${a.label}</span>
                  `
                    )
                    .join('')}
                </div>
                ${
                  item.cleanNotes
                    ? `<div style="font-size: 8px; font-style: italic; color: #4b5563; margin-top: 2px;">“${item.cleanNotes}”</div>`
                    : ''
                }
              </div>
            `
              )
              .join('')}
           </div>`
    }
  </div>

  <!-- Section 2: Chronological Roster -->
  <div class="section-title">
    <span>Chronological Seating Schedule & Captains Roster</span>
    <span style="font-family: monospace; font-size: 8px; color: #6b7280;">${sorted.length} Allocations (${selectedDate === 'ALL' ? 'All Registered Dates' : selectedDate})</span>
  </div>

  <table class="roster">
    <thead>
      <tr>
        <th style="width: 25px; text-align: center;">Tick</th>
        <th style="width: ${selectedDate === 'ALL' ? '82px' : '45px'};">${selectedDate === 'ALL' ? 'Date & Time' : 'Time'}</th>
        <th style="width: 140px;">Table / Pavilion</th>
        <th>Guest Identity & Contact</th>
        <th style="width: 45px; text-align: center;">Covers</th>
        <th style="width: 65px; text-align: center;">Status</th>
        <th>Kitchen Directives & Special Notes</th>
      </tr>
    </thead>
    <tbody>
      ${sorted
        .map((r) => {
          const { table, cleanNotes } = extractTableAssignment(r.space_id, r.special_notes)
          const alerts = parseDietaryAlerts(r.special_notes)
          const isVip = Boolean(r.vip_status)
          return `
          <tr>
            <td style="text-align: center; vertical-align: middle;">
              <div class="chk-box"></div>
            </td>
            <td style="font-family: monospace; font-weight: 700; font-size: 8.5px;">
              ${selectedDate === 'ALL' ? `<div style="font-size: 7.5px; color: #6b7280; font-weight: normal; margin-bottom: 1px;">📅 ${r.date}</div>` : ''}
              <div style="color: #111827;">⏰ ${r.time_slot}</div>
            </td>
            <td>
              <div style="font-weight: 700;">${table}</div>
              <div style="font-size: 7.5px; color: #6b7280;">${SPACE_LABELS[r.space_id] || r.space_id}</div>
            </td>
            <td>
              <div style="font-weight: 700; font-size: 9.5px;">
                ${r.guest_name} ${isVip ? '<span style="font-size: 7.5px; background: #fef3c7; color: #92400e; padding: 1px 4px; border-radius: 2px; font-weight: 700;">👑 VIP</span>' : ''}
              </div>
              <div style="font-family: monospace; font-size: 7.5px; color: #6b7280;">${r.reference_code} · ${r.guest_phone}</div>
            </td>
            <td style="text-align: center; font-family: monospace; font-weight: 700;">${r.party_size}p</td>
            <td style="text-align: center;">
              <span style="font-family: monospace; font-size: 7.5px; font-weight: 700; padding: 1.5px 4px; border-radius: 2px; ${
                r.status === 'CONFIRMED'
                  ? 'background: #dcfce7; color: #166534;'
                  : r.status === 'SEATED'
                    ? 'background: #dbeafe; color: #1e40af;'
                    : r.status === 'PENDING'
                      ? 'background: #fef3c7; color: #92400e;'
                      : 'background: #f3f4f6; color: #374151;'
              }">
                ${r.status}
              </span>
            </td>
            <td>
              ${
                alerts.length > 0
                  ? `<div style="margin-bottom: 2px;">
                      ${alerts
                        .map(
                          (a) => `
                        <span style="font-size: 7px; font-weight: 700; background: #fee2e2; color: #991b1b; padding: 1px 4px; border-radius: 2px; text-transform: uppercase;">
                          ${a.label}
                        </span>
                      `
                        )
                        .join(' ')}
                     </div>`
                  : ''
              }
              <div style="font-style: italic; font-size: 8px; color: #4b5563;">
                ${cleanNotes || 'Standard Autumn Carte'}
              </div>
            </td>
          </tr>
        `
        })
        .join('')}
    </tbody>
  </table>

  <!-- Sommelier Protocols -->
  <div class="sommelier-box">
    <div class="sommelier-title">🍷 Sommelier & Cellar Directives For This Shift</div>
    <ul>
      <li><strong>Corner Alcove Banquette:</strong> Ensure <em>2019 Domaine de Chevalier</em> is cellared at 16°C and decanted 30 minutes before arrival.</li>
      <li><strong>Parda Salon VIP Banquets:</strong> Pre-infuse royal saffron kahwa and chilled botanical elixirs for non-alcoholic diners.</li>
      <li><strong>Solstice Tasting Pairings:</strong> Master Sommelier flight glasses to be inspected for zero water-spotting prior to twilight seating.</li>
    </ul>
  </div>

  <!-- Signoff -->
  <div class="footer-section">
    <div class="directives">
      <strong>Sanctuary Directives:</strong> Pre-service briefing complete at 17:45. Captains must inspect table linen alignment and silver cloches. Any unannounced dietary restrictions must be escalated to the Sous Chef immediately before cold appetizers are fired.
    </div>

    <div class="signatures">
      <div class="sig-line">
        <span style="color: #6b7280; display: block; font-size: 7px;">MAÎTRE D' ON DUTY</span>
        <strong>${staffName}</strong>
      </div>
      <div class="sig-line">
        <span style="color: #6b7280; display: block; font-size: 7px;">EXECUTIVE CHEF</span>
        <strong>Chef Samarpan Roy</strong>
      </div>
      <div class="sig-line">
        <span style="color: #6b7280; display: block; font-size: 7px;">HEAD SOMMELIER</span>
        <strong>Master Cellar Captain</strong>
      </div>
    </div>
  </div>

</body>
</html>`
}

export function compileBriefingPdf(
  reservations: BriefingReservation[],
  selectedDate: string,
  staffName: string = 'Staff Maître D’'
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const html = generateBriefingHtml(reservations, selectedDate, staffName)
      const tmpId = Math.random().toString(36).substring(2, 9)
      const tmpHtml = path.join(os.tmpdir(), `mehraab_briefing_${tmpId}.html`)
      const tmpPdf = path.join(os.tmpdir(), `mehraab_briefing_${tmpId}.pdf`)

      fs.writeFileSync(tmpHtml, html, 'utf8')

      const args = [
        '--headless=new',
        '--disable-gpu',
        '--no-pdf-header-footer',
        `--print-to-pdf=${tmpPdf}`,
        tmpHtml,
      ]

      cp.execFile(CHROME_PATH, args, (err) => {
        try {
          if (err) {
            return reject(err)
          }
          if (!fs.existsSync(tmpPdf)) {
            return reject(new Error('PDF output file was not created by Chrome.'))
          }
          const buffer = fs.readFileSync(tmpPdf)
          // Clean up
          try {
            fs.unlinkSync(tmpHtml)
            fs.unlinkSync(tmpPdf)
          } catch {
            // Ignore temp cleanup errors
          }
          resolve(buffer)
        } catch (readErr) {
          reject(readErr)
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

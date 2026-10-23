import { useState } from 'react'
import { PAVILION_FLOORPLANS, type TableSpot, type PavilionFloorplan } from '../../data/floorplanData'

interface InteractiveFloorplanProps {
  onSelectTable?: (table: TableSpot, pavilion: PavilionFloorplan) => void
  initialPavilionId?: string
  isModal?: boolean
  onClose?: () => void
}

export function InteractiveFloorplan({
  onSelectTable,
  initialPavilionId = 'grand-hall',
  isModal = false,
  onClose,
}: InteractiveFloorplanProps) {
  const [selectedPavilionId, setSelectedPavilionId] = useState<string>(initialPavilionId)
  const [selectedTable, setSelectedTable] = useState<TableSpot | null>(null)

  const activePavilion =
    PAVILION_FLOORPLANS.find((p) => p.id === selectedPavilionId) || PAVILION_FLOORPLANS[0]

  const handleTableClick = (table: TableSpot) => {
    setSelectedTable(table)
  }

  const handleConfirmSelection = () => {
    if (selectedTable && onSelectTable) {
      onSelectTable(selectedTable, activePavilion)
      if (onClose) onClose()
    }
  }

  const content = (
    <div className="bg-espresso/25 border border-gold/30 rounded-xs p-6 sm:p-8 backdrop-blur-md shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gold/20">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-sans block mb-1">
            Architectural Seating & Pavilions
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-ivory">Interactive Table Floorplan</h3>
        </div>

        {isModal && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="self-end sm:self-auto w-8 h-8 rounded-full border border-gold/30 text-ivory hover:text-gold flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Pavilion Navigation Tabs */}
      <div className="py-4 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-gold/15">
        {PAVILION_FLOORPLANS.map((pav) => {
          const isSelected = pav.id === selectedPavilionId
          return (
            <button
              key={pav.id}
              type="button"
              onClick={() => {
                setSelectedPavilionId(pav.id)
                setSelectedTable(null)
              }}
              className={`px-4 py-2 text-xs uppercase tracking-[0.2em] font-sans rounded-xs whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gold text-obsidian font-semibold shadow-md'
                  : 'bg-obsidian/60 text-ivory/70 border border-gold/20 hover:border-gold/40'
              }`}
            >
              {pav.name}
            </button>
          )
        })}
      </div>

      {/* Pavilion Dimensions & Subtitle */}
      <div className="py-3 flex items-center justify-between text-xs font-sans text-ivory/60 border-b border-gold/10">
        <span className="text-gold/90 font-light">{activePavilion.subtitle}</span>
        <span className="font-mono text-[11px]">{activePavilion.dimensions}</span>
      </div>

      {/* Main Floorplan Canvas / SVG Map */}
      <div className="relative mt-6 aspect-[16/10] bg-obsidian/90 border border-gold/30 rounded-xs overflow-hidden select-none">
        {/* Architectural Background Grid & Stone Fluting Texture */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#B99A68 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Decorative Arch Silhouettes */}
        <div className="absolute inset-x-0 top-0 flex justify-around pointer-events-none opacity-20">
          <svg className="w-24 h-16 stroke-gold" viewBox="0 0 48 56" fill="none">
            <path d="M 6 54 V 28 C 6 15 16 7 24 2 C 32 7 42 15 42 28 V 54" strokeWidth="1" />
          </svg>
          <svg className="w-24 h-16 stroke-gold" viewBox="0 0 48 56" fill="none">
            <path d="M 6 54 V 28 C 6 15 16 7 24 2 C 32 7 42 15 42 28 V 54" strokeWidth="1" />
          </svg>
          <svg className="w-24 h-16 stroke-gold" viewBox="0 0 48 56" fill="none">
            <path d="M 6 54 V 28 C 6 15 16 7 24 2 C 32 7 42 15 42 28 V 54" strokeWidth="1" />
          </svg>
        </div>

        {/* Legend Overlay */}
        <div className="absolute top-3 left-4 flex items-center gap-4 text-[10px] font-sans uppercase tracking-wider text-ivory/70 bg-obsidian/80 px-3 py-1.5 rounded-xs border border-gold/20 backdrop-blur-xs z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gold" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Seated</span>
          </div>
        </div>

        {/* Interactive Tables */}
        {activePavilion.tables.map((table) => {
          const isSelected = selectedTable?.id === table.id

          // Visual styles based on status
          const statusBorder =
            table.status === 'AVAILABLE'
              ? 'border-gold text-gold hover:bg-gold/20'
              : table.status === 'RESERVED'
              ? 'border-amber-500/60 text-amber-400 bg-amber-950/20'
              : 'border-emerald-500/60 text-emerald-300 bg-emerald-950/30'

          const activeBorder = isSelected
            ? 'ring-2 ring-gold ring-offset-2 ring-offset-obsidian scale-110 shadow-lg shadow-gold/30 bg-gold text-obsidian'
            : ''

          return (
            <button
              key={table.id}
              type="button"
              onClick={() => handleTableClick(table)}
              style={{
                left: `${table.x}%`,
                top: `${table.y}%`,
                width: `${table.width}%`,
                height: `${table.height}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute transition-all duration-300 border rounded-xs flex flex-col items-center justify-center p-1 text-center group cursor-pointer ${statusBorder} ${activeBorder}`}
            >
              <span className="font-mono text-[10px] font-bold tracking-wider leading-none">
                {table.number}
              </span>
              <span className="text-[8px] font-sans opacity-80 mt-0.5">
                {table.capacity}p
              </span>
              {table.vipOnly && (
                <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-amber-400 text-obsidian rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">
                  ★
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected Table Inspector Details */}
      {selectedTable && (
        <div className="mt-6 p-5 bg-obsidian/80 border border-gold/40 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-gold font-bold px-2 py-0.5 bg-espresso/60 border border-gold/30 rounded-xs">
                {selectedTable.number}
              </span>
              <h4 className="font-serif text-lg text-ivory">{selectedTable.name}</h4>
              <span className="text-[10px] font-sans uppercase tracking-wider text-ivory/60">
                · Max {selectedTable.capacity} Guests
              </span>
            </div>
            <p className="font-sans text-xs text-ivory/75 font-light leading-relaxed max-w-xl">
              {selectedTable.description}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {onSelectTable && selectedTable.status === 'AVAILABLE' && (
              <button
                type="button"
                onClick={handleConfirmSelection}
                className="px-5 py-2.5 bg-gold text-obsidian font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:bg-ivory transition-colors rounded-xs shadow-md"
              >
                Choose This Table
              </button>
            )}
            {selectedTable.status !== 'AVAILABLE' && (
              <span className="text-xs font-sans text-amber-300 italic">
                Currently {selectedTable.status.toLowerCase()} for this service.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )

  if (isModal) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-obsidian/90 backdrop-blur-md"
        onClick={onClose}
      >
        <div
          className="w-full max-w-4xl max-h-[92vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    )
  }

  return content
}

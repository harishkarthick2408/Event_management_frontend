import { useMemo, useState } from 'react'
import { AlertCircle, Sparkles, X } from 'lucide-react'
import { allocateSeats } from '../../utils/seatAlgorithm'

const sectionBadgeTone = {
  VIP: 'bg-purple-100 text-purple-700',
  Premium: 'bg-amber-100 text-amber-700',
  Regular: 'bg-gray-100 text-gray-700',
}

const SeatMap = ({
  seats,
  selectedSeats,
  onSeatClick,
  maxSelectable,
  showSections = true,
  readOnly = false,
  preferredSection = 'Regular',
  sectionFilter = 'all',
  onAutoAssign,
}) => {
  const [hoveredSeat, setHoveredSeat] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [shakeWarning, setShakeWarning] = useState(false)

  const selectedSeatSet = useMemo(() => new Set(selectedSeats || []), [selectedSeats])

  const toSeatId = (seat) => seat?.seatId || seat?.id

  const handleSeatClick = (seat) => {
    if (!seat) return

    // Ignore non-available seats
    if (seat.status === 'booked' || seat.status === 'blocked' || seat.status === 'held') {
      return
    }

    const seatId = toSeatId(seat)
    const isSelected = selectedSeatSet.has(seatId)

    if (isSelected) {
      // Deselect: remove from selected
      onSeatClick?.({ ...seat, seatId }, 'deselect')
    } else {
      // Select: check max limit
      if ((selectedSeats || []).length >= maxSelectable) {
        // Trigger shake animation on the seat map
        setShakeWarning(true)
        window.setTimeout(() => setShakeWarning(false), 600)
        return
      }
      onSeatClick?.({ ...seat, seatId }, 'select')
    }
  }

  const groupedByRow = useMemo(() => {
    const byRow = {}
    ;(seats || []).forEach((seat) => {
      if (!byRow[seat.row]) byRow[seat.row] = []
      byRow[seat.row].push(seat)
    })

    Object.keys(byRow).forEach((row) => {
      byRow[row] = byRow[row].sort((a, b) => a.number - b.number)
    })

    return byRow
  }, [seats])

  const rows = useMemo(() => Object.keys(groupedByRow).sort(), [groupedByRow])
  const seatsPerRow = useMemo(() => {
    if (!rows.length) return 0
    return groupedByRow[rows[0]].length
  }, [groupedByRow, rows])

  const getSeatClass = (seat) => {
    const seatId = toSeatId(seat)
    const isSelected = selectedSeatSet.has(seatId)
    const isAvailable = seat.status === 'available'
    const isBooked = seat.status === 'booked'
    const isHeld = seat.status === 'held'
    const isBlocked = seat.status === 'blocked'

    if (isSelected) {
      return 'bg-[#E8441A] border-[#E8441A] text-white cursor-pointer ring-2 ring-[#E8441A] ring-offset-1 seat-selected-pop'
    }

    if (isAvailable && seat.section === 'Regular') {
      return 'bg-white border-2 border-gray-300 text-gray-600 cursor-pointer hover:border-[#E8441A] hover:bg-orange-50 hover:scale-110 hover:shadow-md transition-all duration-150'
    }

    if (isAvailable && seat.section === 'Premium') {
      return 'bg-white border-2 border-amber-400 text-amber-700 cursor-pointer hover:bg-amber-50 hover:scale-110 hover:shadow-md transition-all duration-150'
    }

    if (isAvailable && seat.section === 'VIP') {
      return 'bg-white border-2 border-purple-400 text-purple-700 cursor-pointer hover:bg-purple-50 hover:scale-110 hover:shadow-md transition-all duration-150'
    }

    if (isBooked) {
      return 'bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
    }

    if (isHeld) {
      return 'bg-amber-300 border-amber-300 text-white cursor-not-allowed'
    }

    if (isBlocked) {
      return 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
    }

    return 'bg-white border-2 border-gray-300 text-gray-600'
  }

  const showDividerAfter = (rowLabel) => {
    const current = groupedByRow[rowLabel]?.[0]
    const rowIndex = rows.indexOf(rowLabel)
    const next = groupedByRow[rows[rowIndex + 1]]?.[0]
    if (!current || !next) return null

    if (current.section === 'VIP' && next.section === 'Premium') {
      return 'Premium Section'
    }

    if (current.section === 'Premium' && next.section === 'Regular') {
      return 'Regular Section'
    }

    return null
  }

  const handleSmartAssign = () => {
    const picks = allocateSeats(seats || [], maxSelectable || 1, preferredSection)
    if (!picks || !picks.length) return

    if (onAutoAssign) {
      onAutoAssign(picks)
      return
    }

    picks.forEach((seat) => onSeatClick?.(seat))
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-xl">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes seatPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1.1); }
        }
        .seat-selected-pop {
          animation: seatPop 0.2s ease-out forwards;
        }
      `}</style>

      <div className="relative mb-5 overflow-hidden rounded-t-2xl bg-gradient-to-r from-[#1A1A2E] to-[#2d2d4e] py-4 text-center">
        <div className="absolute left-0 top-0 h-full w-10 border-r border-white/20" />
        <div className="absolute right-0 top-0 h-full w-10 border-l border-white/20" />
        <p className="font-bold tracking-[0.2em] text-white">🎭 STAGE / SCREEN</p>
      </div>

      {showSections && (
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">⭐ VIP SECTION</span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">💎 PREMIUM SECTION</span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">🎫 REGULAR SECTION</span>
        </div>
      )}

      {selectedSeatSet.size >= maxSelectable && (
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>
            Maximum <strong>{maxSelectable}</strong> seat(s) selected.
            Deselect a seat to choose a different one.
          </span>
        </div>
      )}

      <div className="overflow-auto rounded-2xl border border-gray-100 p-3">
        <div
          className="space-y-1.5"
          style={shakeWarning ? {
            animation: 'shake 0.4s ease-in-out'
          } : {}}
        >
          {rows.map((row) => {
            const rowSeats = groupedByRow[row]
            const dividerText = showDividerAfter(row)
            const rowSection = rowSeats?.[0]?.section
            const rowStripe = rowSection === 'VIP' ? 'border-l-purple-500' : rowSection === 'Premium' ? 'border-l-amber-500' : 'border-l-gray-300'

            return (
              <div key={row}>
                <div className={`mb-1.5 flex items-center gap-2 border-l-4 pl-2 ${rowStripe}`}>
                  <span className="w-8 rounded bg-gray-100 px-2 py-1 text-center text-xs font-bold text-gray-500">{row}</span>

                  <div className="flex flex-1 items-center gap-1 sm:gap-1.5">
                    {(rowSeats || []).map((seat, idx) => {
                      const seatId = toSeatId(seat)
                      const isSelected = selectedSeatSet.has(seatId)
                      const isBooked = seat.status === 'booked'
                      const isHeld = seat.status === 'held'
                      const isBlocked = seat.status === 'blocked'
                      const disabled = readOnly || isBooked || isHeld || isBlocked
                      const hiddenByFilter = sectionFilter !== 'all' && seat.section !== sectionFilter

                      const label = `Seat ${seatId}, ${seat.section}, ${seat.status === 'available' ? 'Available' : seat.status}, INR ${seat.price}`

                      if (idx === Math.floor(seatsPerRow / 2)) {
                        return (
                          <div key={`${seatId}-with-aisle`} className="flex items-center gap-1 sm:gap-1.5">
                            <div className="w-4 sm:w-6" />
                            <button
                              type="button"
                              aria-label={label}
                              title={`${seatId} - ${seat.section} - ₹${seat.price} - ${seat.status}`}
                              onClick={() => handleSeatClick({ ...seat, seatId })}
                              onMouseEnter={(event) => {
                                setHoveredSeat({ ...seat, seatId })
                                const rect = event.currentTarget.getBoundingClientRect()
                                setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top })
                              }}
                              onMouseLeave={() => setHoveredSeat(null)}
                              className={`h-5 w-5 rounded-md border text-[10px] font-bold transition-all duration-150 sm:h-8 sm:w-8 sm:text-xs ${getSeatClass(seat)} ${hiddenByFilter ? 'opacity-20' : ''}`}
                              disabled={disabled || hiddenByFilter}
                            >
                              {isBlocked ? <X className="mx-auto h-3 w-3" /> : isSelected ? '✓' : seat.number}
                            </button>
                          </div>
                        )
                      }

                      return (
                        <button
                          key={seatId}
                          type="button"
                          aria-label={label}
                          title={`${seatId} - ${seat.section} - ₹${seat.price} - ${seat.status}`}
                          onClick={() => handleSeatClick({ ...seat, seatId })}
                          onMouseEnter={(event) => {
                            setHoveredSeat({ ...seat, seatId })
                            const rect = event.currentTarget.getBoundingClientRect()
                            setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top })
                          }}
                          onMouseLeave={() => setHoveredSeat(null)}
                          className={`h-5 w-5 rounded-md border text-[10px] font-bold transition-all duration-150 sm:h-8 sm:w-8 sm:text-xs ${getSeatClass(seat)} ${hiddenByFilter ? 'opacity-20' : ''}`}
                          disabled={disabled || hiddenByFilter}
                        >
                          {isBlocked ? <X className="mx-auto h-3 w-3" /> : isSelected ? '✓' : seat.number}
                        </button>
                      )
                    })}
                  </div>

                  <span className="hidden w-8 rounded bg-gray-100 px-2 py-1 text-center text-xs font-bold text-gray-500 sm:block">{row}</span>
                </div>

                {dividerText && (
                  <div className="my-2 text-center text-xs font-semibold text-gray-400">── {dividerText} ──</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${sectionBadgeTone[preferredSection] || 'bg-gray-100 text-gray-700'}`}>
          Preferred: {preferredSection}
        </span>
        <button
          type="button"
          onClick={handleSmartAssign}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E8441A] px-4 py-2 text-sm font-semibold text-[#E8441A] transition-all hover:bg-[#E8441A] hover:text-white"
        >
          <Sparkles className="h-4 w-4" />
          Auto-assign best seats for me
        </button>
      </div>

      {hoveredSeat && (
        <div
          className="pointer-events-none fixed z-50 rounded-xl bg-[#1A1A2E] px-3 py-2 text-xs text-white shadow-xl"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y - 70,
            transform: 'translateX(-50%)'
          }}
        >
          <p className="font-bold">{hoveredSeat.seatId}</p>
          <p className="text-gray-300">{hoveredSeat.section}</p>
          <p className="font-semibold text-[#E8441A]">₹{hoveredSeat.price}</p>
          <p className="capitalize text-gray-400">{hoveredSeat.status}</p>
        </div>
      )}
    </div>
  )
}

export default SeatMap

const sectionTone = {
  VIP: 'bg-purple-100 text-purple-700',
  Premium: 'bg-amber-100 text-amber-700',
  Regular: 'bg-gray-100 text-gray-700',
}

const statusTone = {
  available: 'bg-green-100 text-green-700',
  booked: 'bg-gray-100 text-gray-600',
  held: 'bg-amber-100 text-amber-700',
  blocked: 'bg-red-100 text-red-700',
}

const formatStatus = (status) => {
  if (!status) return 'Unknown'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const SeatTooltip = ({ seat, position, visible }) => {
  if (!visible || !seat) return null

  const x = Math.min((position?.x || 0) + 12, window.innerWidth - 210)
  const y = Math.max((position?.y || 0) - 140, 12)

  return (
    <div
      className="pointer-events-none fixed z-50 w-48 rounded-xl bg-[#1A1A2E] p-3 text-white shadow-2xl"
      style={{ left: x, top: y }}
    >
      <p className="text-lg font-bold">{seat.id}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${sectionTone[seat.section] || 'bg-gray-100 text-gray-700'}`}>
          {seat.section}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusTone[seat.status] || 'bg-gray-100 text-gray-700'}`}>
          {formatStatus(seat.status)}
        </span>
      </div>
      <p className="mt-2 text-sm">Price: <span className="font-semibold">INR {Number(seat.price || 0).toLocaleString('en-IN')}</span></p>
      <p className="mt-1 text-xs text-gray-300">Row {seat.row}, Seat {seat.number}</p>
      <div className="absolute -bottom-1 left-5 h-2 w-2 rotate-45 bg-[#1A1A2E]" />
    </div>
  )
}

export default SeatTooltip

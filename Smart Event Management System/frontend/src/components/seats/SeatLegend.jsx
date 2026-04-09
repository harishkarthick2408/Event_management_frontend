import { X } from 'lucide-react'

const itemBase = 'inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600'

const Dot = ({ className, blocked = false }) => (
  <span className={`inline-flex h-4 w-4 items-center justify-center rounded ${className}`}>
    {blocked ? <X className="h-3 w-3" /> : null}
  </span>
)

const SeatLegend = () => {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <div className={itemBase}><Dot className="border-2 border-gray-300 bg-white" />Available</div>
      <div className={itemBase}><Dot className="border border-[#E8441A] bg-[#E8441A] text-white" />Selected</div>
      <div className={itemBase}><Dot className="border border-amber-400 bg-amber-400 text-white" />Held</div>
      <div className={itemBase}><Dot className="border border-gray-400 bg-gray-400 text-white" />Booked</div>
      <div className={itemBase}><Dot className="border border-gray-200 bg-gray-200 text-gray-400" blocked />Blocked</div>
      <div className={itemBase}><Dot className="ring-2 ring-purple-400 border border-gray-200 bg-white" />VIP</div>
      <div className={itemBase}><Dot className="ring-2 ring-amber-400 border border-gray-200 bg-white" />Premium</div>
      <div className={itemBase}><Dot className="ring-2 ring-gray-300 border border-gray-200 bg-white" />Regular</div>
    </div>
  )
}

export default SeatLegend

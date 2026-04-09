import { useEffect, useMemo, useState } from 'react'
import { Clock } from 'lucide-react'

const HOLD_DURATION = 5 * 60

const SeatTimer = ({ heldUntil, onExpire }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    if (!heldUntil) return 0
    return Math.max(0, Math.floor((heldUntil - Date.now()) / 1000))
  })
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    if (!heldUntil) {
      setRemainingSeconds(0)
      setExpired(false)
      return undefined
    }

    setExpired(false)
    const tick = () => {
      const next = Math.max(0, Math.floor((heldUntil - Date.now()) / 1000))
      setRemainingSeconds(next)
      if (next === 0) {
        setExpired(true)
      }
    }

    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [heldUntil])

  useEffect(() => {
    if (expired) {
      onExpire?.()
    }
  }, [expired, onExpire])

  const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, '0')
  const secs = String(remainingSeconds % 60).padStart(2, '0')

  const progressPercent = useMemo(() => {
    if (!heldUntil) return 0
    return Math.max(0, Math.min(100, (remainingSeconds / HOLD_DURATION) * 100))
  }, [remainingSeconds, heldUntil])

  const toneClass = remainingSeconds > 120
    ? 'text-green-600 bg-green-50 border-green-200'
    : remainingSeconds > 60
      ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-red-600 bg-red-50 border-red-200 animate-pulse'

  if (!heldUntil) return null

  return (
    <div className={`mt-4 rounded-xl border p-3 ${toneClass}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 font-semibold">
          <Clock className="h-4 w-4" />
          {remainingSeconds > 0 ? `Seats held for ${mins}:${secs}` : 'Time expired! Seats released.'}
        </div>
        <span className="text-xs font-bold">{Math.round(progressPercent)}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-white/80">
        <div className="h-full rounded-full bg-current transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
      </div>
    </div>
  )
}

export default SeatTimer

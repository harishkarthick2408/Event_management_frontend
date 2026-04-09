// Generate full seat layout for an event
export const generateSeatLayout = (config) => {
  const { rows, seatsPerRow, vipRows, premiumRows } = config
  const seats = []

  for (let r = 0; r < rows; r++) {
    const rowLabel = String.fromCharCode(65 + r) // A, B, C...
    const sectionType =
      r < vipRows ? 'VIP' :
      r < vipRows + premiumRows ? 'Premium' : 'Regular'

    for (let s = 1; s <= seatsPerRow; s++) {
      seats.push({
        id: rowLabel + s,
        row: rowLabel,
        number: s,
        section: sectionType,
        status: 'available', // available | held | booked | blocked
        heldBy: null,
        heldUntil: null,
        price: sectionType === 'VIP' ? 2999 :
          sectionType === 'Premium' ? 1499 : 999,
      })
    }
  }
  return seats
}

// Randomly pre-book some seats to simulate existing bookings
export const simulateExistingBookings = (seats, percentage = 30) => {
  return seats.map((seat) => {
    if (seat.section === 'VIP') return seat
    const shouldBook = Math.random() * 100 < percentage
    return shouldBook ? { ...seat, status: 'booked' } : seat
  })
}

// CORE ALGORITHM: Smart seat allocation
// For single booking: find best available seat
// For group booking: find consecutive seats in same row
// Avoids creating isolated single gaps
export const allocateSeats = (seats, quantity, preferredSection = 'Regular') => {
  const available = seats.filter((s) =>
    s.status === 'available' && s.section === preferredSection
  )

  if (available.length < quantity) return null

  // Group by row
  const byRow = {}
  available.forEach((seat) => {
    if (!byRow[seat.row]) byRow[seat.row] = []
    byRow[seat.row].push(seat)
  })

  // For group: find consecutive seats in same row
  if (quantity > 1) {
    for (const row in byRow) {
      const rowSeats = byRow[row].sort((a, b) => a.number - b.number)
      // Find consecutive sequence of length = quantity
      for (let i = 0; i <= rowSeats.length - quantity; i++) {
        const slice = rowSeats.slice(i, i + quantity)
        const isConsecutive = slice.every((s, idx) =>
          idx === 0 || s.number === slice[idx - 1].number + 1
        )
        if (isConsecutive) {
          // Check it doesn't leave isolated single seat gap
          const wouldIsolate = checkIsolation(seats, slice)
          if (!wouldIsolate) return slice
        }
      }
    }

    // Priority 2: Use largest contiguous block and fill nearest seats.
    const largestBlock = findLargestConsecutiveBlock(byRow)
    if (largestBlock.length > 0 && largestBlock.length < quantity) {
      const remainingCount = quantity - largestBlock.length
      const pool = available.filter((seat) => !largestBlock.some((picked) => picked.id === seat.id))
      const nearest = pool
        .sort((a, b) => {
          const aDistance = Math.abs(a.number - largestBlock[largestBlock.length - 1].number)
          const bDistance = Math.abs(b.number - largestBlock[largestBlock.length - 1].number)
          if (a.row === largestBlock[0].row && b.row !== largestBlock[0].row) return -1
          if (b.row === largestBlock[0].row && a.row !== largestBlock[0].row) return 1
          return aDistance - bDistance
        })
        .slice(0, remainingCount)

      const mixedGroup = [...largestBlock, ...nearest]
      if (mixedGroup.length === quantity) return mixedGroup
    }

    // Fallback: find best proximity group across rows
    return findProximityGroup(available, quantity)
  }

  // For single: pick first non-isolating seat
  for (const seat of available) {
    if (!checkIsolation(seats, [seat])) return [seat]
  }
  return [available[0]]
}

const findLargestConsecutiveBlock = (byRow) => {
  let best = []
  for (const row in byRow) {
    const sorted = byRow[row].sort((a, b) => a.number - b.number)
    let current = []
    for (let i = 0; i < sorted.length; i++) {
      if (i === 0 || sorted[i].number === sorted[i - 1].number + 1) {
        current.push(sorted[i])
      } else {
        if (current.length > best.length) best = [...current]
        current = [sorted[i]]
      }
    }
    if (current.length > best.length) best = [...current]
  }
  return best
}

// Check if booking these seats would isolate a single seat
export const checkIsolation = (allSeats, seatsToBook) => {
  const bookingIds = new Set(seatsToBook.map((s) => s.id))
  for (const seat of seatsToBook) {
    const leftId = seat.row + (seat.number - 1)
    const rightId = seat.row + (seat.number + 1)
    const left = allSeats.find((s) => s.id === leftId)
    const right = allSeats.find((s) => s.id === rightId)
    const leftTaken = !left || left.status !== 'available' || bookingIds.has(leftId)
    const rightTaken = !right || right.status !== 'available' || bookingIds.has(rightId)
    if (leftTaken && rightTaken) return true
  }
  return false
}

// Fallback: find nearest available seats by proximity
export const findProximityGroup = (available, quantity) => {
  return available.slice(0, quantity)
}

// Hold seats temporarily (5 minute timer)
export const holdSeats = (seats, seatsToHold, userId) => {
  const holdUntil = Date.now() + 5 * 60 * 1000 // 5 minutes
  const holdIds = new Set(seatsToHold.map((s) => s.id))
  return seats.map((seat) =>
    holdIds.has(seat.id)
      ? { ...seat, status: 'held', heldBy: userId, heldUntil: holdUntil }
      : seat
  )
}

// Confirm booking (after payment)
export const confirmSeats = (seats, seatsToConfirm) => {
  const confirmIds = new Set(seatsToConfirm.map((s) => s.id))
  return seats.map((seat) =>
    confirmIds.has(seat.id)
      ? { ...seat, status: 'booked', heldBy: null, heldUntil: null }
      : seat
  )
}

// Release expired holds
export const releaseExpiredHolds = (seats) => {
  const now = Date.now()
  return seats.map((seat) =>
    seat.status === 'held' && seat.heldUntil < now
      ? { ...seat, status: 'available', heldBy: null, heldUntil: null }
      : seat
  )
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://event-management-backend-x0dp.onrender.com';

const authHeaders = () => {
  const token = localStorage.getItem('eventpro_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const mapApiTicketToUi = (t) => {
  const checkedInTime = t.checkedInAt
    ? new Date(t.checkedInAt).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : null;

  const bookingId = (t.qrCode || '').slice(-8).toUpperCase();

  return {
    id: t._id,
    name: t.attendeeName,
    email: t.attendeeEmail,
    ticketType: t.ticketType || 'Standard',
    eventId: t.event,
    checkedIn: !!t.checkedIn,
    checkedInTime,
    bookingId,
    qrCode: t.qrCode,
    registrationDate: t.createdAt || t.updatedAt || null,
  };
};

export const checkinService = {
  getTicketsByEvent: async (eventId) => {
    const res = await fetch(`${API_BASE_URL}/api/tickets/event/${eventId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
    });
    const data = await res.json().catch(() => []);
    if (!res.ok) {
      throw new Error(data.message || 'Failed to load attendees');
    }
    return data.map(mapApiTicketToUi);
  },

  checkInWithQr: async (qrCode) => {
    const res = await fetch(`${API_BASE_URL}/api/checkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ qrCode }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Failed to check in');
    }
    return mapApiTicketToUi(data.ticket);
  },

  updateCheckInStatus: async (ticketId, checkedIn) => {
    const res = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}/checkin`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ checkedIn }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update check-in status');
    }
    return mapApiTicketToUi(data);
  },
};

export default checkinService;

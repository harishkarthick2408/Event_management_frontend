const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const authHeaders = () => {
  const token = localStorage.getItem('eventpro_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const seatService = {
  getSeatStats: async (eventId) => {
    const res = await fetch(`${API_BASE_URL}/api/seats/stats/${eventId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Failed to load seat stats');
    }
    return data.stats;
  },

  getSeatsForEvent: async (eventId) => {
    const res = await fetch(`${API_BASE_URL}/api/seats/event/${eventId}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Failed to load seats');
    }
    return data;
  },
};

export default seatService;

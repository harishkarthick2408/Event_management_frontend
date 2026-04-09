const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://event-management-backend-x0dp.onrender.com';

const authHeaders = () => {
  const token = localStorage.getItem('eventpro_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const feedbackService = {
  // Create feedback for an event
  createFeedback: async (payload) => {
    const res = await fetch(`${API_BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Failed to submit feedback');
    }
    return data;
  },

  // Get raw feedback list for an event
  getFeedbackByEvent: async (eventId) => {
    const res = await fetch(`${API_BASE_URL}/api/feedback/event/${eventId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
    });
    const data = await res.json().catch(() => []);
    if (!res.ok) {
      throw new Error(data.message || 'Failed to load feedback');
    }
    return data;
  },

  // Optional: get pre-aggregated summary
  getFeedbackSummary: async (eventId) => {
    const res = await fetch(`${API_BASE_URL}/api/feedback/event/${eventId}/summary`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Failed to load feedback summary');
    }
    return data;
  },
};

export default feedbackService;

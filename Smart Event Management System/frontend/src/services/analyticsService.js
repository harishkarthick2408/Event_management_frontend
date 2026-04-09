const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const authHeaders = () => {
  const token = localStorage.getItem('eventpro_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const analyticsService = {
  getOverview: async () => {
    const res = await fetch(`${API_BASE_URL}/api/analytics/overview`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Failed to load analytics');
    }
    return data;
  },
};

export default analyticsService;

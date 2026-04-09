const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://event-management-backend-x0dp.onrender.com';

const authHeaders = () => {
  const token = localStorage.getItem('eventpro_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const paymentService = {
  createOrder: async ({ amount, currency = 'INR', receipt, notes }) => {
    const res = await fetch(`${API_BASE_URL}/api/payments/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ amount, currency, receipt, notes }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Failed to create payment order');
    }
    return data;
  },

  verifyPayment: async (payload) => {
    const res = await fetch(`${API_BASE_URL}/api/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Failed to verify payment');
    }
    return data;
  },
};

export default paymentService;
